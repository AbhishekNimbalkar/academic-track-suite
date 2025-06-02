
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
import { DeleteStudentDialog } from "@/components/students/DeleteStudentDialog";
import { EditStudentDialog } from "@/components/students/EditStudentDialog";
import { SearchBar } from "@/components/students/SearchBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Students: React.FC = () => {
  const { user, hasPermission, userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const canAddStudents = hasPermission("manage_students") || hasPermission("create_student_applications");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define class order
  const classOrder = ["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('current_class', { ascending: true });
      
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
        gender: "male", // Default value since not in Supabase schema
        bloodGroup: "A+", // Default value since not in Supabase schema
        class: student.current_class,
        section: "A", // Default section since it's not in Supabase schema
        admissionDate: student.admission_date,
        admissionClass: student.current_class,
        parentName: student.parent_name,
        parentEmail: student.parent_email,
        parentPhone: student.parent_phone,
        address: "", // Not in Supabase schema
        medicalInfo: student.medical_details || "",
        caste: "", // Default value since not in Supabase schema
        residentialType: "non-residential", // Default value since not in Supabase schema
        aadhaarNumber: "", // Default value since not in Supabase schema
        panCardNumber: "", // Default value since not in Supabase schema
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

  // Group students by class
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = [];
    }
    acc[student.class].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  // Sort classes according to the defined order
  const sortedClasses = Object.keys(groupedStudents).sort((a, b) => {
    const indexA = classOrder.indexOf(a);
    const indexB = classOrder.indexOf(b);
    return indexA - indexB;
  });

  // Filter students based on search query and selected class
  const getFilteredStudents = () => {
    let filteredStudents = students;
    
    if (selectedClass !== "all") {
      filteredStudents = groupedStudents[selectedClass] || [];
    }
    
    if (searchQuery) {
      filteredStudents = filteredStudents.filter((student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.section.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredStudents;
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

      // Refresh the students list
      await fetchStudents();
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
              Manage and view all students in the system, organized by class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search students by name, ID, class or section..."
              />
            </div>

            <Tabs value={selectedClass} onValueChange={setSelectedClass}>
              <TabsList className="grid w-full grid-cols-7 lg:grid-cols-14">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                {sortedClasses.map((className) => (
                  <TabsTrigger key={className} value={className} className="text-xs">
                    {className === "LKG" || className === "UKG" ? className : `Class ${className}`}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedClass} className="mt-6">
                <div className="mb-4">
                  {selectedClass === "all" ? (
                    <h3 className="text-lg font-semibold">All Students ({students.length})</h3>
                  ) : (
                    <h3 className="text-lg font-semibold">
                      {selectedClass === "LKG" || selectedClass === "UKG" ? selectedClass : `Class ${selectedClass}`} 
                      ({groupedStudents[selectedClass]?.length || 0} students)
                    </h3>
                  )}
                </div>
                
                <StudentList 
                  students={getFilteredStudents()} 
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
              </TabsContent>
            </Tabs>
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
