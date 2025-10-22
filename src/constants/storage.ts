export const STORAGE_KEYS = {
  USER_INFO: "print-loop-user-info",
  PUSH_SUBSCRIPTION: "print-loop-push-subscription",
  REMEMBER_INFO: "print-loop-remember-info",
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
