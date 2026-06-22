import { ApiResponse } from '@/apiQuery/types';
import { BankAccount } from '../auth/types';

export interface Bank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export type ListBanksResponse = ApiResponse<Bank[]>;

export interface WalletBalance {
  balance: number;
  lockBalance: number;
  currency: string;
}

export type WalletBalanceResponse = ApiResponse<WalletBalance>;

export interface WalletTransaction {
  id: number;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: string;
  reference: string;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface WalletTransactionMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface WalletTransactionsData {
  items: WalletTransaction[];
  meta: WalletTransactionMeta;
}

export type WalletTransactionsResponse = ApiResponse<WalletTransactionsData>;

export interface Payout {
  id: number;
  userId: string;
  amount: number;
  status: string;
  reference: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createdAt: string;
}

export interface PayoutMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PayoutsData {
  items: Payout[];
  meta: PayoutMeta;
}

export type PayoutsResponse = ApiResponse<PayoutsData>;

export type BankAccountsResponse = ApiResponse<BankAccount[]>;

export interface AddBankAccountParams {
  bankId: number;
  name: string;
  bankName: string;
  accountNumber: string;
}

export interface VerifyBankAccountParams {
  bankId: number;
  accountNumber: string;
}

export interface VerifyBankAccountData {
  account_name: string;
  account_number: string;
  bank_id: string;
}

export type VerifyBankAccountResponse = ApiResponse<VerifyBankAccountData>;
