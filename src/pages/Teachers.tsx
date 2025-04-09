
import React, { useState } from "react";
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

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "TCH001",
      name: "John Smith",
      email: "john.smith@school.com",
      phone: "+91 9876543210",
      subjects: ["Mathematics", "Physics"],
      classes: ["9", "10"],
      joiningDate: "2020-07-15",
      qualification: "M.Sc, B.Ed",
      address: "123 Teacher Colony, School District",
    },
    {
      id: "TCH002",
      name: "Sarah Johnson",
      email: "sarah.johnson@school.com",
      phone: "+91 9876543211",
      subjects: ["English", "Social Studies"],
      classes: ["6", "7", "8"],
      joiningDate: "2018-06-10",
      qualification: "M.A, B.Ed",
      address: "456 Faculty Housing, Education Lane",
    },
    {
      id: "TCH003",
      name: "David Williams",
      email: "david.williams@school.com",
      phone: "+91 9876543212",
      subjects: ["Chemistry", "Biology"],
      classes: ["11", "12"],
      joiningDate: "2019-08-05",
      qualification: "Ph.D, B.Ed",
      address: "789 Professor Avenue, Knowledge Park",
    },
  ]);
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

  const handleAddTeacher = () => {
    const newId = `TCH${(teachers.length + 1).toString().padStart(3, "0")}`;
    const addedTeacher = { ...newTeacher, id: newId };
    setTeachers([...teachers, addedTeacher]);
    setIsAddDialogOpen(false);
    toast({
      title: "Teacher Added",
      description: `${addedTeacher.name} has been successfully added.`,
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
  };

  const handleDeleteTeacher = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      toast({
        title: "Teacher Deleted",
        description: "The teacher has been successfully deleted.",
      });
    }
  };

  const handleInitiateDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Teacher
          </Button>
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
