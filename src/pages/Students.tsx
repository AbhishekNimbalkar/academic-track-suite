
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Student } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StudentList } from "@/components/students/StudentList";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog";
import { EditStudentDialog } from "@/components/students/EditStudentDialog";
import { SearchBar } from "@/components/students/SearchBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Students: React.FC = () => {
  const { user, hasPermission, userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const canAddStudents = hasPermission("manage_students") || hasPermission("create_student_applications");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    fullName: "",
    dateOfBirth: "",
    class: "",
    section: "",
    admissionDate: new Date().toISOString().split("T")[0],
    admissionClass: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    medicalInfo: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        });
        return;
      }

      // Convert Supabase data to Student format
      const formattedStudents: Student[] = data.map(student => ({
        id: student.student_id,
        fullName: `${student.first_name} ${student.last_name}`,
        dateOfBirth: student.date_of_birth,
        class: student.current_class,
        section: "A", // Default section since it's not in Supabase schema
        admissionDate: student.admission_date,
        admissionClass: student.current_class,
        parentName: student.parent_name,
        parentEmail: student.parent_email,
        parentPhone: student.parent_phone,
        address: "", // Not in Supabase schema
        medicalInfo: student.medical_details || "",
      }));

      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    // This will be updated to work with Supabase in a future update
    toast({
      title: "Feature Coming Soon",
      description: "Adding students via Supabase will be implemented soon.",
    });
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', studentToDelete.id);

      if (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        });
        return;
      }

      // Remove from local state
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      
      toast({
        title: "Student Deleted",
        description: "The student has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = (updatedStudentData: Partial<Student>) => {
    // This will be updated to work with Supabase in a future update
    toast({
      title: "Feature Coming Soon",
      description: "Editing students via Supabase will be implemented soon.",
    });
  };

  const handleAddStudentClick = () => {
    navigate("/student-admission");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          {canAddStudents && (
            <Button onClick={handleAddStudentClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
            <CardDescription>
              Manage and view all students in the system
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search students by name, ID, class or section..."
              />
            </div>
          </CardHeader>
          <CardContent>
            <StudentList 
              students={filteredStudents} 
              onDeleteClick={(student) => {
                if (isAdmin) {
                  setStudentToDelete(student);
                  setIsDeleteDialogOpen(true);
                } else {
                  toast({
                    title: "Permission Denied",
                    description: "Only administrators can delete student records.",
                    variant: "destructive",
                  });
                }
              }}
              onEditClick={(student) => {
                if (isAdmin) {
                  setStudentToEdit(student);
                  setIsEditDialogOpen(true);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <DeleteStudentDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        student={studentToDelete}
        onDeleteStudent={handleDeleteStudent}
      />

      <EditStudentDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        student={studentToEdit}
        onUpdateStudent={handleEditStudent}
      />
    </MainLayout>
  );
};

export default Students;
