
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
import { ClassList } from "@/components/classes/ClassList";
import { AddClassDialog } from "@/components/classes/AddClassDialog";
import { DeleteClassDialog } from "@/components/classes/DeleteClassDialog";
import { ClassSearchBar } from "@/components/classes/ClassSearchBar";
import { Class } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Classes: React.FC = () => {
  const { hasPermission } = useAuth();
  const canManageClasses = hasPermission("manage_classes");
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState<Omit<Class, "id">>({
    className: "",
    medium: "English",
    academicYear: "2024-25",
  });
  const { toast } = useToast();

  // Fetch classes from Supabase
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('class_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch classes",
          variant: "destructive",
        });
        return;
      }

      // Convert Supabase data to Class format
      const formattedClasses: Class[] = data.map(cls => ({
        id: cls.id,
        className: cls.class_name,
        medium: cls.medium,
        academicYear: cls.academic_year,
      }));

      setClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.medium.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClass = async () => {
    if (!canManageClasses) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add classes.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          class_name: newClass.className,
          medium: newClass.medium,
          academic_year: newClass.academicYear,
        })
        .select()
        .single();

      if (classError) throw classError;

      // Refresh classes list
      await fetchClasses();
      
      setIsAddDialogOpen(false);
      toast({
        title: "Class Added",
        description: `${newClass.className} (${newClass.medium}) has been successfully added.`,
      });
      
      // Reset form
      setNewClass({
        className: "",
        medium: "English",
        academicYear: "2024-25",
      });
    } catch (error: any) {
      console.error('Error adding class:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add class",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClass = async () => {
    if (!classToDelete || !canManageClasses) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classToDelete.id);

      if (error) throw error;

      // Remove from local state
      setClasses(classes.filter((c) => c.id !== classToDelete.id));
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
      
      toast({
        title: "Class Deleted",
        description: "The class has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const handleInitiateDelete = (cls: Class) => {
    if (!canManageClasses) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete classes.",
        variant: "destructive",
      });
      return;
    }
    setClassToDelete(cls);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          {canManageClasses && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Class
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              Manage all classes and their mediums in the system
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <ClassSearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <ClassList 
              classes={filteredClasses} 
              onDeleteClass={handleInitiateDelete} 
            />
          </CardContent>
        </Card>
      </div>

      <AddClassDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newClass={newClass}
        setNewClass={setNewClass}
        onAddClass={handleAddClass}
      />

      <DeleteClassDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        classToDelete={classToDelete}
        onDeleteClass={handleDeleteClass}
      />
    </MainLayout>
  );
};

export default Classes;
