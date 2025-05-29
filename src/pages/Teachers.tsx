
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { TeacherList } from "@/components/teachers/TeacherList";
import { AddTeacherDialog } from "@/components/teachers/AddTeacherDialog";
import { DeleteTeacherDialog } from "@/components/teachers/DeleteTeacherDialog";
import { TeacherSearchBar } from "@/components/teachers/TeacherSearchBar";
import { Teacher } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Teachers: React.FC = () => {
  const { hasPermission } = useAuth();
  const canManageTeachers = hasPermission("manage_teachers");
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, "id">>({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    classes: [],
    joiningDate: new Date().toISOString().split("T")[0],
    qualification: "",
    address: "",
  });
  const { toast } = useToast();

  // Fetch teachers from Supabase
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*');
      
      if (error) {
        console.error('Error fetching teachers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch teachers",
          variant: "destructive",
        });
        return;
      }

      // Convert Supabase data to Teacher format
      const formattedTeachers: Teacher[] = data.map(teacher => ({
        id: teacher.teacher_id,
        name: `${teacher.first_name} ${teacher.last_name}`,
        email: teacher.email,
        phone: teacher.phone || "",
        subjects: teacher.subjects || [],
        classes: teacher.classes || [],
        joiningDate: teacher.joining_date,
        qualification: teacher.qualification || "",
        address: teacher.address || "",
      }));

      setTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    teacher.classes.some(cls => 
      cls.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddTeacher = async () => {
    if (!canManageTeachers) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add teachers.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create user account first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newTeacher.email,
        password: 'TempPassword123!', // Temporary password - teacher should change this
        email_confirm: true,
        user_metadata: {
          role: 'teacher'
        }
      });

      if (authError) throw authError;

      // Generate teacher ID
      const newTeacherId = `TCH${(teachers.length + 1).toString().padStart(3, "0")}`;
      
      // Split name into first and last name
      const nameParts = newTeacher.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Insert teacher record
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          user_id: authData.user.id,
          teacher_id: newTeacherId,
          first_name: firstName,
          last_name: lastName,
          email: newTeacher.email,
          phone: newTeacher.phone,
          subjects: newTeacher.subjects,
          classes: newTeacher.classes,
          joining_date: newTeacher.joiningDate,
          qualification: newTeacher.qualification,
          address: newTeacher.address,
        })
        .select()
        .single();

      if (teacherError) throw teacherError;

      // Refresh teachers list
      await fetchTeachers();
      
      setIsAddDialogOpen(false);
      toast({
        title: "Teacher Added",
        description: `${newTeacher.name} has been successfully added. Temporary password: TempPassword123!`,
      });
      
      // Reset form
      setNewTeacher({
        name: "",
        email: "",
        phone: "",
        subjects: [],
        classes: [],
        joiningDate: new Date().toISOString().split("T")[0],
        qualification: "",
        address: "",
      });
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add teacher",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherToDelete || !canManageTeachers) return;

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('teacher_id', teacherToDelete.id);

      if (error) throw error;

      // Remove from local state
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      
      toast({
        title: "Teacher Deleted",
        description: "The teacher has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete teacher",
        variant: "destructive",
      });
    }
  };

  const handleInitiateDelete = (teacher: Teacher) => {
    if (!canManageTeachers) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete teachers.",
        variant: "destructive",
      });
      return;
    }
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          {canManageTeachers && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Teacher
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Records</CardTitle>
            <CardDescription>
              Manage and view all teachers in the system
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <TeacherSearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <TeacherList 
              teachers={filteredTeachers} 
              onDeleteTeacher={handleInitiateDelete} 
            />
          </CardContent>
        </Card>
      </div>

      <AddTeacherDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newTeacher={newTeacher}
        setNewTeacher={setNewTeacher}
        onAddTeacher={handleAddTeacher}
      />

      <DeleteTeacherDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        teacherToDelete={teacherToDelete}
        onDeleteTeacher={handleDeleteTeacher}
      />
    </MainLayout>
  );
};

export default Teachers;
