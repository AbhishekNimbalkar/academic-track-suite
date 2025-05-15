
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from "@/types/models";
import { StudentDetailsForm } from "@/components/admission/StudentDetailsForm";

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStudent: (updatedStudent: Partial<Student>) => void;
}

export function EditStudentDialog({
  student,
  isOpen,
  onOpenChange,
  onUpdateStudent
}: EditStudentDialogProps) {
  if (!student) return null;
  
  const handleSubmit = (data: any) => {
    onUpdateStudent({
      ...data,
      id: student.id // Keep the same ID
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Student Information</DialogTitle>
          <DialogDescription>
            Update student details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4">
          <StudentDetailsForm 
            onSubmit={handleSubmit} 
            defaultValues={student} 
            buttonText="Save Changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
