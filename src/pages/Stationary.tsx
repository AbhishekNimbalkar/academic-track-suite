
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { EnhancedStationaryManager } from "@/components/expenses/EnhancedStationaryManager";

const Stationary: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission
  if (!hasPermission("manage_stationary") && !hasPermission("view_residential_students")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Stationary Management</h1>
        <EnhancedStationaryManager />
      </div>
    </MainLayout>
  );
};

export default Stationary;
