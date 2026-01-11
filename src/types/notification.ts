export enum NOTIFICATION_TYPE {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NOTIFICATION_TYPE;
  isRead: boolean;
  metadata?: Record<string, any>;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NOTIFICATION_TYPE;
}
