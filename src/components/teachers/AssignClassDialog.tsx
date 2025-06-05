
import React, { useState, useEffect } from "react";
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

  // Reset form when dialog opens/closes or teacher changes
  useEffect(() => {
    if (!isOpen || !teacher) {
      setSelectedClassIds([]);
      setSubject("");
    }
  }, [isOpen, teacher]);

  const handleClassToggle = (classId: string) => {
    console.log('Toggling class:', classId);
    setSelectedClassIds(prev => {
      const newSelection = prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting assignment:', { selectedClassIds, subject, teacher });
    
    if (selectedClassIds.length > 0 && subject.trim() && teacher) {
      onAssignClass(selectedClassIds, subject.trim());
    } else {
      console.log('Validation failed:', { 
        hasClasses: selectedClassIds.length > 0, 
        hasSubject: subject.trim().length > 0, 
        hasTeacher: !!teacher 
      });
    }
  };

  const handleClose = () => {
    setSelectedClassIds([]);
    setSubject("");
    onOpenChange(false);
  };

  if (!teacher) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Classes to {teacher.name}</DialogTitle>
          <DialogDescription>
            Select the classes and subject this teacher will handle.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject *
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
                placeholder="Enter subject name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Classes: *</Label>
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded p-4">
                {classes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No classes available</p>
                ) : (
                  classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={selectedClassIds.includes(cls.id)}
                        onCheckedChange={() => handleClassToggle(cls.id)}
                      />
                      <Label htmlFor={`class-${cls.id}`} className="text-sm font-normal cursor-pointer">
                        {cls.className === "UKG" || cls.className === "LKG" 
                          ? cls.className 
                          : `Class ${cls.className}`} ({cls.medium})
                      </Label>
                    </div>
                  ))
                )}
              </div>
              {selectedClassIds.length === 0 && (
                <p className="text-sm text-red-500">Please select at least one class</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={selectedClassIds.length === 0 || !subject.trim()}
            >
              Assign Classes ({selectedClassIds.length} selected)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
