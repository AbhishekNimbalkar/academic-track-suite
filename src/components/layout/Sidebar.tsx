
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UserCircle, Users, BookOpen, CalendarDays, 
  DollarSign, BarChart, LogOut, School,
  FileText, Bell, Settings, GraduationCap,
  Book, PiggyBank, Receipt, UserPlus
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Teachers", path: "/teachers", icon: <UserCircle size={18} /> },
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

  const classTeacherMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "My Classes", path: "/my-classes", icon: <GraduationCap size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Admission Form", path: "/student-admission", icon: <UserPlus size={18} /> },
    { label: "Academics", path: "/academics", icon: <BookOpen size={18} /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarDays size={18} /> },
    { label: "Applications", path: "/applications", icon: <FileText size={18} /> },
  ];

  const accountantMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Fee Collection", path: "/fees", icon: <DollarSign size={18} /> },
    { label: "Residential", path: "/residential-fees", icon: <Receipt size={18} /> },
    { label: "Non-Residential", path: "/non-residential-fees", icon: <Receipt size={18} /> },
  ];

  const stationaryHeadMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Expenses", path: "/expenses", icon: <PiggyBank size={18} /> },
    { label: "Residential Students", path: "/residential-students", icon: <Users size={18} /> },
  ];

  const libraryHeadMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Books", path: "/books", icon: <Book size={18} /> },
    { label: "Book Issues", path: "/book-issues", icon: <FileText size={18} /> },
  ];

  let menuItems;
  switch (user?.role) {
    case "admin":
      menuItems = adminMenuItems;
      break;
    case "class_teacher":
      menuItems = classTeacherMenuItems;
      break;
    case "accountant":
      menuItems = accountantMenuItems;
      break;
    case "stationary_head":
      menuItems = stationaryHeadMenuItems;
      break;
    case "library_head":
      menuItems = libraryHeadMenuItems;
      break;
    default:
      menuItems = [];
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "class_teacher":
        return "Class Teacher";
      case "accountant":
        return "Accountant";
      case "stationary_head":
        return "Stationary Head";
      case "library_head":
        return "Library Head";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
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
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user ? getRoleTitle(user.role) : ""}
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
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
