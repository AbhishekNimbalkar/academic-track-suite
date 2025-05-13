
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { AdmissionForm } from "@/components/admission/AdmissionForm";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { dataService } from "@/services/mockData";
import { Student } from "@/types/models";

const StudentAdmission: React.FC = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has permission to access this page (Admin or Class Teacher)
  if (!hasPermission("manage_students") && !hasPermission("create_student_applications")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmitAdmission = (studentData: Omit<Student, "id">) => {
    try {
      // Add student to the data service
      const newStudent = dataService.addStudent(studentData);
      toast({
        title: "Student Admission Successful",
        description: `${newStudent.fullName} has been successfully admitted with ID: ${newStudent.id}`,
      });
      navigate("/students");
    } catch (error) {
      toast({
        title: "Admission Failed",
        description: "There was an error processing the student admission.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Student Admission</h1>
        </div>
        
        <AdmissionForm onSubmit={handleSubmitAdmission} />
      </div>
    </MainLayout>
  );
};

export default StudentAdmission;
