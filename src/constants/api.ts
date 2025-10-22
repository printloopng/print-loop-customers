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
    MARK_READ: "notifications/mark-read",
    MARK_ALL_READ: "notifications/mark-all-read",
    MARK_ARCHIVED: "notifications/mark-archived",
    STATS: "notifications/stats",
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
