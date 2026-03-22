export interface NotificationUser {
  id: number;
  email: string;
  username: string;
}

export interface NotificationPayload {
  user: NotificationUser;
  message: string;
  metadata: Record<string, unknown>;
}

export interface INotificationChannel {
  send(payload: NotificationPayload): Promise<void>;
}