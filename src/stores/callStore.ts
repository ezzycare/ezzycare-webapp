import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { create } from 'zustand';

type CallRole = ACCOUNT_TYPE;

interface CallState {
  active: boolean;
  role: CallRole | null;

  roomName: string | null;
  token: string | null;
  uid: number | null;

  callerName?: string;

  setIncomingCall: (data: {
    roomName: string;
    token: string;
    uid: number;
    role?: CallRole;
    callerName?: string;
  }) => void;

  clearCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  active: false,
  role: null,

  roomName: null,
  token: null,
  uid: null,
  callerName: undefined,

  setIncomingCall: (data) =>
    set({
      active: true,
      role: data.role ?? 'SEEKER',
      roomName: data.roomName,
      token: data.token,
      uid: Number(data.uid),
      callerName: data.callerName,
    }),

  clearCall: () =>
    set({
      active: false,
      role: null,
      roomName: null,
      token: null,
      uid: null,
      callerName: undefined,
    }),
}));
