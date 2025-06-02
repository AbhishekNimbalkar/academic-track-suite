
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { AdmissionForm } from "@/components/admission/AdmissionForm";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Student } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";

const StudentAdmission: React.FC = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has permission to access this page (Admin or Class Teacher)
  if (!hasPermission("manage_students") && !hasPermission("create_student_applications")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmitAdmission = async (studentData: Omit<Student, "id">) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        toast({
          title: "Authentication Error",
          description: "Please make sure you are logged in.",
          variant: "destructive",
        });
        return;
      }

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add students.",
          variant: "destructive",
        });
        return;
      }

      // Generate a unique student ID
      const studentId = `STU${Date.now()}`;
      
      // Insert student into Supabase
      const { data, error } = await supabase
        .from('students')
        .insert([
          {
            student_id: studentId,
            first_name: studentData.fullName.split(' ')[0],
            last_name: studentData.fullName.split(' ').slice(1).join(' ') || '',
            date_of_birth: studentData.dateOfBirth,
            current_class: studentData.class,
            admission_date: studentData.admissionDate,
            parent_name: studentData.parentName,
            parent_email: studentData.parentEmail,
            parent_phone: studentData.parentPhone,
            medical_details: studentData.medicalInfo || null,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding student:', error);
        toast({
          title: "Admission Failed",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Student Admission Successful",
        description: `${studentData.fullName} has been successfully admitted with ID: ${studentId}`,
      });
      navigate("/students");
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Admission Failed",
        description: "There was an unexpected error processing the student admission.",
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
