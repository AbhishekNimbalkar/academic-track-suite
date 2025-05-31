
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  const getClassOptions = () => {
    const options = [
      { value: "LKG", label: "LKG" },
      { value: "UKG", label: "UKG" },
    ];
    
    for (let i = 1; i <= 12; i++) {
      options.push({ value: i.toString(), label: `Class ${i}` });
    }
    
    return options;
  };

  const showStreamSelection = newStudent.class === "11" || newStudent.class === "12";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={newStudent.gender || "male"} 
                onValueChange={(value: "male" | "female" | "other") => 
                  onStudentChange({ ...newStudent, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select 
                value={newStudent.bloodGroup || "A+"} 
                onValueChange={(value: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-") => 
                  onStudentChange({ ...newStudent, bloodGroup: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select 
                value={newStudent.class} 
                onValueChange={(value) => 
                  onStudentChange({ ...newStudent, class: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {getClassOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select 
                value={newStudent.section} 
                onValueChange={(value) => 
                  onStudentChange({ ...newStudent, section: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((section) => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showStreamSelection && (
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Select 
                  value={newStudent.stream || ""} 
                  onValueChange={(value: "APC" | "USA") => 
                    onStudentChange({ ...newStudent, stream: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APC">APC Stream</SelectItem>
                    <SelectItem value="USA">USA Stream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="residentialType">Residential Type</Label>
              <Select 
                value={newStudent.residentialType || "non-residential"} 
                onValueChange={(value: "residential" | "non-residential") => 
                  onStudentChange({ ...newStudent, residentialType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="non-residential">Non-Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caste">Caste</Label>
              <Input
                id="caste"
                value={newStudent.caste || ""}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, caste: e.target.value })
                }
                placeholder="Caste"
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
            <Textarea
              id="address"
              value={newStudent.address}
              onChange={(e) =>
                onStudentChange({ ...newStudent, address: e.target.value })
              }
              placeholder="Full address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
              <Input
                id="aadhaarNumber"
                value={newStudent.aadhaarNumber || ""}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, aadhaarNumber: e.target.value })
                }
                placeholder="12-digit Aadhaar number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panCardNumber">PAN Card Number (Optional)</Label>
              <Input
                id="panCardNumber"
                value={newStudent.panCardNumber || ""}
                onChange={(e) =>
                  onStudentChange({ ...newStudent, panCardNumber: e.target.value })
                }
                placeholder="PAN Card Number"
              />
            </div>
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
            <Textarea
              id="medicalInfo"
              value={newStudent.medicalInfo}
              onChange={(e) =>
                onStudentChange({ ...newStudent, medicalInfo: e.target.value })
              }
              placeholder="Any medical conditions or allergies"
              rows={2}
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
