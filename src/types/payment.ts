export enum PAYMENT_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum PAYMENT_METHOD {
  WALLET = "wallet",
  PAYSTACK = "paystack",
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
  paymentMethod: PAYMENT_METHOD;
  printJobId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

