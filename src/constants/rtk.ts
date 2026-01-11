export const RTK_TAGS = {
  USERS: "USERS",
  AUTH: "AUTH",
  NOTIFICATIONS: "NOTIFICATIONS",
  PRINT_JOBS: "PRINT_JOBS",
  PAYMENTS: "PAYMENTS",
  WALLET: "WALLET",
} as const;

export type RtkTag = keyof typeof RTK_TAGS;
