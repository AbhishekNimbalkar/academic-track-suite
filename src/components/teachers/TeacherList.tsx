
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserCheck } from "lucide-react";
import { Teacher, Class, TeacherClassAssignment } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeacherListProps {
  teachers: Teacher[];
  onDeleteTeacher: (teacher: Teacher) => void;
  onAssignClass: (teacher: Teacher) => void;
  assignments: TeacherClassAssignment[];
  classes: Class[];
}

export const TeacherList: React.FC<TeacherListProps> = ({ 
  teachers, 
  onDeleteTeacher, 
  onAssignClass,
  assignments,
  classes
}) => {
  const getTeacherAssignments = (teacherId: string) => {
    return assignments.filter(assignment => assignment.teacherId === teacherId);
  };

  const getClassInfo = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  return (
    <div className="space-y-4">
      {teachers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No teachers found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Assigned Classes</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => {
              const teacherAssignments = getTeacherAssignments(teacher.id);
              return (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.id}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacherAssignments.map((assignment) => {
                        const classInfo = getClassInfo(assignment.classId);
                        if (!classInfo) return null;
                        return (
                          <Badge key={assignment.id} variant="outline" className="text-xs">
                            {classInfo.className === "UKG" || classInfo.className === "LKG" 
                              ? classInfo.className 
                              : `Class ${classInfo.className}`} ({classInfo.medium})
                          </Badge>
                        );
                      })}
                      {teacherAssignments.length === 0 && (
                        <span className="text-muted-foreground text-sm">No classes assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.qualification}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAssignClass(teacher)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTeacher(teacher)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
