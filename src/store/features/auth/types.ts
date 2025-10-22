export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: {
    name: "broker" | "dispatcher" | "company";
  };
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
