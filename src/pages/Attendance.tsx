
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Student, Attendance } from "@/types/models";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  CalendarDays, 
  Check, 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const [students, setStudents] = useState<Student[]>(dataService.getStudents());
  const [attendanceData, setAttendanceData] = useState<Attendance[]>(dataService.getAttendance());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isAttendanceListOpen, setIsAttendanceListOpen] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState<{
    class: string;
    section: string;
  } | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [initialAttendance, setInitialAttendance] = useState<Attendance[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClassSection) {
      fetchAttendanceForDate();
    }
  }, [selectedDate, selectedClassSection]);

  const classSections = Array.from(
    new Set(
      students.map((student) => `${student.class}-${student.section}`)
    )
  ).sort();

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClassSection = (classSection: string) => {
    const [className, sectionName] = classSection.split("-");
    setSelectedClassSection({
      class: className,
      section: sectionName,
    });
    fetchAttendanceForDate();
  };

  const fetchAttendanceForDate = () => {
    if (!selectedClassSection) return;

    const { class: className, section } = selectedClassSection;
    const studentsInClass = students.filter(
      (s) => s.class === className && s.section === section
    );

    // Get existing attendance records for the selected date
    const existingAttendance = attendanceData.filter(
      (a) => a.date === selectedDate &&
      studentsInClass.some((s) => s.id === a.studentId)
    );

    // Create attendance records for students who don't have one
    const newAttendance: Attendance[] = [];
    
    studentsInClass.forEach((student) => {
      const hasRecord = existingAttendance.some(
        (a) => a.studentId === student.id
      );
      
      if (!hasRecord) {
        newAttendance.push({
          id: Math.random().toString(36).substring(2, 10),
          studentId: student.id,
          studentName: student.fullName,
          date: selectedDate,
          status: "present", // Default status
          remarks: "",
        });
      }
    });

    const combinedAttendance = [...existingAttendance, ...newAttendance];
    setTodayAttendance(combinedAttendance);
    setInitialAttendance([...combinedAttendance]); // Keep a copy for comparison
    setIsAttendanceListOpen(true);
  };

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setTodayAttendance(
      todayAttendance.map((record) => {
        if (record.studentId === studentId) {
          return { ...record, status };
        }
        return record;
      })
    );
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setTodayAttendance(
      todayAttendance.map((record) => {
        if (record.studentId === studentId) {
          return { ...record, remarks };
        }
        return record;
      })
    );
  };

  const handleSaveAttendance = () => {
    // Add new/update existing attendance records
    const updatedAttendanceData = [...attendanceData];
    
    todayAttendance.forEach((record) => {
      const existingIndex = updatedAttendanceData.findIndex(
        (a) => a.studentId === record.studentId && a.date === record.date
      );
      
      if (existingIndex !== -1) {
        updatedAttendanceData[existingIndex] = record;
      } else {
        updatedAttendanceData.push(record);
      }
    });
    
    setAttendanceData(updatedAttendanceData);
    setIsAttendanceListOpen(false);
    
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${
        selectedClassSection?.class
      }-${
        selectedClassSection?.section
      } on ${
        new Date(selectedDate).toLocaleDateString()
      } has been saved.`,
    });
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const studentAttendance = attendanceData.filter(
      (a) => a.studentId === studentId
    );
    
    const total = studentAttendance.length;
    const present = studentAttendance.filter((a) => a.status === "present").length;
    const absent = studentAttendance.filter((a) => a.status === "absent").length;
    const late = studentAttendance.filter((a) => a.status === "late").length;
    
    const presentPercentage = total > 0 ? (present / total) * 100 : 0;
    
    return {
      total,
      present,
      absent,
      late,
      presentPercentage: presentPercentage.toFixed(2),
    };
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription>
              Take and view attendance for different classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Select Class and Section</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classSections.map((classSection) => (
                <Button
                  key={classSection}
                  variant={
                    selectedClassSection &&
                    `${selectedClassSection.class}-${selectedClassSection.section}` === classSection
                      ? "default"
                      : "outline"
                  }
                  className="justify-center"
                  onClick={() => handleSelectClassSection(classSection)}
                >
                  Class {classSection}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedClassSection && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Students in Class {selectedClassSection.class}-{selectedClassSection.section}
                  </CardTitle>
                  <CardDescription>
                    View attendance history or take attendance for today
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeDate(-1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeDate(1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={fetchAttendanceForDate}>
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {isTeacher ? "Take Attendance" : "View Attendance"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative flex-1 mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Present %</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter(
                        (student) =>
                          student.class === selectedClassSection.class &&
                          student.section === selectedClassSection.section
                      )
                      .map((student) => {
                        const stats = getStudentAttendanceStats(student.id);
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell className="font-medium">
                              {student.fullName}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center items-center">
                                <div 
                                  className="w-12 h-12 rounded-full flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: `rgba(${
                                      parseFloat(stats.presentPercentage) > 80 
                                        ? '74, 222, 128' 
                                        : parseFloat(stats.presentPercentage) > 60 
                                        ? '250, 204, 21' 
                                        : '248, 113, 113'
                                    }, 0.2)`,
                                    color: `rgb(${
                                      parseFloat(stats.presentPercentage) > 80 
                                        ? '22, 163, 74' 
                                        : parseFloat(stats.presentPercentage) > 60 
                                        ? '202, 138, 4' 
                                        : '220, 38, 38'
                                    })`,
                                  }}
                                >
                                  {stats.presentPercentage}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {stats.present}
                            </TableCell>
                            <TableCell className="text-center">
                              {stats.absent}
                            </TableCell>
                            <TableCell className="text-center">
                              {stats.late}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Filter attendance records for this student
                                  const studentRecords = attendanceData.filter(
                                    a => a.studentId === student.id
                                  );
                                  
                                  // TODO: Show detailed attendance history dialog
                                  console.log("Student attendance records:", studentRecords);
                                }}
                              >
                                <CalendarDays className="h-4 w-4 mr-1" />
                                History
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance List Dialog */}
      <Dialog open={isAttendanceListOpen} onOpenChange={setIsAttendanceListOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Attendance for Class {selectedClassSection?.class}-{selectedClassSection?.section}
            </DialogTitle>
            <DialogDescription>
              Date: {new Date(selectedDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">
                        {record.studentName}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant={record.status === "present" ? "default" : "outline"}
                            size="sm"
                            onClick={() => isTeacher && handleStatusChange(record.studentId, "present")}
                            disabled={!isTeacher}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            variant={record.status === "absent" ? "default" : "outline"}
                            size="sm"
                            onClick={() => isTeacher && handleStatusChange(record.studentId, "absent")}
                            disabled={!isTeacher}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                          <Button
                            variant={record.status === "late" ? "default" : "outline"}
                            size="sm"
                            onClick={() => isTeacher && handleStatusChange(record.studentId, "late")}
                            disabled={!isTeacher}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={record.remarks || ""}
                          onChange={(e) => isTeacher && handleRemarksChange(record.studentId, e.target.value)}
                          placeholder="Add remarks"
                          disabled={!isTeacher}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAttendanceListOpen(false)}
            >
              Cancel
            </Button>
            {isTeacher && (
              <Button onClick={handleSaveAttendance}>
                <Save className="h-4 w-4 mr-1" />
                Save Attendance
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Attendance;
