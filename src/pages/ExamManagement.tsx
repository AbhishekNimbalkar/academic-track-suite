
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ExamManagementTabs } from "@/components/exams/ExamManagementTabs";
import { TeacherExamManagement } from "@/components/exams/TeacherExamManagement";

const ExamManagement: React.FC = () => {
  const { userRole } = useAuth();

  if (!userRole || (userRole !== "admin" && userRole !== "teacher")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Exam Management</h1>
        {userRole === "admin" ? (
          <ExamManagementTabs />
        ) : (
          <TeacherExamManagement />
        )}
      </div>
    </MainLayout>
  );
};

export default ExamManagement;
