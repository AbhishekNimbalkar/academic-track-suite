
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Marks } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, TrendingUp, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GradeManager } from "@/components/academics/GradeManager";
import { ProgressTracker } from "@/components/academics/ProgressTracker";
import { PerformanceAnalytics } from "@/components/academics/PerformanceAnalytics";
import { dataService } from "@/services/mockData";

const Academics: React.FC = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();

  const [marksData, setMarksData] = useState<Marks[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    // Load initial data
    const marks = dataService.getMarks();
    setMarksData(marks);
  }, []);

  const students = dataService.getStudents();

  const filteredMarksData = marksData.filter((mark) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const classFilter = selectedClass ? mark.class === selectedClass : true;
    const subjectFilter = selectedSubject
      ? mark.subjects.some((subject) => subject.subjectName === selectedSubject)
      : true;

    return (
      searchRegex.test(mark.studentName) && classFilter && subjectFilter
    );
  });

  const handleAddMarks = (newMarks: Omit<Marks, "id">) => {
    const marksWithId: Marks = {
      ...newMarks,
      id: `marks_${Date.now()}`,
    };
    setMarksData(prev => [...prev, marksWithId]);
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Academics</h1>
          {isAdmin && (
            <GradeManager students={students} onAddMarks={handleAddMarks} />
          )}
        </div>

        <Tabs defaultValue="marks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marks" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Student Marks
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress Tracker
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marks">
            <Card>
              <CardHeader>
                <CardTitle>Student Marks</CardTitle>
                <CardDescription>
                  Manage and view student academic records
                </CardDescription>
                <div className="flex items-center space-x-4 mt-4">
                  <Input
                    type="text"
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Select onValueChange={(value) => setSelectedClass(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setSelectedSubject(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      <SelectItem value="Math">Math</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarksData.map((mark) =>
                      mark.subjects.map((subject, index) => (
                        <TableRow key={`${mark.id}-${index}`}>
                          <TableCell>{mark.studentId}</TableCell>
                          <TableCell>{mark.studentName}</TableCell>
                          <TableCell>{mark.class}</TableCell>
                          <TableCell>{subject.subjectName}</TableCell>
                          <TableCell>{subject.marksObtained}</TableCell>
                          <TableCell>{subject.totalMarks}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subject.grade === "A+" || subject.grade === "A"
                                  ? "default"
                                  : subject.grade === "B+" || subject.grade === "B"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {subject.grade || "N/A"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Progress Tracker</CardTitle>
                  <CardDescription>
                    Track individual student academic progress over time
                  </CardDescription>
                  <div className="mt-4">
                    <Label>Select Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Choose a student to view progress" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.fullName} - Class {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>

              {selectedStudentData && (
                <ProgressTracker
                  student={selectedStudentData}
                  marks={marksData}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    Analyze class and subject performance metrics
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
                    <Select onValueChange={(value) => setSelectedClass(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Classes</SelectItem>
                        <SelectItem value="9">Class 9</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>

              <PerformanceAnalytics
                marks={marksData}
                className={selectedClass || undefined}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Academics;
