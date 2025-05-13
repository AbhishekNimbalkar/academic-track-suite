
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { Student } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface StudentListProps {
  students: Student[];
  onDeleteClick: (student: Student) => void;
}

export function StudentList({ students, onDeleteClick }: StudentListProps) {
  const { hasPermission } = useAuth();
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  
  if (students.length === 0) {
    return <div className="text-center py-6">No students found.</div>;
  }

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class & Section</TableHead>
              <TableHead>Parent Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>Class {student.class} - {student.section}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>{student.parentPhone}</TableCell>
                <TableCell>
                  {student.residentialType && (
                    <Badge variant={student.residentialType === "residential" ? "default" : "outline"}>
                      {student.residentialType === "residential" ? "Residential" : "Non-Residential"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {hasPermission("manage_students") && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => onDeleteClick(student)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedStudent?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex justify-center md:col-span-2">
                {selectedStudent.imageUrl && (
                  <img 
                    src={selectedStudent.imageUrl} 
                    alt={selectedStudent.fullName}
                    className="h-32 w-32 object-cover rounded-md border" 
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Student ID</p>
                <p className="text-sm">{selectedStudent.id}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm">{selectedStudent.fullName}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-sm">{selectedStudent.dateOfBirth}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Class & Section</p>
                <p className="text-sm">Class {selectedStudent.class} - {selectedStudent.section}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Admission Date</p>
                <p className="text-sm">{selectedStudent.admissionDate}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Admission Class</p>
                <p className="text-sm">Class {selectedStudent.admissionClass}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Parent/Guardian Name</p>
                <p className="text-sm">{selectedStudent.parentName}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Parent Email</p>
                <p className="text-sm">{selectedStudent.parentEmail || "Not provided"}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Parent Phone</p>
                <p className="text-sm">{selectedStudent.parentPhone}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Residential Type</p>
                <p className="text-sm">{selectedStudent.residentialType === "residential" ? "Residential" : "Non-Residential"}</p>
              </div>
              
              {selectedStudent.caste && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Caste</p>
                  <p className="text-sm">{selectedStudent.caste}</p>
                </div>
              )}
              
              {selectedStudent.aadhaarNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Aadhaar Number</p>
                  <p className="text-sm">{selectedStudent.aadhaarNumber}</p>
                </div>
              )}
              
              {selectedStudent.panCardNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">PAN Card Number</p>
                  <p className="text-sm">{selectedStudent.panCardNumber}</p>
                </div>
              )}
              
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm">{selectedStudent.address}</p>
              </div>
              
              {selectedStudent.medicalInfo && (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium">Medical Information</p>
                  <p className="text-sm">{selectedStudent.medicalInfo}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
