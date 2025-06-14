
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student } from "./types";

interface StudentsTabContentProps {
  students: Student[];
  searchQuery: string;
  selectedClass?: string; // Passed from parent for precise filtering
}

export const StudentsTabContent: React.FC<StudentsTabContentProps> = ({
  students,
  searchQuery,
  selectedClass = "all"
}) => {
  // List of allowed class keys
  const getClassOptions = () => [
    "1","2","3","4","5","6","7","8","9","10",
    "11-APC","11-USA","12-APC","12-USA"
  ];

  // Group students into these new buckets
  const getStudentsByClass = () => {
    const studentsByClass: { [key: string]: Student[] } = {};
    // Fill with empty arrays
    getClassOptions().forEach(cls => { studentsByClass[cls] = []; });
    students.forEach(student => {
      const cls = student.current_class;
      const stream = student.stream || "";
      // 1-10
      if (["1","2","3","4","5","6","7","8","9","10"].includes(cls)) {
        studentsByClass[cls].push(student);
      }
      // 11th APC/USA
      if (cls === "11" && (stream === "APC" || stream === "USA")) {
        studentsByClass[`11-${stream}`].push(student);
      }
      // 12th APC/USA
      if (cls === "12" && (stream === "APC" || stream === "USA")) {
        studentsByClass[`12-${stream}`].push(student);
      }
    });
    return studentsByClass;
  };

  const studentsByClass = getStudentsByClass();

  // Helper to generate readable name for class/stream
  function labelForClass(cls: string) {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    if (cls.startsWith("11-")) return `Class 11 (${cls.endsWith("APC") ? "APC" : "USA"})`;
    if (cls.startsWith("12-")) return `Class 12 (${cls.endsWith("APC") ? "APC" : "USA"})`;
    return "";
  }

  // If filtering for a specific selectedClass, only show that card
  const showClasses = selectedClass && selectedClass !== "all" ? [selectedClass] : getClassOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {showClasses.map(classNum => (
        <Card key={classNum}>
          <CardHeader>
            <CardTitle className="text-lg">{labelForClass(classNum)}</CardTitle>
            <CardDescription>
              {studentsByClass[classNum]?.length || 0} residential students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {studentsByClass[classNum]?.length > 0 ? (
                studentsByClass[classNum]
                  .filter(student => 
                    ((student.first_name + ' ' + student.last_name)
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                    )
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
