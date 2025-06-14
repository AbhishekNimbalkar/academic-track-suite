
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student } from "./types";

interface StudentsTabContentProps {
  students: Student[];
  searchQuery: string;
}

export const StudentsTabContent: React.FC<StudentsTabContentProps> = ({
  students,
  searchQuery,
}) => {
  const getClassOptions = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  };

  const getStudentsByClass = () => {
    const studentsByClass: { [key: string]: Student[] } = {};
    
    // Initialize all classes 1-12
    for (let i = 1; i <= 12; i++) {
      studentsByClass[i.toString()] = [];
    }
    
    // Group students by class
    students.forEach(student => {
      if (studentsByClass[student.current_class]) {
        studentsByClass[student.current_class].push(student);
      }
    });
    
    return studentsByClass;
  };

  const studentsByClass = getStudentsByClass();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {getClassOptions().map(classNum => (
        <Card key={classNum}>
          <CardHeader>
            <CardTitle className="text-lg">Class {classNum}</CardTitle>
            <CardDescription>
              {studentsByClass[classNum]?.length || 0} residential students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {studentsByClass[classNum]?.length > 0 ? (
                studentsByClass[classNum]
                  .filter(student => 
                    (student.first_name + ' ' + student.last_name)
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map(student => (
                    <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-muted-foreground">{student.student_id}</p>
                      </div>
                      <Badge variant="secondary">Residential</Badge>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No residential students in this class
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
