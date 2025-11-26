// Global type definitions
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
