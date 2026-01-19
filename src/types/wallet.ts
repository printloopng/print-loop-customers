export enum TRANSACTION_TYPE {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TRANSACTION_STATUS {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  reference: string;
  type: TRANSACTION_TYPE;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TRANSACTION_STATUS;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
