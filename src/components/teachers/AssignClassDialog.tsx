
import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Teacher, Class } from "@/types/models";

interface AssignClassDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  classes: Class[];
  onAssignClass: (classIds: string[], subject: string) => void;
}

export const AssignClassDialog: React.FC<AssignClassDialogProps> = ({
  isOpen,
  onOpenChange,
  teacher,
  classes,
  onAssignClass,
}) => {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [subject, setSubject] = useState("");

  const handleClassToggle = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSubmit = () => {
    if (selectedClassIds.length > 0 && subject.trim()) {
      onAssignClass(selectedClassIds, subject);
      setSelectedClassIds([]);
      setSubject("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Classes to {teacher?.name}</DialogTitle>
          <DialogDescription>
            Select the classes and subject this teacher will handle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="Enter subject name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Classes:</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded p-4">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cls.id}
                    checked={selectedClassIds.includes(cls.id)}
                    onCheckedChange={() => handleClassToggle(cls.id)}
                  />
                  <Label htmlFor={cls.id} className="text-sm font-normal">
                    {cls.className === "UKG" || cls.className === "LKG" 
                      ? cls.className 
                      : `Class ${cls.className}`} ({cls.medium})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={selectedClassIds.length === 0 || !subject.trim()}
          >
            Assign Classes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
