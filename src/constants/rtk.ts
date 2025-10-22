export const RTK_TAGS = {
  USERS: "USERS",
  AUTH: "AUTH",
  NOTIFICATIONS: "NOTIFICATIONS",
} as const;

export type RtkTag = keyof typeof RTK_TAGS;
