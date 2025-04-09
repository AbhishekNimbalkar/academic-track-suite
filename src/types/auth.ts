
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "staff";
  permissions?: string[];
  assignedClasses?: string[];
  subjects?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
