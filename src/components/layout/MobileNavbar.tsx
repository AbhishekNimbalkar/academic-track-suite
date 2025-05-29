
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, School } from "lucide-react";

export const MobileNavbar: React.FC = () => {
  const { user, userRole } = useAuth();

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Teacher";
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1) || "";
    }
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <School className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold">SchoolMS</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-right">
          <p className="font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">
            {userRole ? getRoleTitle(userRole) : ""}
          </p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
