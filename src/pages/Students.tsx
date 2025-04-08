
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Student } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Students: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [students, setStudents] = useState<Student[]>(dataService.getStudents());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    fullName: "",
    dateOfBirth: "",
    class: "",
    section: "",
    admissionDate: new Date().toISOString().split("T")[0],
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    medicalInfo: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    const addedStudent = dataService.addStudent(newStudent);
    setStudents([...students, addedStudent]);
    setIsAddDialogOpen(false);
    toast({
      title: "Student Added",
      description: `${addedStudent.fullName} has been successfully added.`,
    });
    
    // Reset form
    setNewStudent({
      fullName: "",
      dateOfBirth: "",
      class: "",
      section: "",
      admissionDate: new Date().toISOString().split("T")[0],
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      medicalInfo: "",
    });
  };

  const handleDeleteStudent = () => {
    if (studentToDelete) {
      dataService.deleteStudent(studentToDelete.id);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      toast({
        title: "Student Deleted",
        description: "The student has been successfully deleted.",
      });
    }
  };

  const viewStudentDetails = (student: Student) => {
    navigate(`/students/${student.id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                          setNewStudent({ ...newStudent, fullName: e.target.value })
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
                          setNewStudent({ ...newStudent, dateOfBirth: e.target.value })
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
                          setNewStudent({ ...newStudent, class: e.target.value })
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
                          setNewStudent({ ...newStudent, section: e.target.value })
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
                        setNewStudent({ ...newStudent, parentName: e.target.value })
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
                          setNewStudent({ ...newStudent, parentEmail: e.target.value })
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
                          setNewStudent({ ...newStudent, parentPhone: e.target.value })
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
                        setNewStudent({ ...newStudent, address: e.target.value })
                      }
                      placeholder="Full address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalInfo">Medical Information</Label>
                    <Input
                      id="medicalInfo"
                      value={newStudent.medicalInfo}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, medicalInfo: e.target.value })
                      }
                      placeholder="Any medical conditions or allergies"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
            <CardDescription>
              Manage and view all students in the system
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, ID, class or section..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell className="font-medium">
                          {student.fullName}
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.parentName}</TableCell>
                        <TableCell>{student.parentPhone}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => viewStudentDetails(student)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {isAdmin && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                      setStudentToDelete(student);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No students found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {studentToDelete?.fullName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStudent}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Students;
