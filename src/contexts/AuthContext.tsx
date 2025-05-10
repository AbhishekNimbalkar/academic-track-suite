
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthState, User, ROLE_PERMISSIONS } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration with updated roles
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.com",
    password: "password123",
    role: "admin" as const,
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: "2",
    name: "Class Teacher",
    email: "teacher@school.com",
    password: "password123",
    role: "class_teacher" as const,
    permissions: ROLE_PERMISSIONS.class_teacher,
    assignedClasses: ["9", "10"],
    subjects: ["Mathematics", "Physics"],
  },
  {
    id: "3",
    name: "Accountant",
    email: "accountant@school.com",
    password: "password123",
    role: "accountant" as const,
    permissions: ROLE_PERMISSIONS.accountant,
  },
  {
    id: "4",
    name: "Stationary Head",
    email: "stationary@school.com",
    password: "password123",
    role: "stationary_head" as const,
    permissions: ROLE_PERMISSIONS.stationary_head,
  },
  {
    id: "5",
    name: "Library Head",
    email: "library@school.com",
    password: "password123",
    role: "library_head" as const,
    permissions: ROLE_PERMISSIONS.library_head,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, setState] = useState<AuthState>(defaultState);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for saved user session
    const savedUser = localStorage.getItem("sms_user");
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as User;
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("sms_user");
        setState({ ...defaultState, isLoading: false });
      }
    } else {
      setState({ ...defaultState, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API request
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("sms_user", JSON.stringify(userWithoutPassword));
      
      setState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${userWithoutPassword.name}`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("sms_user");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Add a helper function to check if the user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!state.user || !state.user.permissions) {
      return false;
    }
    return state.user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
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
