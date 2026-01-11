export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },

  APP: {
    DASHBOARD: "/dashboard",
    PREVIEW: "/preview",
    PAYMENT: "/payment",
    WALLET: "/wallet",
    PRINT_JOBS: "/print-jobs",
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type AuthRouteKey = keyof typeof ROUTES.AUTH;
export type AppRouteKey = keyof typeof ROUTES.APP;
