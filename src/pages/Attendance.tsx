
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Attendance, TeacherAttendance } from "@/types/models";
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
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Attendance: React.FC = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();

  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [teacherAttendanceData, setTeacherAttendanceData] = useState<TeacherAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "late">("present");
  const [teacherAttendanceStatus, setTeacherAttendanceStatus] = useState<"present" | "absent" | "late" | "leave">("present");
  const [isMarkingTeacherAttendance, setIsMarkingTeacherAttendance] = useState<boolean>(false);
  const [isMarkingStudentAttendance, setIsMarkingStudentAttendance] = useState<boolean>(false);

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]; // Example classes
  const teachers = ["Teacher A", "Teacher B", "Teacher C"]; // Example teachers

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleTeacherIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherId(e.target.value);
  };

  const handleAttendanceStatusChange = (value: "present" | "absent" | "late") => {
    setAttendanceStatus(value);
  };

  const handleTeacherAttendanceStatusChange = (value: "present" | "absent" | "late" | "leave") => {
    setTeacherAttendanceStatus(value);
  };

  const markStudentAttendance = () => {
    setIsMarkingStudentAttendance(true);
    // Simulate marking attendance
    setTimeout(() => {
      const newAttendance: Attendance = {
        id: Math.random().toString(),
        studentId: studentId,
        studentName: "Student " + studentId,
        date: selectedDate,
        status: attendanceStatus,
        remarks: "",
      };

      setAttendanceData([...attendanceData, newAttendance]);
      setStudentId("");
      toast({
        title: "Attendance Marked",
        description: `Attendance marked for Student ID ${studentId} as ${attendanceStatus}.`,
      });
      setIsMarkingStudentAttendance(false);
    }, 1000);
  };

  const markTeacherAttendance = () => {
    setIsMarkingTeacherAttendance(true);
    // Simulate marking attendance
    setTimeout(() => {
      const newTeacherAttendance: TeacherAttendance = {
        id: Math.random().toString(),
        teacherId: teacherId,
        teacherName: selectedTeacher,
        date: selectedDate,
        status: teacherAttendanceStatus,
        reason: "",
      };

      setTeacherAttendanceData([...teacherAttendanceData, newTeacherAttendance]);
      setTeacherId("");
      toast({
        title: "Attendance Marked",
        description: `Attendance marked for Teacher ${selectedTeacher} as ${teacherAttendanceStatus}.`,
      });
      setIsMarkingTeacherAttendance(false);
    }, 1000);
  };

  useEffect(() => {
    // Simulate fetching attendance data
    const mockAttendanceData: Attendance[] = [
      {
        id: "1",
        studentId: "101",
        studentName: "Alice",
        date: selectedDate,
        status: "present",
        remarks: "Good",
      },
      {
        id: "2",
        studentId: "102",
        studentName: "Bob",
        date: selectedDate,
        status: "absent",
        remarks: "Sick",
      },
    ];

    const mockTeacherAttendanceData: TeacherAttendance[] = [
      {
        id: "1",
        teacherId: "T101",
        teacherName: "Teacher A",
        date: selectedDate,
        status: "present",
        reason: "",
      },
      {
        id: "2",
        teacherId: "T102",
        teacherName: "Teacher B",
        date: selectedDate,
        status: "leave",
        reason: "Personal",
      },
    ];

    setAttendanceData(mockAttendanceData);
    setTeacherAttendanceData(mockTeacherAttendanceData);
  }, [selectedDate]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mark Student Attendance</CardTitle>
            <CardDescription>
              Mark attendance for students by class and date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select onValueChange={handleClassChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  type="text"
                  id="studentId"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={handleStudentIdChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attendanceStatus">Attendance Status</Label>
                <Select onValueChange={handleAttendanceStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button onClick={markStudentAttendance} disabled={isMarkingStudentAttendance}>
                  {isMarkingStudentAttendance ? "Marking..." : "Mark Attendance"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mark Teacher Attendance</CardTitle>
            <CardDescription>
              Mark attendance for teachers by date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="teacherDate">Date</Label>
                <Input
                  type="date"
                  id="teacherDate"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
              <div>
                <Label htmlFor="teacher">Teacher</Label>
                <Select onValueChange={handleTeacherChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input
                  type="text"
                  id="teacherId"
                  placeholder="Enter teacher ID"
                  value={teacherId}
                  onChange={handleTeacherIdChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacherAttendanceStatus">Attendance Status</Label>
                <Select onValueChange={handleTeacherAttendanceStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button onClick={markTeacherAttendance} disabled={isMarkingTeacherAttendance}>
                  {isMarkingTeacherAttendance ? "Marking..." : "Mark Attendance"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              View attendance records for students and teachers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Student Attendance</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.studentId}</TableCell>
                      <TableCell>{attendance.studentName}</TableCell>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>
                        {attendance.status === "present" && (
                          <Badge variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Present
                          </Badge>
                        )}
                        {attendance.status === "absent" && (
                          <Badge variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Absent
                          </Badge>
                        )}
                        {attendance.status === "late" && (
                          <Badge variant="secondary">
                            <Clock className="h-4 w-4 mr-2" />
                            Late
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{attendance.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Teacher Attendance</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherAttendanceData.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.teacherId}</TableCell>
                      <TableCell>{attendance.teacherName}</TableCell>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>
                        {attendance.status === "present" && (
                          <Badge variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Present
                          </Badge>
                        )}
                        {attendance.status === "absent" && (
                          <Badge variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Absent
                          </Badge>
                        )}
                        {attendance.status === "late" && (
                          <Badge variant="secondary">
                            <Clock className="h-4 w-4 mr-2" />
                            Late
                          </Badge>
                        )}
                        {attendance.status === "leave" && (
                          <Badge>
                            <Calendar className="h-4 w-4 mr-2" />
                            Leave
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{attendance.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Attendance;
