import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import EnhancedMedicalExpenseManager from "@/components/expenses/EnhancedMedicalExpenseManager";

const Medical: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Allow admin (manage_medical), residential viewer, stationery, or "medical" roles
  if (
    !hasPermission("manage_medical") &&
    !hasPermission("medical_add_expense") &&
    !hasPermission("manage_stationary")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Medical Management</h1>
        <EnhancedMedicalExpenseManager />
      </div>
    </MainLayout>
  );
};

export default Medical;
