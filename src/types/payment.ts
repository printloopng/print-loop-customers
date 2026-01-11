export enum PAYMENT_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum PAYMENT_METHOD {
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  WALLET = "wallet",
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  status: PAYMENT_STATUS;
  method: PAYMENT_METHOD;
  userId: string;
  printJobId?: string;
  description?: string;
  metadata?: Record<string, any>;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  method: PAYMENT_METHOD;
  printJobId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentResponse {
  payment: Payment;
  verified: boolean;
  message: string;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PAYMENT_STATUS;
  startDate?: string;
  endDate?: string;
}
