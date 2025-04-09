
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  BookOpen,
  CalendarDays,
  Users,
  MoreHorizontal,
  FileText,
  ClipboardCheck,
  PencilLine,
  Plus,
  BarChart4
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ClassSection {
  id: string;
  class: string;
  section: string;
  subject: string;
  students: number;
  averageAttendance: number;
  averageMarks: number;
  lastClassDate: string;
}

const MyClasses: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("ongoing");
  const [isAddMarksheetOpen, setIsAddMarksheetOpen] = useState(false);

  // Mock class data for teacher
  const [classes, setClasses] = useState<ClassSection[]>([
    {
      id: "CLS001",
      class: "9",
      section: "A",
      subject: "Mathematics",
      students: 35,
      averageAttendance: 92,
      averageMarks: 76,
      lastClassDate: "2023-11-08"
    },
    {
      id: "CLS002",
      class: "10",
      section: "B",
      subject: "Mathematics",
      students: 32,
      averageAttendance: 89,
      averageMarks: 72,
      lastClassDate: "2023-11-09"
    },
    {
      id: "CLS003",
      class: "9",
      section: "B",
      subject: "Physics",
      students: 33,
      averageAttendance: 94,
      averageMarks: 81,
      lastClassDate: "2023-11-10"
    },
    {
      id: "CLS004",
      class: "10",
      section: "A",
      subject: "Physics",
      students: 34,
      averageAttendance: 91,
      averageMarks: 78,
      lastClassDate: "2023-11-07"
    }
  ]);

  // Mock students data
  const [students, setStudents] = useState([
    {
      id: "STU001",
      name: "Aarav Kumar",
      class: "9",
      section: "A",
      attendance: 95,
      marks: {
        Mathematics: 88,
        Physics: 76,
        Chemistry: 82
      }
    },
    {
      id: "STU002",
      name: "Diya Patel",
      class: "9",
      section: "A",
      attendance: 92,
      marks: {
        Mathematics: 92,
        Physics: 85,
        Chemistry: 79
      }
    },
    {
      id: "STU003",
      name: "Vihaan Sharma",
      class: "9",
      section: "A",
      attendance: 89,
      marks: {
        Mathematics: 65,
        Physics: 72,
        Chemistry: 68
      }
    },
    {
      id: "STU004",
      name: "Ananya Singh",
      class: "9",
      section: "A",
      attendance: 97,
      marks: {
        Mathematics: 95,
        Physics: 88,
        Chemistry: 91
      }
    }
  ]);

  // Filter classes based on search query
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      `Class ${cls.class} ${cls.section}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Filter students for selected class
  const filteredStudents = students.filter(student => 
    selectedClass && 
    student.class === selectedClass.class && 
    student.section === selectedClass.section
  );

  const handleAddAttendance = () => {
    toast({
      title: "Redirecting to Attendance",
      description: "Taking you to the attendance page for this class",
    });
    // In a real app, this would navigate to the attendance page with class pre-selected
  };

  const handleAddMarks = () => {
    setIsAddMarksheetOpen(true);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Class performance report is being generated",
    });
    // In a real app, this would generate a PDF report
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Teaching Schedule</CardTitle>
              <CardDescription>
                View and manage your assigned classes and subjects
              </CardDescription>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by class, section or subject..."
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
                      <TableHead>Class & Section</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg. Attendance</TableHead>
                      <TableHead>Avg. Marks</TableHead>
                      <TableHead>Last Class</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.length > 0 ? (
                      filteredClasses.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">
                            Class {cls.class} {cls.section}
                          </TableCell>
                          <TableCell>{cls.subject}</TableCell>
                          <TableCell>{cls.students}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cls.averageAttendance >= 90 ? "bg-green-100 text-green-800" :
                              cls.averageAttendance >= 75 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {cls.averageAttendance}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cls.averageMarks >= 80 ? "bg-green-100 text-green-800" :
                              cls.averageMarks >= 60 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {cls.averageMarks}%
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(cls.lastClassDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedClass(cls);
                                    setIsDetailsOpen(true);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  View Students
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleAddAttendance}>
                                  <CalendarDays className="h-4 w-4 mr-2" />
                                  Take Attendance
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleAddMarks}>
                                  <PencilLine className="h-4 w-4 mr-2" />
                                  Add Marks
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleGenerateReport}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No classes found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold ml-4">134</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              Across all assigned classes
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardCheck className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold ml-4">3</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              Within the next 2 weeks
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold ml-4">7</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              Assignments to be graded
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>
              Average marks in recent tests across your classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="flex items-center gap-4">
                <BarChart4 className="h-16 w-16 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg">Performance charts will appear here</p>
                  <p className="text-sm text-muted-foreground">
                    Track student progress and identify areas for improvement
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Class {selectedClass?.class} {selectedClass?.section} - {selectedClass?.subject}
            </DialogTitle>
            <DialogDescription>
              View and manage students in this class
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="students">
            <TabsList className="w-full">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Subject Marks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.attendance >= 90 ? "bg-green-100 text-green-800" :
                            student.attendance >= 75 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {student.attendance}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {selectedClass && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.marks[selectedClass.subject as keyof typeof student.marks] >= 80 ? "bg-green-100 text-green-800" :
                              student.marks[selectedClass.subject as keyof typeof student.marks] >= 60 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {student.marks[selectedClass.subject as keyof typeof student.marks]}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="attendance" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Attendance</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Take Attendance
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Attendance data for the last 30 days would be displayed here.
                </p>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <div className="text-center">
                    <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2">Attendance calendar view</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="performance" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Class Performance</h3>
                  <Button size="sm">Generate Report</Button>
                </div>
                <p className="text-muted-foreground">
                  Performance metrics and analytics would be displayed here.
                </p>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <div className="text-center">
                    <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2">Performance analytics charts</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Marks Dialog */}
      <Dialog open={isAddMarksheetOpen} onOpenChange={setIsAddMarksheetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Marks</DialogTitle>
            <DialogDescription>
              Enter marks for students in {selectedClass && `Class ${selectedClass.class} ${selectedClass.section}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Test/Exam Name</Label>
              <Input placeholder="e.g. Midterm Examination" />
            </div>
            <div className="space-y-2">
              <Label>Maximum Marks</Label>
              <Input type="number" placeholder="e.g. 100" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Student Marks</Label>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Enter marks" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMarksheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Marks Saved",
                description: "Student marks have been successfully saved.",
              });
              setIsAddMarksheetOpen(false);
            }}>
              Save Marks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MyClasses;
