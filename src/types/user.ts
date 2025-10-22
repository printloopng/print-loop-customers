export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  isEmailVerified: boolean;
  firstName: string;
  gender: string;
  address: string | null;
  emailVerifiedAt: string;
  lastName: string;
  middleName: string | null;
  phoneNumber: string;
  profileImage: string | null;
  isActive: boolean;
  accountStatus: string;
  roleId: string;
  role?: any;
  freightProfile: any | null;
  settings: any | null;
  stripeCustomerId: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessName?: string;
  dotNumber?: string;
  mcNumber?: string;
  profileImage?: string;
  settings?: NotificationSettings;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  darkMode: boolean;
}

export interface UpdateNotificationSettingsRequest {
  emailNotifications?: boolean;
  twoFactorEnabled?: boolean;
  darkMode?: boolean;
}
