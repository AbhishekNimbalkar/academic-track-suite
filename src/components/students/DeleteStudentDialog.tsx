
import React from "react";
import { Student } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onDeleteStudent: () => void;
}

export const DeleteStudentDialog: React.FC<DeleteStudentDialogProps> = ({
  isOpen,
  onOpenChange,
  student,
  onDeleteStudent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {student?.fullName}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteStudent}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
