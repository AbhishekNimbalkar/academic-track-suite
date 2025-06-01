
import React from "react";
import { Marks } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, Award, TrendingUp } from "lucide-react";

interface PerformanceAnalyticsProps {
  marks: Marks[];
  className?: string;
  section?: string;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  marks,
  className,
  section,
}) => {
  const filteredMarks = marks.filter(mark => 
    (!className || mark.class === className) &&
    (!section || mark.section === section)
  );

  const subjects = Array.from(
    new Set(filteredMarks.flatMap(mark => mark.subjects.map(s => s.subjectName)))
  );

  const calculateSubjectStats = (subjectName: string) => {
    const subjectMarks = filteredMarks
      .flatMap(mark => mark.subjects)
      .filter(subject => subject.subjectName === subjectName);

    if (subjectMarks.length === 0) return null;

    const percentages = subjectMarks.map(s => (s.marksObtained / s.totalMarks) * 100);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    
    const gradeDistribution = subjectMarks.reduce((acc, s) => {
      const grade = s.grade || 'N/A';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const passCount = percentages.filter(p => p >= 35).length;
    const passRate = (passCount / percentages.length) * 100;

    return {
      subject: subjectName,
      average,
      highest,
      lowest,
      totalStudents: subjectMarks.length,
      passRate,
      gradeDistribution,
    };
  };

  const subjectStats = subjects
    .map(calculateSubjectStats)
    .filter(Boolean)
    .sort((a, b) => b!.average - a!.average);

  const overallStats = {
    totalStudents: filteredMarks.length,
    averageScore: subjectStats.length > 0 
      ? subjectStats.reduce((sum, stat) => sum + stat!.average, 0) / subjectStats.length
      : 0,
    topPerformers: filteredMarks
      .map(mark => {
        const totalMarks = mark.subjects.reduce((sum, s) => sum + s.totalMarks, 0);
        const obtainedMarks = mark.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
        const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
        return { ...mark, percentage };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3),
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": case "A": return "bg-green-100 text-green-800";
      case "B+": case "B": return "bg-blue-100 text-blue-800";
      case "C+": case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {className ? `Class ${className}` : 'All Classes'}
              {section ? ` Section ${section}` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.averageScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overallStats.topPerformers[0] ? (
              <>
                <div className="text-sm font-bold truncate">
                  {overallStats.topPerformers[0].studentName}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overallStats.topPerformers[0].percentage.toFixed(1)}% average
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectStats.map((stat) => (
              <div key={stat!.subject} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{stat!.subject}</h4>
                  <Badge variant="secondary">
                    {stat!.average.toFixed(1)}% avg
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="font-semibold">{stat!.totalStudents}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                    <p className="font-semibold">{stat!.passRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Highest</p>
                    <p className="font-semibold">{stat!.highest.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Lowest</p>
                    <p className="font-semibold">{stat!.lowest.toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Grade Distribution</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stat!.gradeDistribution).map(([grade, count]) => (
                      <Badge
                        key={grade}
                        variant="secondary"
                        className={`text-xs ${getGradeColor(grade)}`}
                      >
                        {grade}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {subjectStats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-2" />
                <p>No performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
