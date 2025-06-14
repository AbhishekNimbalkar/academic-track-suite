
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// UPDATED: AuthContextType.user now always has id and email.
interface AuthUser {
  id: string;
  email: string;
}
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions
const ROLE_PERMISSIONS = {
  admin: [
    "manage_teachers",
    "manage_students", 
    "manage_fees",
    "manage_expenses",
    "manage_library",
    "generate_certificates",
    "view_all_records",
    "manage_stationary",
    "manage_admissions",
    "promote_students",
    "manage_classes",
    "manage_subjects",
    "generate_documents",
    "manage_stationary", // full manage ("add", "edit", "delete") for admin
    "stationary_add_expense",
    "stationary_edit_expense",
    "stationary_delete_expense",
  ],
  teacher: [
    "manage_marks",
    "manage_attendance", 
    "generate_marksheets",
    "create_student_applications",
    "view_students",
    "manage_admissions",
    "view_assigned_class_only",
  ],
  stationary: [
    "stationary_add_expense",
    "view_stationary_reports",
    "add_stationary_items",
  ],
  medical: [
    "manage_medical_expenses",
    "view_medical_reports",
    "add_medical_records",
    "manage_medical",
    "medical_add_expense",
  ],
};

// Mock users database (fallback for admin)
const MOCK_USERS = {
  "admin@school.com": {
    id: "00000000-0000-0000-0000-000000000001",
    password: "admin123",
    role: "admin",
    email: "admin@school.com"
  },
  "stationary@school.com": {
    id: "00000000-0000-0000-0000-000000000002",
    password: "stationary123",
    role: "stationary", 
    email: "stationary@school.com"
  },
  "medical@school.com": {
    id: "00000000-0000-0000-0000-000000000003",
    password: "medical123",
    role: "medical",
    email: "medical@school.com"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // user is always { id, email } or null
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Check if user is a teacher
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('teacher_id, email, id')
            .eq('email', session.user.email)
            .single();
          
          if (teacherData && !teacherError) {
            // User is a teacher. Provide { id, email }
            setUser({ id: session.user.id, email: session.user.email || "" });
            setUserRole('teacher');
          } else {
            // Fallback to mock auth for existing users
            checkMockAuth();
          }
        } else {
          setUser(null);
          setUserRole(null);
          checkMockAuth();
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        checkMockAuth();
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkMockAuth = () => {
    // Check if user is already logged in with mock auth
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentUserRole');
    // user must have id and email in localStorage
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First check if this is a teacher trying to log in
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('teacher_id, email, id')
        .eq('email', email)
        .single();

      if (teacherData && !teacherError) {
        // This is a teacher - try to sign in first
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          // If sign in fails, check if it's because account doesn't exist
          if (authError.message.includes('Invalid login credentials')) {
            // Teacher account doesn't exist yet - create one
            console.log('Creating new teacher account...');
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
                data: {
                  role: 'teacher'
                }
              }
            });

            if (signUpError) {
              if (signUpError.message.includes('User already registered')) {
                toast({
                  title: "Login Failed",
                  description: "This email is already registered. Please check your password and try again.",
                  variant: "destructive",
                });
                return;
              }
              throw signUpError;
            }

            // Update teacher record with auth user id
            if (signUpData.user) {
              await supabase
                .from('teachers')
                .update({ auth_user_id: signUpData.user.id })
                .eq('email', email);
            }

            toast({
              title: "Account Created",
              description: "Your teacher account has been created. Please check your email for verification (if required) and try logging in again.",
            });
            return;
          } else {
            throw authError;
          }
        }

        // Teacher login successful
        // setUser with id and email from session
        if (authData.user) {
          setUser({ id: authData.user.id, email });
          setUserRole('teacher');
          localStorage.setItem('currentUser', JSON.stringify({ id: authData.user.id, email }));
          localStorage.setItem('currentUserRole', 'teacher');
        }
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        return;
      }

      // Fallback to mock auth for admin and other roles
      const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
      if (!mockUser || mockUser.password !== password) {
        throw new Error("Invalid email or password");
      }
      // Provide { id, email }
      const userData: AuthUser = { id: mockUser.id, email: mockUser.email };
      setUser(userData);
      setUserRole(mockUser.role);

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('currentUserRole', mockUser.role);
      
      toast({
        title: "Welcome back!",
        description: `You have been logged in as ${mockUser.role}.`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (session) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setUserRole(null);
      setSession(null);

      // Clear localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserRole');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout completed",
        description: "You have been logged out",
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
    return rolePermissions?.includes(permission) || false;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        userRole,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
