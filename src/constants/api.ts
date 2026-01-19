export const API_ROUTES = {
  AUTH: {
    LOGIN: "customer/auth/login-email",
    FORGOT_PASSWORD: "customer/auth/forgot-password",
    RESET_PASSWORD: "customer/auth/reset-password",
    RESEND_OTP: "customer/auth/resend-otp",
    VERIFY_OTP: "customer/auth/verify-email",
    HQ_ADMIN_LOGIN: "customer/auth/login-email",
    USER: "customer/auth/me",
  },
  UPLOAD: {
    PRESIGNED_URL: "uploads/presigned-url",
  },

  NOTIFICATIONS: {
    LIST: "customer/notifications",
    DETAIL: (id: string) => `customer/notifications/${id}`,
    UPDATE: (id: string) => `customer/notifications/${id}`,
    DELETE: (id: string) => `customer/notifications/${id}`,
    MARK_READ: (id: string) => `customer/notifications/${id}/read`,
    MARK_ALL_READ: "customer/notifications/read-all",
    MARK_ARCHIVED: "customer/notifications/mark-archived",
    STATS: "customer/notifications/stats",
  },

  PRINT_JOBS: {
    LIST: "customer/print-jobs",
    CREATE: "customer/print-jobs",
    DETAIL: (id: string) => `customer/print-jobs/${id}`,
    UPDATE: (id: string) => `customer/print-jobs/${id}`,
    DELETE: (id: string) => `customer/print-jobs/${id}`,
    CANCEL: (id: string) => `customer/print-jobs/${id}/cancel`,
    UPLOAD: "customer/print-jobs/upload",
    OPTIONS: "customer/print-jobs/options",
    STATS: "customer/print-jobs/stats",
    CALCULATE_PRICE: "customer/print-jobs/calculate-price",
  },

  PAYMENTS: {
    LIST: "customer/payments",
    CREATE: "customer/payments",
    DETAIL: (id: string) => `customer/payments/${id}`,
    VERIFY: (reference: string) => `customer/payments/verify/${reference}`,
  },

  WALLET: {
    FUND: "customer/wallet/fund",
    VERIFY: (reference: string) => `customer/wallet/verify/${reference}`,
    BALANCE: "customer/wallet/balance",
    TRANSACTIONS: "customer/wallet/transactions",
  },
};

export const CONST_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL,
  assetUrl: import.meta.env.VITE_ASSET_URL,
  timeout: 60000,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
} as const;

export type ApiKey = keyof typeof API_ROUTES;
export type ApiEndpoint = (typeof API_ROUTES)[ApiKey] extends {
  [key: string]: string;
}
  ? (typeof API_ROUTES)[ApiKey][keyof (typeof API_ROUTES)[ApiKey]]
  : (typeof API_ROUTES)[ApiKey];
