export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isAdmin: boolean;
  memberSince: Date;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}
