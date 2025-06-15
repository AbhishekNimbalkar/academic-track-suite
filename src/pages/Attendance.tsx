
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, Clock, UserX, History, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceRecord {
  id?: string;
  studentId: string;
  studentName: string;
  class: string;
  medium: string;
  date: string;
  status: "present" | "absent" | "leave";
  comment?: string;
}

interface AttendanceHistoryRecord {
  id: string;
  student_id: string;
  student_name: string;
  class: string;
  medium: string;
  date: string;
  status: "present" | "absent" | "leave";
  comment?: string;
  created_at: string;
}

const Attendance: React.FC = () => {
  const { userRole, user } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();

  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<string>("");

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

  // Fetch existing attendance records from database
  const fetchAttendanceRecords = async (date: string, className: string, medium: string) => {
    try {
      const { data, error } = await supabase
        .from('students_attendance')
        .select('*')
        .eq('date', date)
        .eq('class', className)
        .eq('medium', medium);

      if (error) throw error;

      const records: AttendanceRecord[] = data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        studentName: record.student_name,
        class: record.class,
        medium: record.medium,
        date: record.date,
        status: record.status as "present" | "absent" | "leave",
        comment: record.comment || ""
      }));

      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  // Fetch attendance history for a specific student
  const fetchStudentAttendanceHistory = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students_attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (error) throw error;

      setAttendanceHistory(data || []);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMediumSelect = (medium: string) => {
    setSelectedMedium(medium);
    setSelectedClass("");
    setStudents([]);
    setAttendanceRecords([]);
  };

  const handleClassSelect = async (className: string) => {
    setSelectedClass(className);
    // Filter students by class and medium
    const filteredStudents = mockStudents.filter(
      student => student.class === className && student.medium === selectedMedium
    );
    setStudents(filteredStudents);
    
    // Fetch existing attendance records for the selected date/class
    await fetchAttendanceRecords(selectedDate, className, selectedMedium);
    
    // Initialize attendance records for students without existing records
    const existingStudentIds = attendanceRecords.map(record => record.studentId);
    const newRecords = filteredStudents
      .filter(student => !existingStudentIds.includes(student.id))
      .map(student => ({
        studentId: student.id,
        studentName: student.name,
        class: className,
        medium: selectedMedium,
        date: selectedDate,
        status: "present" as const,
        comment: ""
      }));
    
    if (newRecords.length > 0) {
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
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const attendanceData = attendanceRecords.map(record => ({
        student_id: record.studentId,
        student_name: record.studentName,
        class: record.class,
        medium: record.medium,
        date: record.date,
        status: record.status,
        comment: record.comment || null,
        created_by: user.id
      }));

      const { error } = await supabase
        .from('students_attendance')
        .upsert(attendanceData, {
          onConflict: 'student_id,date'
        });

      if (error) throw error;
      
      toast({
        title: "Attendance Saved",
        description: `Attendance for ${selectedClass} class (${selectedMedium} Medium) has been saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
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

  const getAttendanceStats = (history: AttendanceHistoryRecord[]) => {
    const total = history.length;
    const present = history.filter(h => h.status === 'present').length;
    const absent = history.filter(h => h.status === 'absent').length;
    const leave = history.filter(h => h.status === 'leave').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';
    
    return { total, present, absent, leave, percentage };
  };

  // Update attendance records when date changes
  useEffect(() => {
    if (selectedClass && selectedMedium) {
      handleClassSelect(selectedClass);
    }
  }, [selectedDate]);

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
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record?.status || "present")}
                            <span className="text-sm font-medium capitalize">
                              {record?.status || "present"}
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudentHistory(student.id);
                                  fetchStudentAttendanceHistory(student.id);
                                }}
                              >
                                <History className="h-4 w-4 mr-1" />
                                History
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Attendance History - {student.name}</DialogTitle>
                                <DialogDescription>
                                  Complete attendance record for this student
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {attendanceHistory.length > 0 && (
                                  <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">
                                        {getAttendanceStats(attendanceHistory).present}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Present</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-red-600">
                                        {getAttendanceStats(attendanceHistory).absent}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Absent</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-yellow-600">
                                        {getAttendanceStats(attendanceHistory).leave}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Leave</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {getAttendanceStats(attendanceHistory).percentage}%
                                      </div>
                                      <div className="text-sm text-muted-foreground">Attendance</div>
                                    </div>
                                  </div>
                                )}
                                <div className="max-h-80 overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Comment</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {attendanceHistory.map((historyRecord) => (
                                        <TableRow key={historyRecord.id}>
                                          <TableCell>
                                            {new Date(historyRecord.date).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center space-x-2">
                                              {getStatusIcon(historyRecord.status)}
                                              <Badge
                                                variant={
                                                  historyRecord.status === 'present' ? 'default' :
                                                  historyRecord.status === 'absent' ? 'destructive' : 'secondary'
                                                }
                                              >
                                                {historyRecord.status}
                                              </Badge>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            {historyRecord.comment || '-'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  {attendanceHistory.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                      No attendance history found for this student.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
