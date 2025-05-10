
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "class_teacher" | "accountant" | "stationary_head" | "library_head";
  permissions?: string[];
  assignedClasses?: string[];
  subjects?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  [role: string]: string[];
}

// Define the specific permissions for each role
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    "manage_teachers",
    "manage_students",
    "manage_fees",
    "manage_expenses",
    "manage_library",
    "generate_certificates",
    "view_all_records",
    "manage_stationary",
  ],
  class_teacher: [
    "manage_marks",
    "manage_attendance",
    "generate_marksheets",
    "create_student_applications",
    "view_students",
  ],
  accountant: [
    "collect_fees",
    "view_fee_records",
    "view_residential_students", 
    "view_non_residential_students",
  ],
  stationary_head: [
    "manage_expenses",
    "view_residential_students",
  ],
  library_head: [
    "manage_books",
    "track_book_issues",
  ],
};
