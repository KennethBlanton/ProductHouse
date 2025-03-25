export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    role: 'user' | 'admin';
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }