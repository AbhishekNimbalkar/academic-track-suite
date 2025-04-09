
import React from "react";
import { Student } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newStudent: Omit<Student, "id">;
  onStudentChange: (student: Omit<Student, "id">) => void;
  onAddStudent: () => void;
}

export const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  isOpen,
  onOpenChange,
  newStudent,
  onStudentChange,
  onAddStudent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's details below to create a new student record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newStudent.fullName}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, fullName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newStudent.dateOfBirth}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, dateOfBirth: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={newStudent.class}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, class: e.target.value })
                }
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={newStudent.section}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, section: e.target.value })
                }
                placeholder="e.g. A"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name</Label>
            <Input
              id="parentName"
              value={newStudent.parentName}
              onChange={(e) =>
                onStudentChange({ ...newStudent, parentName: e.target.value })
              }
              placeholder="Parent/Guardian Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Parent Email</Label>
              <Input
                id="parentEmail"
                type="email"
                value={newStudent.parentEmail}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, parentEmail: e.target.value })
                }
                placeholder="parent@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone</Label>
              <Input
                id="parentPhone"
                value={newStudent.parentPhone}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, parentPhone: e.target.value })
                }
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={newStudent.address}
              onChange={(e) =>
                onStudentChange({ ...newStudent, address: e.target.value })
              }
              placeholder="Full address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admissionClass">Admission Class</Label>
            <Input
              id="admissionClass"
              value={newStudent.admissionClass}
              onChange={(e) =>
                onStudentChange({ ...newStudent, admissionClass: e.target.value })
              }
              placeholder="Class at admission"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalInfo">Medical Information</Label>
            <Input
              id="medicalInfo"
              value={newStudent.medicalInfo}
              onChange={(e) =>
                onStudentChange({ ...newStudent, medicalInfo: e.target.value })
              }
              placeholder="Any medical conditions or allergies"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onAddStudent}>Add Student</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
