
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ResidentialStudents: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission to access this page
  if (!hasPermission("view_residential_students") && !hasPermission("view_all_records")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Residential Students</h1>
        <p className="text-muted-foreground">
          This page will show the list of residential students and their details.
        </p>
      </div>
    </MainLayout>
  );
};

export default ResidentialStudents;
