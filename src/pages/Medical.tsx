
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { EnhancedMedicalManager } from "@/components/expenses/EnhancedMedicalManager";

const Medical: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission
  if (!hasPermission("manage_medical") && !hasPermission("view_residential_students")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Medical Management</h1>
        <EnhancedMedicalManager />
      </div>
    </MainLayout>
  );
};

export default Medical;
