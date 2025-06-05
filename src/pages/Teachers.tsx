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
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { TeacherList } from "@/components/teachers/TeacherList";
import { AddTeacherDialog } from "@/components/teachers/AddTeacherDialog";
import { DeleteTeacherDialog } from "@/components/teachers/DeleteTeacherDialog";
import { AssignClassDialog } from "@/components/teachers/AssignClassDialog";
import { TeacherSearchBar } from "@/components/teachers/TeacherSearchBar";
import { Teacher, Class, TeacherClassAssignment } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Teachers: React.FC = () => {
  const { hasPermission } = useAuth();
  const canManageTeachers = hasPermission("manage_teachers");
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<TeacherClassAssignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToAssign, setTeacherToAssign] = useState<Teacher | null>(null);
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
        classes: [], // Will be populated from assignments
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

  // Fetch classes from Supabase
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*');
      
      if (error) {
        console.error('Error fetching classes:', error);
        return;
      }

      const formattedClasses: Class[] = data.map(cls => ({
        id: cls.id,
        className: cls.class_name,
        medium: cls.medium,
        academicYear: cls.academic_year,
      }));

      setClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Fetch teacher class assignments
  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_class_assignments')
        .select(`
          *,
          classes (
            class_name,
            medium
          )
        `);
      
      if (error) {
        console.error('Error fetching assignments:', error);
        return;
      }

      const formattedAssignments: TeacherClassAssignment[] = data.map(assignment => ({
        id: assignment.id,
        teacherId: assignment.teacher_id,
        classId: assignment.class_id,
        subject: assignment.subject,
        assignedAt: assignment.assigned_at,
        assignedBy: assignment.assigned_by,
      }));

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchAssignments();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Generate teacher ID
      const newTeacherId = `TCH${(teachers.length + 1).toString().padStart(3, "0")}`;
      
      // Split name into first and last name
      const nameParts = newTeacher.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Insert teacher record directly without creating auth user first
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          teacher_id: newTeacherId,
          first_name: firstName,
          last_name: lastName,
          email: newTeacher.email,
          phone: newTeacher.phone,
          subjects: newTeacher.subjects,
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
        description: `${newTeacher.name} has been successfully added. They can now use their email to request login access.`,
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
      // Delete teacher assignments first
      await supabase
        .from('teacher_class_assignments')
        .delete()
        .eq('teacher_id', teacherToDelete.id);

      // Delete teacher record
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

  const handleAssignClass = async (classIds: string[], subject: string) => {
    console.log('handleAssignClass called with:', { classIds, subject, teacherToAssign });
    
    if (!teacherToAssign || !canManageTeachers) {
      console.log('Permission or teacher check failed');
      toast({
        title: "Error", 
        description: "No teacher selected or insufficient permissions",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting assignment process...');
      
      // Remove existing assignments for this teacher
      const { error: deleteError } = await supabase
        .from('teacher_class_assignments')
        .delete()
        .eq('teacher_id', teacherToAssign.id);

      if (deleteError) {
        console.error('Error deleting existing assignments:', deleteError);
        throw deleteError;
      }

      // Add new assignments
      const assignmentData = classIds.map(classId => ({
        teacher_id: teacherToAssign.id,
        class_id: classId,
        subject: subject,
      }));

      console.log('Inserting new assignments:', assignmentData);

      const { error: insertError, data } = await supabase
        .from('teacher_class_assignments')
        .insert(assignmentData)
        .select();

      if (insertError) {
        console.error('Error inserting assignments:', insertError);
        throw insertError;
      }

      console.log('Successfully inserted assignments:', data);

      // Refresh assignments
      await fetchAssignments();
      
      // Close dialog and reset state
      setIsAssignDialogOpen(false);
      setTeacherToAssign(null);
      
      toast({
        title: "Classes Assigned",
        description: `Successfully assigned ${classIds.length} classes to ${teacherToAssign.name} for ${subject}.`,
      });
      
    } catch (error: any) {
      console.error('Error in handleAssignClass:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign classes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInitiateAssign = (teacher: Teacher) => {
    console.log('Initiating assign for teacher:', teacher);
    
    if (!canManageTeachers) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to assign classes.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Setting teacher to assign and opening dialog');
    setTeacherToAssign(teacher);
    setIsAssignDialogOpen(true);
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
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Teacher
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Records</CardTitle>
            <CardDescription>
              Manage teachers and assign classes. Teachers can request login access using their registered email.
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
              onAssignClass={handleInitiateAssign}
              assignments={assignments}
              classes={classes}
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

      <AssignClassDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={(open) => {
          console.log('Dialog open change:', open);
          setIsAssignDialogOpen(open);
          if (!open) {
            setTeacherToAssign(null);
          }
        }}
        teacher={teacherToAssign}
        classes={classes}
        onAssignClass={handleAssignClass}
      />
    </MainLayout>
  );
};

export default Teachers;
