import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { EnhancedStationaryManager } from "@/components/expenses/EnhancedStationaryManager";
import StationaryExpenseDashboard from "@/components/dashboard/StationaryExpenseDashboard";

const Stationary: React.FC = () => {
  const { hasPermission } = useAuth();

  // Allow admin (manage_stationary), residential viewer, stationery (stationary_add_expense), or medical (manage_medical_expenses/view_medical_reports/add_medical_records)
  if (
    !hasPermission("manage_stationary") &&
    !hasPermission("view_residential_students") &&
    !hasPermission("stationary_add_expense") &&
    !hasPermission("manage_medical_expenses") &&
    !hasPermission("view_medical_reports") &&
    !hasPermission("add_medical_records")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* New Dashboard */}
        <StationaryExpenseDashboard />
        <h1 className="text-2xl font-bold tracking-tight">Stationary Management</h1>
        <EnhancedStationaryManager />
      </div>
    </MainLayout>
  );
};

export default Stationary;
