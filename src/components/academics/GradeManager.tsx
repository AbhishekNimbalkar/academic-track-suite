
import React, { useState } from "react";
import { Marks } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GradeManagerProps {
  students: Array<{ id: string; fullName: string; class: string; section: string }>;
  onAddMarks: (marks: Omit<Marks, "id">) => void;
}

export const GradeManager: React.FC<GradeManagerProps> = ({
  students,
  onAddMarks,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [examData, setExamData] = useState({
    examType: "midterm" as "midterm" | "final" | "quarterly" | "halfYearly",
    subject: "",
    totalMarks: 100,
    academicYear: "2023-2024",
    class: "",
    section: "",
  });
  const [studentMarks, setStudentMarks] = useState<Record<string, number>>({});

  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Hindi",
    "Computer Science",
    "Physical Education",
    "Art & Craft",
  ];

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];

  const filteredStudents = students.filter(student =>
    (!examData.class || student.class === examData.class) &&
    (!examData.section || student.section === examData.section)
  );

  const calculateGrade = (obtained: number, total: number): string => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    if (percentage >= 33) return "D";
    return "F";
  };

  const handleSubmit = () => {
    if (!examData.subject || !examData.class || !examData.section) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    filteredStudents.forEach(student => {
      const marksObtained = studentMarks[student.id] || 0;
      const grade = calculateGrade(marksObtained, examData.totalMarks);

      const marksRecord: Omit<Marks, "id"> = {
        studentId: student.id,
        studentName: student.fullName,
        class: student.class,
        section: student.section,
        academicYear: examData.academicYear,
        subjects: [{
          subjectName: examData.subject,
          marksObtained,
          totalMarks: examData.totalMarks,
          grade,
          examType: examData.examType,
        }],
      };

      onAddMarks(marksRecord);
    });

    toast({
      title: "Marks Added Successfully",
      description: `Added marks for ${filteredStudents.length} students in ${examData.subject}.`,
    });

    // Reset form
    setStudentMarks({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Marks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Student Marks</DialogTitle>
          <DialogDescription>
            Enter marks for students in a specific subject and exam
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select
                value={examData.examType}
                onValueChange={(value: any) =>
                  setExamData(prev => ({ ...prev, examType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="halfYearly">Half Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={examData.subject}
                onValueChange={(value) =>
                  setExamData(prev => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={examData.class}
                onValueChange={(value) =>
                  setExamData(prev => ({ ...prev, class: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={examData.section}
                onValueChange={(value) =>
                  setExamData(prev => ({ ...prev, section: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                type="number"
                value={examData.totalMarks}
                onChange={(e) =>
                  setExamData(prev => ({ ...prev, totalMarks: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                value={examData.academicYear}
                onChange={(e) =>
                  setExamData(prev => ({ ...prev, academicYear: e.target.value }))
                }
              />
            </div>
          </div>

          {filteredStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Student Marks ({filteredStudents.length} students)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          Class {student.class} - Section {student.section}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Marks"
                          className="w-20"
                          min="0"
                          max={examData.totalMarks}
                          value={studentMarks[student.id] || ""}
                          onChange={(e) =>
                            setStudentMarks(prev => ({
                              ...prev,
                              [student.id]: Number(e.target.value)
                            }))
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          / {examData.totalMarks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={filteredStudents.length === 0}>
              Save Marks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
