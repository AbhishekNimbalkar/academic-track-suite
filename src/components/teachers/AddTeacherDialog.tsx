
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
import { Teacher } from "@/types/models";

interface AddTeacherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTeacher: Omit<Teacher, "id">;
  setNewTeacher: React.Dispatch<React.SetStateAction<Omit<Teacher, "id">>>;
  onAddTeacher: () => void;
}

export const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({
  isOpen,
  onOpenChange,
  newTeacher,
  setNewTeacher,
  onAddTeacher,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Enter the teacher's details below to create a new teacher record.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newTeacher.name}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={newTeacher.qualification}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, qualification: e.target.value })
                }
                placeholder="M.Sc, B.Ed"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newTeacher.email}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, email: e.target.value })
                }
                placeholder="teacher@school.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newTeacher.phone}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, phone: e.target.value })
                }
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma separated)</Label>
            <Input
              id="subjects"
              value={newTeacher.subjects.join(", ")}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  subjects: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="Mathematics, Physics"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classes">Classes (comma separated)</Label>
            <Input
              id="classes"
              value={newTeacher.classes.join(", ")}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  classes: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              placeholder="9, 10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date</Label>
            <Input
              id="joiningDate"
              type="date"
              value={newTeacher.joiningDate}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, joiningDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={newTeacher.address}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, address: e.target.value })
              }
              placeholder="Teacher's address"
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
          <Button onClick={onAddTeacher}>Add Teacher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
