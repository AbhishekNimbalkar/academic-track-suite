
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const NonResidentialFees: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission to access this page
  if (!hasPermission("view_non_residential_students") && !hasPermission("collect_fees") && !hasPermission("view_all_records")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Non-Residential Student Fees</h1>
        <p className="text-muted-foreground">
          This page will show fee collection details for non-residential students.
        </p>
      </div>
    </MainLayout>
  );
};

export default NonResidentialFees;
