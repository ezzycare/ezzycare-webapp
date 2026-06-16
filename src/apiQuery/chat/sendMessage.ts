import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type InfiniteData,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import {
  ChatHistoryResponse,
  ChatMessage,
  ConversationsResponse,
  SendMessageData,
  SendMessageParams,
  SendMessageResponse,
} from './types';

export const sendMessage = async (
  params: SendMessageParams
): Promise<SendMessageResponse> => {
  try {
    const { sender: _sender, ...body } = params;
    const response = await axiosClient.post<SendMessageResponse>(
      '/chat/send',
      body
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useSendMessageMutation = (
  options?: UseMutationOptions<
    SendMessageResponse,
    unknown,
    SendMessageParams,
    {
      previousConversations: InfiniteData<ConversationsResponse> | undefined;
      previousHistory: ChatHistoryResponse | undefined;
    }
  >
): UseMutationResult<SendMessageResponse, unknown, SendMessageParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onMutate: async ({ receiverId, message, sender }) => {
      const peerId = String(receiverId);
      const currentUserId = useAuthStore.getState().user?.id ?? '';

      await queryClient.cancelQueries({
        queryKey: ['chat', 'conversations'],
      });
      await queryClient.cancelQueries({
        queryKey: ['chat', 'history', peerId],
      });

      const previousConversations = queryClient.getQueryData<
        InfiniteData<ConversationsResponse>
      >(['chat', 'conversations', 'infinite']);

      const previousHistory = queryClient.getQueryData<ChatHistoryResponse>([
        'chat',
        'history',
        peerId,
      ]);

      // Optimistic: update conversations sidebar
      queryClient.setQueryData<InfiniteData<ConversationsResponse>>(
        ['chat', 'conversations', 'infinite'],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data
                ? {
                    ...page.data,
                    items: page.data.items.map((c) =>
                      c.peer.id === peerId
                        ? {
                            ...c,
                            lastMessage: {
                              id: crypto.randomUUID(),
                              senderId: currentUserId,
                              receiverId: peerId,
                              message,
                              isRead: true,
                              createdAt: new Date().toISOString(),
                            },
                          }
                        : c
                    ),
                  }
                : page.data,
            })),
          };
        }
      );

      // Optimistic: push message into chat history
      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        message,
        senderId: currentUserId,
        receiverId: peerId,
        isRead: true,
        createdAt: new Date().toISOString(),
        sender: sender ?? {
          firstName: '',
          lastName: '',
          profileImage: null,
        },
      };

      queryClient.setQueryData<ChatHistoryResponse>(
        ['chat', 'history', peerId],
        (old) => {
          if (!old) {
            return { success: true, message: '', data: [optimisticMessage] };
          }
          return {
            ...old,
            data: [...(old.data ?? []), optimisticMessage],
          };
        }
      );

      return { previousConversations, previousHistory };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          ['chat', 'conversations', 'infinite'],
          context.previousConversations
        );
      }
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ['chat', 'history', String(_vars.receiverId)],
          context.previousHistory
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['chat', 'history', String(variables.receiverId)],
      });
    },

    ...options,
  });
};
