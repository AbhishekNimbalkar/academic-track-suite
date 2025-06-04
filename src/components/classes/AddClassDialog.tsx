
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Class } from "@/types/models";

interface AddClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newClass: Omit<Class, "id">;
  setNewClass: React.Dispatch<React.SetStateAction<Omit<Class, "id">>>;
  onAddClass: () => void;
}

export const AddClassDialog: React.FC<AddClassDialogProps> = ({
  isOpen,
  onOpenChange,
  newClass,
  setNewClass,
  onAddClass,
}) => {
  const classOptions = ["UKG", "LKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const mediumOptions = ["English", "Marathi Medium", "Semi-English Medium"];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Add a new class to the system. Classes 5-10 can have different mediums.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="className" className="text-right">
              Class
            </Label>
            <Select value={newClass.className} onValueChange={(value) => setNewClass({ ...newClass, className: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls === "UKG" || cls === "LKG" ? cls : `Class ${cls}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="medium" className="text-right">
              Medium
            </Label>
            <Select value={newClass.medium} onValueChange={(value) => setNewClass({ ...newClass, medium: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                {mediumOptions.map((medium) => (
                  <SelectItem key={medium} value={medium}>
                    {medium}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="academicYear" className="text-right">
              Academic Year
            </Label>
            <Input
              id="academicYear"
              value={newClass.academicYear}
              onChange={(e) => setNewClass({ ...newClass, academicYear: e.target.value })}
              className="col-span-3"
              placeholder="2024-25"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onAddClass}>
            Add Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
