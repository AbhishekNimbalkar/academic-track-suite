
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { MoreHorizontal, Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  joiningDate: string;
  qualification: string;
  address: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "TCH001",
      name: "John Smith",
      email: "john.smith@school.com",
      phone: "+91 9876543210",
      subjects: ["Mathematics", "Physics"],
      classes: ["9", "10"],
      joiningDate: "2020-07-15",
      qualification: "M.Sc, B.Ed",
      address: "123 Teacher Colony, School District",
    },
    {
      id: "TCH002",
      name: "Sarah Johnson",
      email: "sarah.johnson@school.com",
      phone: "+91 9876543211",
      subjects: ["English", "Social Studies"],
      classes: ["6", "7", "8"],
      joiningDate: "2018-06-10",
      qualification: "M.A, B.Ed",
      address: "456 Faculty Housing, Education Lane",
    },
    {
      id: "TCH003",
      name: "David Williams",
      email: "david.williams@school.com",
      phone: "+91 9876543212",
      subjects: ["Chemistry", "Biology"],
      classes: ["11", "12"],
      joiningDate: "2019-08-05",
      qualification: "Ph.D, B.Ed",
      address: "789 Professor Avenue, Knowledge Park",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, "id">>({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    classes: [],
    joiningDate: new Date().toISOString().split("T")[0],
    qualification: "",
    address: "",
  });
  const { toast } = useToast();

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    teacher.classes.some(cls => 
      cls.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddTeacher = () => {
    const newId = `TCH${(teachers.length + 1).toString().padStart(3, "0")}`;
    const addedTeacher = { ...newTeacher, id: newId };
    setTeachers([...teachers, addedTeacher]);
    setIsAddDialogOpen(false);
    toast({
      title: "Teacher Added",
      description: `${addedTeacher.name} has been successfully added.`,
    });
    
    // Reset form
    setNewTeacher({
      name: "",
      email: "",
      phone: "",
      subjects: [],
      classes: [],
      joiningDate: new Date().toISOString().split("T")[0],
      qualification: "",
      address: "",
    });
  };

  const handleDeleteTeacher = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
      toast({
        title: "Teacher Deleted",
        description: "The teacher has been successfully deleted.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Teacher
              </Button>
            </DialogTrigger>
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
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher}>Add Teacher</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Records</CardTitle>
            <CardDescription>
              Manage and view all teachers in the system
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers by name, ID, subjects or classes..."
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
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.id}</TableCell>
                        <TableCell className="font-medium">
                          {teacher.name}
                        </TableCell>
                        <TableCell>{teacher.subjects.join(", ")}</TableCell>
                        <TableCell>{teacher.classes.join(", ")}</TableCell>
                        <TableCell>
                          {new Date(teacher.joiningDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{teacher.qualification}</TableCell>
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
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  window.location.href = `mailto:${teacher.email}`;
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  window.location.href = `tel:${teacher.phone.replace(/\s+/g, "")}`;
                                }}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setTeacherToDelete(teacher);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No teachers found. Try adjusting your search.
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
                {teacherToDelete?.name}
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
              onClick={handleDeleteTeacher}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Teachers;
