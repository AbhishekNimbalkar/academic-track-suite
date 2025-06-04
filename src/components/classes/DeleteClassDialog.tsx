
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Class } from "@/types/models";

interface DeleteClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classToDelete: Class | null;
  onDeleteClass: () => void;
}

export const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  isOpen,
  onOpenChange,
  classToDelete,
  onDeleteClass,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the class{" "}
            <strong>
              {classToDelete?.className === "UKG" || classToDelete?.className === "LKG" 
                ? classToDelete?.className 
                : `Class ${classToDelete?.className}`} ({classToDelete?.medium})
            </strong>{" "}
            and remove it from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteClass}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
