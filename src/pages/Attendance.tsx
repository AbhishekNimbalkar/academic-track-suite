
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
import { Calendar, CheckCircle, XCircle, Clock, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const Attendance: React.FC = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();

  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for classes by medium
  const classesByMedium = {
    "Marathi": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    "Semi English": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  };

  // Mock students data - in real implementation, fetch from database
  const mockStudents = [
    { id: "1", name: "राहुल शर्मा", rollNumber: "001", class: "5", medium: "Marathi" },
    { id: "2", name: "प्रिया पाटील", rollNumber: "002", class: "5", medium: "Marathi" },
    { id: "3", name: "अमित देशमुख", rollNumber: "003", class: "5", medium: "Marathi" },
    { id: "4", name: "सुनीता जाधव", rollNumber: "004", class: "5", medium: "Marathi" },
    { id: "5", name: "विकास मोरे", rollNumber: "005", class: "5", medium: "Marathi" },
  ];

  const handleMediumSelect = (medium: string) => {
    setSelectedMedium(medium);
    setSelectedClass("");
    setStudents([]);
  };

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    // Filter students by class and medium
    const filteredStudents = mockStudents.filter(
      student => student.class === className && student.medium === selectedMedium
    );
    setStudents(filteredStudents);
    
    // Initialize attendance records for the selected date
    const existingRecords = attendanceRecords.filter(
      record => record.date === selectedDate && record.class === className
    );
    
    // If no records exist for this date/class, create empty records
    if (existingRecords.length === 0) {
      const newRecords = filteredStudents.map(student => ({
        id: `${student.id}-${selectedDate}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        class: className,
        medium: selectedMedium,
        date: selectedDate,
        status: "present",
        comment: ""
      }));
      setAttendanceRecords(prev => [...prev, ...newRecords]);
    }
  };

  const updateAttendanceStatus = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId && record.date === selectedDate
          ? { ...record, status }
          : record
      )
    );
  };

  const updateAttendanceComment = (studentId: string, comment: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId && record.date === selectedDate
          ? { ...record, comment }
          : record
      )
    );
  };

  const saveAttendance = async () => {
    setIsLoading(true);
    try {
      // Here you would save to the database
      // const response = await supabase.from('attendance').upsert(attendanceRecords);
      
      toast({
        title: "Attendance Saved",
        description: `Attendance for ${selectedClass} class (${selectedMedium} Medium) has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "leave":
        return <UserX className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCurrentAttendanceRecord = (studentId: string) => {
    return attendanceRecords.find(
      record => record.studentId === studentId && record.date === selectedDate
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
          <div className="flex items-center space-x-4">
            <Label htmlFor="date">Date:</Label>
            <Input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        {/* Medium Selection */}
        {!selectedMedium && (
          <Card>
            <CardHeader>
              <CardTitle>Select Medium</CardTitle>
              <CardDescription>Choose the medium to view classes and manage attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleMediumSelect("Marathi")}
                  variant="outline"
                  className="h-20 text-lg"
                >
                  मराठी माध्यम
                  <br />
                  (Marathi Medium)
                </Button>
                <Button
                  onClick={() => handleMediumSelect("Semi English")}
                  variant="outline"
                  className="h-20 text-lg"
                >
                  अर्ध इंग्रजी माध्यम
                  <br />
                  (Semi English Medium)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Class Selection */}
        {selectedMedium && !selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle>
                Select Class - {selectedMedium === "Marathi" ? "मराठी माध्यम" : "अर्ध इंग्रजी माध्यम"}
              </CardTitle>
              <CardDescription>Choose a class to manage student attendance</CardDescription>
              <Button
                onClick={() => setSelectedMedium("")}
                variant="outline"
                size="sm"
                className="w-fit"
              >
                ← Back to Medium Selection
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {classesByMedium[selectedMedium as keyof typeof classesByMedium]?.map((className) => (
                  <Button
                    key={className}
                    onClick={() => handleClassSelect(className)}
                    variant="outline"
                    className="h-16 text-lg"
                  >
                    Class {className}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Attendance */}
        {selectedClass && students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Student Attendance - Class {selectedClass} ({selectedMedium} Medium)
              </CardTitle>
              <CardDescription>
                Mark attendance for {selectedDate}
              </CardDescription>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setSelectedClass("")}
                  variant="outline"
                  size="sm"
                >
                  ← Back to Classes
                </Button>
                <Button
                  onClick={saveAttendance}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  {isLoading ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => {
                  const record = getCurrentAttendanceRecord(student.id);
                  return (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record?.status || "present")}
                          <span className="text-sm font-medium capitalize">
                            {record?.status || "present"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <Button
                          onClick={() => updateAttendanceStatus(student.id, "present")}
                          variant={record?.status === "present" ? "default" : "outline"}
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          onClick={() => updateAttendanceStatus(student.id, "absent")}
                          variant={record?.status === "absent" ? "destructive" : "outline"}
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button
                          onClick={() => updateAttendanceStatus(student.id, "leave")}
                          variant={record?.status === "leave" ? "secondary" : "outline"}
                          size="sm"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Leave
                        </Button>
                      </div>

                      {(record?.status === "absent" || record?.status === "leave") && (
                        <div>
                          <Label htmlFor={`comment-${student.id}`} className="text-sm">
                            Comment {record?.status === "absent" ? "(Why absent?)" : "(Leave reason)"}
                          </Label>
                          <Textarea
                            id={`comment-${student.id}`}
                            placeholder={`Enter ${record?.status === "absent" ? "reason for absence" : "leave reason"}...`}
                            value={record?.comment || ""}
                            onChange={(e) => updateAttendanceComment(student.id, e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show empty state if no students */}
        {selectedClass && students.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No students found for Class {selectedClass} ({selectedMedium} Medium)</p>
              <Button
                onClick={() => setSelectedClass("")}
                variant="outline"
                className="mt-4"
              >
                ← Back to Classes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;
