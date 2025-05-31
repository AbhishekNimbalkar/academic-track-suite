
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/services/mockData";
import { 
  Users, BookOpen, CalendarDays, 
  CheckCircle, XCircle, Clock, GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TeacherDashboard: React.FC = () => {
  // For now, we'll show general data. In a real app, this would be filtered by teacher's assigned classes
  const students = dataService.getStudents();
  const attendance = dataService.getAttendance();
  const marks = dataService.getMarks();

  // Calculate stats for assigned classes (mock data for now)
  const assignedClasses = ["10", "11"]; // This would come from teacher's profile
  const assignedStudents = students.filter(s => assignedClasses.includes(s.class));
  
  // Today's attendance for assigned classes
  const todayDate = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(a => 
    a.date === todayDate && 
    assignedStudents.some(s => s.id === a.studentId)
  );
  
  const present = todayAttendance.filter(a => a.status === "present").length;
  const absent = todayAttendance.filter(a => a.status === "absent").length;
  const late = todayAttendance.filter(a => a.status === "late").length;

  // Recent marks entered
  const recentMarks = marks
    .filter(mark => assignedStudents.some(s => s.id === mark.studentId))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              My Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {assignedClasses.length} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Present
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{present}</div>
            <p className="text-xs text-muted-foreground">
              Out of {todayAttendance.length} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Absent
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absent}</div>
            <p className="text-xs text-muted-foreground">
              {late} students late
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Classes
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Classes {assignedClasses.join(", ")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedClasses.map(classNum => {
                const classStudents = assignedStudents.filter(s => s.class === classNum);
                const classAttendance = todayAttendance.filter(a => 
                  classStudents.some(s => s.id === a.studentId)
                );
                const classPresent = classAttendance.filter(a => a.status === "present").length;
                const attendancePercentage = classStudents.length > 0 
                  ? Math.round((classPresent / classStudents.length) * 100) 
                  : 0;

                return (
                  <div key={classNum} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Class {classNum}</h4>
                      <p className="text-sm text-muted-foreground">
                        {classPresent} / {classStudents.length} present
                      </p>
                    </div>
                    <Badge variant={attendancePercentage >= 80 ? "default" : "destructive"}>
                      {attendancePercentage}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Marks Entered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMarks.map((mark) => (
                <div key={mark.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{mark.studentName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Class {mark.class} - {mark.subjects[0]?.subjectName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {mark.subjects[0]?.marksObtained}/{mark.subjects[0]?.totalMarks}
                    </div>
                    <Badge variant="secondary">
                      {mark.subjects[0]?.grade || "N/A"}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentMarks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No marks entered recently
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
