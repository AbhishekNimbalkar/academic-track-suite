
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  ],
  teacher: [
    "manage_marks",
    "manage_attendance", 
    "generate_marksheets",
    "create_student_applications",
    "view_students",
    "manage_admissions",
  ],
};

// Cleanup function to prevent auth limbo states
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer user profile fetching to prevent deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { data: profile, error } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user role:', error);
                if (error.code === 'PGRST116') {
                  // Profile doesn't exist, create one
                  const { error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                      id: session.user.id,
                      role: 'teacher',
                      email: session.user.email
                    });
                  
                  if (!insertError && mounted) {
                    setUserRole('teacher');
                  }
                } else {
                  // Set default role on error
                  if (mounted) setUserRole('teacher');
                }
              } else {
                if (mounted) setUserRole(profile?.role || 'teacher');
              }
            } catch (error) {
              console.error('Error in role fetch:', error);
              if (mounted) setUserRole('teacher');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout failed (continuing):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });

      // Force page refresh for clean state
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Signout error (ignoring):', err);
      }
      
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });

      // Force page refresh for clean state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Logout completed",
        description: "You have been logged out",
      });
      // Force refresh even on error
      window.location.href = '/';
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
    return rolePermissions?.includes(permission) || false;
  };

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
