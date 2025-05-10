import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Student, Marks } from "@/types/models";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  BookOpen, 
  Plus, 
  FileDown, 
  ArrowRight 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Academics: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "class_teacher"; // Fixed: changed "teacher" to "class_teacher"
  const [students, setStudents] = useState<Student[]>(dataService.getStudents());
  const [marksData, setMarksData] = useState<Marks[]>(dataService.getMarks());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddMarksDialogOpen, setIsAddMarksDialogOpen] = useState(false);
  const [newMarks, setNewMarks] = useState<Omit<Marks, "id">>({
    studentId: "",
    studentName: "",
    class: "",
    section: "",
    academicYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
    subjects: [
      { subjectName: "Mathematics", marksObtained: 0, totalMarks: 100, examType: "midterm" },
      { subjectName: "Science", marksObtained: 0, totalMarks: 100, examType: "midterm" },
      { subjectName: "English", marksObtained: 0, totalMarks: 100, examType: "midterm" },
      { subjectName: "Social Studies", marksObtained: 0, totalMarks: 100, examType: "midterm" },
      { subjectName: "Hindi", marksObtained: 0, totalMarks: 100, examType: "midterm" },
    ],
  });
  const { toast } = useToast();

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewAcademics = (student: Student) => {
    setSelectedStudent(student);
    // Pre-populate new marks form with student details
    setNewMarks({
      ...newMarks,
      studentId: student.id,
      studentName: student.fullName,
      class: student.class,
      section: student.section,
    });
  };

  const handleAddMarks = () => {
    const addedMarks = dataService.addMarks(newMarks);
    setMarksData([...marksData, addedMarks]);
    setIsAddMarksDialogOpen(false);
    toast({
      title: "Marks Added",
      description: `Marks for ${newMarks.studentName} have been successfully added.`,
    });
  };

  const getStudentMarks = (studentId: string) => {
    return marksData.filter(m => m.studentId === studentId);
  };

  const calculateTotalMarks = (marks: Marks) => {
    const totalObtained = marks.subjects.reduce(
      (sum, subject) => sum + subject.marksObtained,
      0
    );
    const totalPossible = marks.subjects.reduce(
      (sum, subject) => sum + subject.totalMarks,
      0
    );
    const percentage = (totalObtained / totalPossible) * 100;
    
    return {
      totalObtained,
      totalPossible,
      percentage: percentage.toFixed(2),
    };
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Academic Records</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              View and manage academic records for students
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
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAcademics(student)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            View Academics
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No students found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedStudent && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Academic History: {selectedStudent.fullName}</CardTitle>
                  <CardDescription>
                    Class {selectedStudent.class}-{selectedStudent.section} | ID: {selectedStudent.id}
                  </CardDescription>
                </div>
                {isTeacher && (
                  <Dialog
                    open={isAddMarksDialogOpen}
                    onOpenChange={setIsAddMarksDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Marks
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add Marks for {selectedStudent.fullName}</DialogTitle>
                        <DialogDescription>
                          Enter the subject-wise marks for the student
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="academicYear">Academic Year</Label>
                            <Input
                              id="academicYear"
                              value={newMarks.academicYear}
                              onChange={(e) =>
                                setNewMarks({
                                  ...newMarks,
                                  academicYear: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="block mb-2">Subject Marks</Label>
                          {newMarks.subjects.map((subject, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 mb-2">
                              <div className="col-span-6">
                                <Input
                                  value={subject.subjectName}
                                  onChange={(e) => {
                                    const updatedSubjects = [...newMarks.subjects];
                                    updatedSubjects[index].subjectName = e.target.value;
                                    setNewMarks({
                                      ...newMarks,
                                      subjects: updatedSubjects,
                                    });
                                  }}
                                  placeholder="Subject Name"
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  type="number"
                                  min="0"
                                  max={subject.totalMarks}
                                  value={subject.marksObtained}
                                  onChange={(e) => {
                                    const updatedSubjects = [...newMarks.subjects];
                                    updatedSubjects[index].marksObtained = Number(e.target.value);
                                    setNewMarks({
                                      ...newMarks,
                                      subjects: updatedSubjects,
                                    });
                                  }}
                                  placeholder="Marks"
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  type="number"
                                  min="1"
                                  value={subject.totalMarks}
                                  onChange={(e) => {
                                    const updatedSubjects = [...newMarks.subjects];
                                    updatedSubjects[index].totalMarks = Number(e.target.value);
                                    setNewMarks({
                                      ...newMarks,
                                      subjects: updatedSubjects,
                                    });
                                  }}
                                  placeholder="Total"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddMarksDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddMarks}>Add Marks</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getStudentMarks(selectedStudent.id).length > 0 ? (
                getStudentMarks(selectedStudent.id).map((marks) => (
                  <div key={marks.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Academic Year: {marks.academicYear}
                      </h3>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4 mr-1" />
                        Download Marksheet
                      </Button>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">Marks Obtained</TableHead>
                            <TableHead className="text-right">Total Marks</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {marks.subjects.map((subject, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {subject.subjectName}
                              </TableCell>
                              <TableCell className="text-right">
                                {subject.marksObtained}
                              </TableCell>
                              <TableCell className="text-right">
                                {subject.totalMarks}
                              </TableCell>
                              <TableCell className="text-right">
                                {((subject.marksObtained / subject.totalMarks) * 100).toFixed(2)}%
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-bold">
                              Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {calculateTotalMarks(marks).totalObtained}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {calculateTotalMarks(marks).totalPossible}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {calculateTotalMarks(marks).percentage}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                            <p className="text-3xl font-bold">
                              {calculateTotalMarks(marks).percentage}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Grade</p>
                            <p className="text-3xl font-bold">
                              {getGrade(parseFloat(calculateTotalMarks(marks).percentage))}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Rank</p>
                            <p className="text-3xl font-bold">
                              {Math.floor(Math.random() * 10) + 1}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Academic Records Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no academic records available for this student yet.
                  </p>
                  {isTeacher && (
                    <Button
                      onClick={() => setIsAddMarksDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add First Record
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Academics;
