export const API_ROUTES = {
  AUTH: {
    LOGIN: "auth/login-email",
    FORGOT_PASSWORD: "auth/forgot-password",
    RESET_PASSWORD: "auth/reset-password",
    RESEND_OTP: "auth/resend-otp",
    VERIFY_OTP: "auth/verify-email",
    HQ_ADMIN_LOGIN: "auth/login-email",
    USER: "auth/me",
  },

  NOTIFICATIONS: {
    LIST: "notifications",
    DETAIL: (id: string) => `notifications/${id}`,
    UPDATE: (id: string) => `notifications/${id}`,
    DELETE: (id: string) => `notifications/${id}`,
    MARK_READ: (id: string) => `notifications/${id}/read`,
    MARK_ALL_READ: "notifications/read-all",
    MARK_ARCHIVED: "notifications/mark-archived",
    STATS: "notifications/stats",
  },

  PRINT_JOBS: {
    LIST: "print-jobs",
    CREATE: "print-jobs",
    DETAIL: (id: string) => `print-jobs/${id}`,
    UPDATE: (id: string) => `print-jobs/${id}`,
    DELETE: (id: string) => `print-jobs/${id}`,
    CANCEL: (id: string) => `print-jobs/${id}/cancel`,
    UPLOAD: "print-jobs/upload",
    OPTIONS: "print-jobs/options",
    STATS: "print-jobs/stats",
  },

  PAYMENTS: {
    LIST: "payments",
    CREATE: "payments",
    DETAIL: (id: string) => `payments/${id}`,
    VERIFY: (reference: string) => `payments/verify/${reference}`,
  },

  WALLET: {
    FUND: "wallet/fund",
    VERIFY: (reference: string) => `wallet/verify/${reference}`,
    BALANCE: "wallet/balance",
    TRANSACTIONS: "wallet/transactions",
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
