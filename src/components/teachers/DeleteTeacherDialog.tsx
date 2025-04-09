
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/models";

interface DeleteTeacherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacherToDelete: Teacher | null;
  onDeleteTeacher: () => void;
}

export const DeleteTeacherDialog: React.FC<DeleteTeacherDialogProps> = ({
  isOpen,
  onOpenChange,
  teacherToDelete,
  onDeleteTeacher,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {teacherToDelete?.name}
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
            onClick={onDeleteTeacher}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
