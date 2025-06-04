
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: { email: string } | null;
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
    "manage_stationary_expenses",
    "view_stationary_reports",
    "add_stationary_items",
  ],
  medical: [
    "manage_medical_expenses",
    "view_medical_reports",
    "add_medical_records",
  ],
};

// Mock users database (fallback for admin)
const MOCK_USERS = {
  "admin@school.com": {
    password: "admin123",
    role: "admin",
    email: "admin@school.com"
  },
  "stationary@school.com": {
    password: "stationary123",
    role: "stationary", 
    email: "stationary@school.com"
  },
  "medical@school.com": {
    password: "medical123",
    role: "medical",
    email: "medical@school.com"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
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
          // Get user role from user_profiles table
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            setUser({ email: session.user.email || '' });
            setUserRole(profileData.role);
          } else {
            console.error('Error fetching user profile:', error);
            // Fallback to mock auth for existing users
            checkMockAuth();
          }
        } else {
          setUser(null);
          setUserRole(null);
          // Check for mock auth fallback
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
    
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First try Supabase auth for teachers
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authData.user && !authError) {
        // Supabase auth successful - user profile will be loaded by auth state listener
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

      const userData = { email: mockUser.email };
      
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
      // Sign out from Supabase if authenticated there
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
