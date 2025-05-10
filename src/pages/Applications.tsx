
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Applications: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission to access this page
  if (!hasPermission("create_student_applications") && !hasPermission("view_all_records")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Student Applications</h1>
        <p className="text-muted-foreground">
          This page will allow creating and managing student applications.
        </p>
      </div>
    </MainLayout>
  );
};

export default Applications;
