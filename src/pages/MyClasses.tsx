
import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";

interface TeacherAssignment {
  id: string;
  class_id: string;
  subject: string;
  class?: {
    class_name: string;
    medium: string;
  };
}

interface AssignedStudent {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  current_class: string;
}

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
  const [isAddMarksheetOpen, setIsAddMarksheetOpen] = useState(false);
  
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch teacher's assignments
  const fetchTeacherAssignments = async () => {
    if (!user?.email) return;

    try {
      console.log('Fetching assignments for teacher:', user.email);
      
      // First get the teacher's ID
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('teacher_id')
        .eq('email', user.email)
        .single();

      if (teacherError || !teacherData) {
        console.error('Error fetching teacher data:', teacherError);
        return;
      }

      console.log('Teacher data:', teacherData);

      // Get teacher's class assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('teacher_class_assignments')
        .select(`
          *,
          classes (
            class_name,
            medium
          )
        `)
        .eq('teacher_id', teacherData.teacher_id);

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        return;
      }

      console.log('Teacher assignments:', assignments);
      setTeacherAssignments(assignments || []);

    } catch (error) {
      console.error('Error in fetchTeacherAssignments:', error);
    }
  };

  // Fetch students from assigned classes
  const fetchAssignedStudents = async () => {
    if (teacherAssignments.length === 0) return;

    try {
      const classIds = teacherAssignments.map(assignment => assignment.class_id);
      console.log('Fetching students for class IDs:', classIds);

      // Get class names first
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, class_name')
        .in('id', classIds);

      if (classError) {
        console.error('Error fetching class data:', classError);
        return;
      }

      const classNameMap = classData?.reduce((acc, cls) => {
        acc[cls.id] = cls.class_name;
        return acc;
      }, {} as Record<string, string>) || {};

      // Get students for those classes
      const classNames = Object.values(classNameMap);
      console.log('Fetching students for classes:', classNames);

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .in('current_class', classNames);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return;
      }

      console.log('Fetched students:', students);
      setAssignedStudents(students || []);

    } catch (error) {
      console.error('Error in fetchAssignedStudents:', error);
    }
  };

  // Convert assignments to class sections format
  const processClassSections = () => {
    const classSections: ClassSection[] = teacherAssignments.map(assignment => {
      const className = assignment.class?.class_name || 'Unknown';
      const studentsInClass = assignedStudents.filter(student => 
        student.current_class === className
      );

      return {
        id: assignment.id,
        class: className,
        section: assignment.class?.medium || 'A',
        subject: assignment.subject || 'Unknown',
        students: studentsInClass.length,
        averageAttendance: 92, // Mock data - you can implement actual calculation
        averageMarks: 76, // Mock data - you can implement actual calculation
        lastClassDate: "2023-11-08" // Mock data - you can implement actual calculation
      };
    });

    setClasses(classSections);
  };

  useEffect(() => {
    fetchTeacherAssignments();
  }, [user?.email]);

  useEffect(() => {
    if (teacherAssignments.length > 0) {
      fetchAssignedStudents();
    }
  }, [teacherAssignments]);

  useEffect(() => {
    if (teacherAssignments.length > 0 && assignedStudents.length >= 0) {
      processClassSections();
      setIsLoading(false);
    }
  }, [teacherAssignments, assignedStudents]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      `Class ${cls.class} ${cls.section}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const filteredStudents = assignedStudents.filter(student => 
    selectedClass && 
    student.current_class === selectedClass.class
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your assigned classes...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              {filteredClasses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Classes Assigned</h3>
                  <p className="text-muted-foreground">
                    You don't have any classes assigned to you yet. Please contact the administrator.
                  </p>
                </div>
              ) : (
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
                      {filteredClasses.map((cls) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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
                <span className="text-3xl font-bold ml-4">{assignedStudents.length}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              Across {classes.length} assigned classes
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assigned Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold ml-4">{classes.length}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              Classes assigned to you
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardCheck className="h-10 w-10 text-primary" />
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
              Average marks in recent tests across your assigned classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="flex items-center gap-4">
                <BarChart4 className="h-16 w-16 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg">Performance charts will appear here</p>
                  <p className="text-sm text-muted-foreground">
                    Track student progress across your {classes.length} assigned classes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Class {selectedClass?.class} {selectedClass?.section} - {selectedClass?.subject}
            </DialogTitle>
            <DialogDescription>
              View and manage students in this assigned class
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
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell className="font-medium">
                            {student.first_name} {student.last_name}
                          </TableCell>
                          <TableCell>Class {student.current_class}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No students found for this class
                        </TableCell>
                      </TableRow>
                    )}
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
                  Attendance data for your assigned class would be displayed here.
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
                  Performance metrics for your assigned class would be displayed here.
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
                        <TableCell>{student.first_name} {student.last_name}</TableCell>
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
