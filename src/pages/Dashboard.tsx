
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StationaryDashboard } from "@/components/dashboard/StationaryDashboard";
import { MedicalDashboard } from "@/components/dashboard/MedicalDashboard";

const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "teacher":
        return "Teacher";
      case "stationary":
        return "Stationary Manager";
      case "medical":
        return "Medical Officer";
      default:
        return role?.charAt(0).toUpperCase() + role?.slice(1) || "";
    }
  };

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "stationary":
        return <StationaryDashboard />;
      case "medical":
        return <MedicalDashboard />;
      default:
        return <AdminDashboard />; // Default fallback
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userRole ? getRoleTitle(userRole) : user?.email}
        </h1>
        {renderDashboard()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
