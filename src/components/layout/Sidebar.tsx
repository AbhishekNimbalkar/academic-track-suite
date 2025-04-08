
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UserCircle, Users, BookOpen, CalendarDays, 
  DollarSign, BarChart, LogOut, School
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Teachers", path: "/teachers", icon: <UserCircle size={18} /> },
    { label: "Academics", path: "/academics", icon: <BookOpen size={18} /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarDays size={18} /> },
    { label: "Fee Management", path: "/fees", icon: <DollarSign size={18} /> },
  ];

  const teacherMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <BarChart size={18} /> },
    { label: "Students", path: "/students", icon: <Users size={18} /> },
    { label: "Academics", path: "/academics", icon: <BookOpen size={18} /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarDays size={18} /> },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : teacherMenuItems;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
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
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
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
