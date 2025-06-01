
import React from "react";
import { Marks, Student } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProgressTrackerProps {
  student: Student;
  marks: Marks[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  student,
  marks,
}) => {
  const studentMarks = marks.filter(mark => mark.studentId === student.id);

  const calculateSubjectProgress = (subjectName: string) => {
    const subjectMarks = studentMarks
      .flatMap(mark => mark.subjects)
      .filter(subject => subject.subjectName === subjectName)
      .sort((a, b) => {
        const examOrder = { quarterly: 1, halfYearly: 2, midterm: 3, final: 4 };
        return examOrder[a.examType] - examOrder[b.examType];
      });

    if (subjectMarks.length < 2) return null;

    const latest = subjectMarks[subjectMarks.length - 1];
    const previous = subjectMarks[subjectMarks.length - 2];

    const latestPercentage = (latest.marksObtained / latest.totalMarks) * 100;
    const previousPercentage = (previous.marksObtained / previous.totalMarks) * 100;
    const improvement = latestPercentage - previousPercentage;

    return {
      subject: subjectName,
      current: latestPercentage,
      previous: previousPercentage,
      improvement,
      currentGrade: latest.grade,
      examType: latest.examType,
    };
  };

  const subjects = Array.from(
    new Set(studentMarks.flatMap(mark => mark.subjects.map(s => s.subjectName)))
  );

  const progressData = subjects
    .map(calculateSubjectProgress)
    .filter(Boolean);

  const overallAverage = progressData.length > 0
    ? progressData.reduce((sum, data) => sum + data!.current, 0) / progressData.length
    : 0;

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 2) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (improvement < -2) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 2) return "text-green-600";
    if (improvement < -2) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Average</span>
              <span className="text-2xl font-bold">
                {overallAverage.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallAverage} className="h-2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grade</p>
                <Badge variant="secondary" className="text-lg">
                  {overallAverage >= 90 ? "A+" :
                   overallAverage >= 80 ? "A" :
                   overallAverage >= 70 ? "B+" :
                   overallAverage >= 60 ? "B" : "C"}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-lg font-semibold">{subjects.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.map((data) => (
              <div key={data!.subject} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{data!.subject}</h4>
                  <div className="flex items-center space-x-2">
                    {getImprovementIcon(data!.improvement)}
                    <span className={`text-sm font-medium ${getImprovementColor(data!.improvement)}`}>
                      {data!.improvement > 0 ? '+' : ''}{data!.improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Performance</span>
                    <span className="font-medium">{data!.current.toFixed(1)}%</span>
                  </div>
                  <Progress value={data!.current} className="h-1" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Previous: {data!.previous.toFixed(1)}%</span>
                    <Badge variant="outline" className="text-xs">
                      {data!.currentGrade}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {progressData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No progress data available</p>
                <p className="text-sm">At least 2 exam records are needed to track progress</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
