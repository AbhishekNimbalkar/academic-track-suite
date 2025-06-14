
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UserCircle, Users, BookOpen, CalendarDays, 
  DollarSign, BarChart, LogOut, School,
  FileText, Bell, Settings, GraduationCap,
  Book, PiggyBank, Receipt, UserPlus, Building2
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user, userRole, logout, hasPermission } = useAuth();

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Teachers", path: "/teachers", icon: <UserCircle size={18} /> },
    { label: "Classes", path: "/classes", icon: <Building2 size={18} /> },
    { label: "Admission Form", path: "/student-admission", icon: <UserPlus size={18} /> },
    { label: "Academics", path: "/academics", icon: <BookOpen size={18} /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarDays size={18} /> },
    { label: "Fee Management", path: "/fees", icon: <DollarSign size={18} /> },
    { label: "Stationary", path: "/stationary", icon: <PiggyBank size={18} /> },
    { label: "Library", path: "/library", icon: <Book size={18} /> },
    { label: "Documents", path: "/documents", icon: <FileText size={18} /> },
    { label: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const teacherMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "My Classes", path: "/my-classes", icon: <GraduationCap size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Admission Form", path: "/student-admission", icon: <UserPlus size={18} /> },
    { label: "Academics", path: "/academics", icon: <BookOpen size={18} /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarDays size={18} /> },
    { label: "Applications", path: "/applications", icon: <FileText size={18} /> },
  ];

  // Add menu for stationary role
  const stationaryMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Stationary", path: "/stationary", icon: <PiggyBank size={18} /> },
  ];

  let menuItems;
  switch (userRole) {
    case "admin":
      menuItems = adminMenuItems;
      break;
    case "teacher":
      menuItems = teacherMenuItems;
      break;
    case "stationary":
      menuItems = stationaryMenuItems;
      break;
    default:
      menuItems = [];
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Teacher";
      case "stationary":
        return "Stationary Manager";
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1) || "";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-white shadow-md overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">SchoolMS</h1>
        </div>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.email}</p>
            <p className="text-xs text-muted-foreground">
              {userRole ? getRoleTitle(userRole) : ""}
            </p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-secondary transition-colors"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
