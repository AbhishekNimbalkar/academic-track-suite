
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const classes = [
  "UKG", "LKG", ...Array.from({length: 12}, (_, i) => i === 10 ? "11th (Arts Premilitary College)" : `${i + 1}th`)
];
const mediums = ["Marathi", "Semi-English"];

// Predefined subjects list
const subjectsList = ["English", "Mathematics", "Science", "Social Studies", "Marathi", "Hindi", "Physical Education"];

interface Exam {
  id: string;
  exam_name: string;
  class: string;
  medium: string;
  total_marks: number;
}

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
}

export const ManageMarks: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Step selectors
  const [classSelected, setClassSelected] = useState("");
  const [mediumSelected, setMediumSelected] = useState("Marathi");
  const [examSelected, setExamSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [examsList, setExamsList] = useState<Exam[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, number | "">>({});
  const [existingMarks, setExistingMarks] = useState<Record<string, number>>({});
  const [totalMarks, setTotalMarks] = useState<number | null>(100);
  const [saving, setSaving] = useState(false);

  // Fetch exams based on class and medium selection
  useEffect(() => {
    const fetchExams = async () => {
      if (classSelected && mediumSelected) {
        try {
          const { data, error } = await supabase
            .from('exams')
            .select('*')
            .eq('class', classSelected)
            .eq('medium', mediumSelected);

          if (error) {
            console.error('Error fetching exams:', error);
            return;
          }

          setExamsList(data || []);
        } catch (error) {
          console.error('Error fetching exams:', error);
        }
      } else {
        setExamsList([]);
        setExamSelected("");
      }
    };

    fetchExams();
  }, [classSelected, mediumSelected]);

  // Fetch students based on class selection
  useEffect(() => {
    const fetchStudents = async () => {
      if (classSelected) {
        try {
          const { data, error } = await supabase
            .from('students')
            .select('id, student_id, first_name, last_name')
            .eq('current_class', classSelected);

          if (error) {
            console.error('Error fetching students:', error);
            return;
          }

          setStudentsList(data || []);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      } else {
        setStudentsList([]);
      }
    };

    fetchStudents();
  }, [classSelected]);

  // Fetch existing marks when exam and subject are selected
  useEffect(() => {
    const fetchExistingMarks = async () => {
      if (examSelected && subjectSelected) {
        try {
          const { data, error } = await supabase
            .from('exam_marks')
            .select('student_id, marks_obtained')
            .eq('exam_id', examSelected)
            .eq('subject', subjectSelected);

          if (error) {
            console.error('Error fetching existing marks:', error);
            return;
          }

          const marksMap: Record<string, number> = {};
          const inputMarksMap: Record<string, number> = {};
          
          data?.forEach(mark => {
            marksMap[mark.student_id] = mark.marks_obtained;
            inputMarksMap[mark.student_id] = mark.marks_obtained;
          });

          setExistingMarks(marksMap);
          setMarks(inputMarksMap);
        } catch (error) {
          console.error('Error fetching existing marks:', error);
        }
      }
    };

    fetchExistingMarks();
  }, [examSelected, subjectSelected]);

  // Set total marks when exam is selected
  useEffect(() => {
    const selectedExam = examsList.find(exam => exam.id === examSelected);
    if (selectedExam) {
      setTotalMarks(selectedExam.total_marks);
    }
  }, [examSelected, examsList]);

  // Handle per student input
  const handleMarkChange = (studentId: string, val: string) => {
    let n = Number(val);
    if (val === "") setMarks((marks) => ({ ...marks, [studentId]: "" }));
    else if (!isNaN(n) && (totalMarks === null || n <= totalMarks)) {
      setMarks((marks) => ({ ...marks, [studentId]: n }));
    }
  };

  // Save individual mark
  const saveMark = async (studentId: string) => {
    if (!user || !examSelected || !subjectSelected) {
      toast({ title: "Error", description: "Please ensure all selections are made." });
      return;
    }

    const val = marks[studentId];
    if (typeof val !== "number" || val < 0 || (totalMarks && val > totalMarks)) {
      toast({ title: "Validation", description: "Enter a valid number!" });
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('exam_marks')
        .upsert([{
          exam_id: examSelected,
          student_id: studentId,
          subject: subjectSelected,
          marks_obtained: val,
          created_by: user.id
        }], {
          onConflict: 'exam_id,student_id,subject'
        });

      if (error) {
        console.error('Error saving mark:', error);
        toast({ title: "Error", description: "Failed to save mark. Please try again." });
        return;
      }

      // Update existing marks state
      setExistingMarks(prev => ({ ...prev, [studentId]: val }));
      toast({ title: "Success", description: "Mark saved successfully!" });
    } catch (error) {
      console.error('Error saving mark:', error);
      toast({ title: "Error", description: "Failed to save mark. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // Save all marks
  const saveAll = async () => {
    if (!user || !examSelected || !subjectSelected || studentsList.length === 0) {
      toast({ title: "Error", description: "Please ensure all selections are made." });
      return;
    }

    setSaving(true);
    
    try {
      const marksToSave = Object.entries(marks)
        .filter(([_, mark]) => typeof mark === "number" && mark >= 0 && (totalMarks === null || mark <= totalMarks))
        .map(([studentId, mark]) => ({
          exam_id: examSelected,
          student_id: studentId,
          subject: subjectSelected,
          marks_obtained: mark as number,
          created_by: user.id
        }));

      if (marksToSave.length === 0) {
        toast({ title: "Warning", description: "No valid marks to save." });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('exam_marks')
        .upsert(marksToSave, {
          onConflict: 'exam_id,student_id,subject'
        });

      if (error) {
        console.error('Error saving marks:', error);
        toast({ title: "Error", description: "Failed to save marks. Please try again." });
        return;
      }

      // Update existing marks state
      const newExistingMarks = { ...existingMarks };
      marksToSave.forEach(mark => {
        newExistingMarks[mark.student_id] = mark.marks_obtained;
      });
      setExistingMarks(newExistingMarks);

      toast({ title: "Success", description: "All marks updated successfully!" });
    } catch (error) {
      console.error('Error saving marks:', error);
      toast({ title: "Error", description: "Failed to save marks. Please try again." });
    } finally {
      setSaving(false);
    }
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
