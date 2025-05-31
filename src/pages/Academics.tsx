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
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Academics: React.FC = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();

  const [marksData, setMarksData] = useState<Marks[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddMarksDialogOpen, setIsAddMarksDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch marks data from API or database here
    // Example data:
    const mockMarksData: Marks[] = [
      {
        id: "1",
        studentId: "S101",
        studentName: "Alice Smith",
        class: "10",
        section: "A",
        academicYear: "2023-2024",
        subjects: [
          {
            subjectName: "Math",
            marksObtained: 85,
            totalMarks: 100,
            grade: "A",
            examType: "final",
          },
          {
            subjectName: "Science",
            marksObtained: 92,
            totalMarks: 100,
            grade: "A+",
            examType: "final",
          },
        ],
      },
      {
        id: "2",
        studentId: "S102",
        studentName: "Bob Johnson",
        class: "10",
        section: "A",
        academicYear: "2023-2024",
        subjects: [
          {
            subjectName: "Math",
            marksObtained: 78,
            totalMarks: 100,
            grade: "B",
            examType: "final",
          },
          {
            subjectName: "Science",
            marksObtained: 88,
            totalMarks: 100,
            grade: "B+",
            examType: "final",
          },
        ],
      },
    ];
    setMarksData(mockMarksData);
  }, []);

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

  const handleAddMarks = () => {
    // Implement add marks functionality here
    toast({
      title: "Add Marks",
      description: "Adding marks functionality will be implemented soon.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Academics</h1>
          {isAdmin && (
            <Button onClick={() => setIsAddMarksDialogOpen(true)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Add Marks
            </Button>
          )}
        </div>

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
                              ? "success"
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
      </div>
    </MainLayout>
  );
};

export default Academics;
