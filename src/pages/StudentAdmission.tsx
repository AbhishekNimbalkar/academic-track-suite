
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { AdmissionForm } from "@/components/admission/AdmissionForm";

const StudentAdmission: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission to access this page (Admin or Class Teacher)
  if (!hasPermission("manage_students") && !hasPermission("create_student_applications")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Student Admission</h1>
        </div>
        
        <AdmissionForm />
      </div>
    </MainLayout>
  );
};

export default StudentAdmission;
