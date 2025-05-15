
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
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

const Students: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const isAdmin = user?.role === "admin";
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

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = () => {
      const allStudents = dataService.getStudents();
      setStudents(allStudents);
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    const addedStudent = dataService.addStudent(newStudent);
    setStudents([...students, addedStudent]);
    setIsAddDialogOpen(false);
    toast({
      title: "Student Added",
      description: `${addedStudent.fullName} has been successfully added.`,
    });
    
    // Reset form
    setNewStudent({
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
  };

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      dataService.deleteStudent(studentToDelete.id);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      toast({
        title: "Student Deleted",
        description: "The student has been successfully deleted.",
      });
    }
  };

  const handleEditStudent = (updatedStudentData: Partial<Student>) => {
    if (studentToEdit) {
      const updatedStudent = dataService.updateStudent(studentToEdit.id, updatedStudentData);
      
      if (updatedStudent) {
        // Update the local state
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        
        toast({
          title: "Student Updated",
          description: `${updatedStudent.fullName}'s information has been updated.`,
        });
      }
    }
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
