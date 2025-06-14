
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const classes = [
  "UKG", "LKG", ...Array.from({length: 12}, (_, i) => i === 10 ? "11th (Arts Premilitary College)" : `${i + 1}th`)
];
const mediums = ["Marathi", "Semi-English"];

// Mock data for UI demonstration
const mockExams = [
  { id: "1", exam_name: "FA1", class: "1st", medium: "Marathi" },
  { id: "2", exam_name: "SA1", class: "1st", medium: "Marathi" },
  { id: "3", exam_name: "Unit Test", class: "2nd", medium: "Semi-English" },
];

const mockSubjects = ["English", "Mathematics", "Science", "Social Studies", "Marathi"];

const mockStudents = [
  { id: "1", student_id: "STU001", first_name: "Rahul", last_name: "Sharma" },
  { id: "2", student_id: "STU002", first_name: "Priya", last_name: "Patel" },
  { id: "3", student_id: "STU003", first_name: "Amit", last_name: "Kumar" },
];

export const ManageMarks: React.FC = () => {
  const { toast } = useToast();
  
  // Step selectors
  const [classSelected, setClassSelected] = useState("");
  const [mediumSelected, setMediumSelected] = useState("Marathi");
  const [examSelected, setExamSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [examsList, setExamsList] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, number | "">>({});
  const [totalMarks, setTotalMarks] = useState<number | null>(100);
  const [saving, setSaving] = useState(false);

  // Mock data filtering based on selections
  useEffect(() => {
    if (classSelected && mediumSelected) {
      const filteredExams = mockExams.filter(
        exam => exam.class === classSelected && exam.medium === mediumSelected
      );
      setExamsList(filteredExams);
    } else {
      setExamsList([]);
      setExamSelected("");
    }
  }, [classSelected, mediumSelected]);

  useEffect(() => {
    if (examSelected) {
      setSubjectsList(mockSubjects);
    } else {
      setSubjectsList([]);
    }
  }, [examSelected]);

  useEffect(() => {
    if (classSelected && subjectSelected) {
      setStudentsList(mockStudents);
    } else {
      setStudentsList([]);
    }
  }, [classSelected, subjectSelected]);

  // Handle per student input
  const handleMarkChange = (studentId: string, val: string) => {
    let n = Number(val);
    if (val === "") setMarks((marks) => ({ ...marks, [studentId]: "" }));
    else if (!isNaN(n) && (totalMarks === null || n <= totalMarks)) {
      setMarks((marks) => ({ ...marks, [studentId]: n }));
    }
  };

  // Save individual (UI only)
  const saveMark = async (studentId: string) => {
    const val = marks[studentId];
    if (typeof val !== "number" || val < 0 || (totalMarks && val > totalMarks)) {
      toast({ title: "Validation", description: "Enter a valid number!" });
      return;
    }
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Saved", description: `Mark saved for student.` });
    }, 500);
  };

  // Save all (UI only)
  const saveAll = async () => {
    if (studentsList.length === 0) return;
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Success", description: "Marks updated for all students." });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <select 
          value={classSelected} 
          onChange={(e) => setClassSelected(e.target.value)} 
          className="border rounded px-3 py-2 min-w-[120px]"
        >
          <option value="">Class</option>
          {classes.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        
        <select 
          value={mediumSelected} 
          onChange={(e) => setMediumSelected(e.target.value)} 
          className="border rounded px-3 py-2 min-w-[120px]"
        >
          {mediums.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
        
        <select 
          value={examSelected} 
          onChange={(e) => setExamSelected(e.target.value)} 
          className="border rounded px-3 py-2 min-w-[180px]"
        >
          <option value="">Exam</option>
          {examsList.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.exam_name}</option>
          ))}
        </select>
        
        <select 
          value={subjectSelected} 
          onChange={(e) => setSubjectSelected(e.target.value)} 
          className="border rounded px-3 py-2 min-w-[180px]"
        >
          <option value="">Subject</option>
          {subjectsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {studentsList.length > 0 && subjectSelected && examSelected && (
        <div>
          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 border">Student ID</th>
                <th className="px-2 py-1 border">Student Name</th>
                <th className="px-2 py-1 border">Marks Obtained</th>
                <th className="px-2 py-1 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student) => (
                <tr key={student.id}>
                  <td className="border px-2 py-1">{student.student_id}</td>
                  <td className="border px-2 py-1">{student.first_name} {student.last_name}</td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      value={marks[student.id] ?? ""}
                      min={0}
                      max={totalMarks ?? 100}
                      onChange={(e) => handleMarkChange(student.id, e.target.value)}
                      className="w-24"
                      placeholder="0"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => saveMark(student.id)}
                      disabled={saving}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button onClick={saveAll} disabled={saving}>
              🔄 Update Marks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
