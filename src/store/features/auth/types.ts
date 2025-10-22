import { PermissionEnum } from "@/constants/enums";

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: {
    name: "broker" | "dispatcher" | "company";
  };
  permissions: PermissionEnum[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  permissions: PermissionEnum[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
