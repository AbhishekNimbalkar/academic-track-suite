
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

export const ManageMarks: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  // Step selectors
  const [classSelected, setClassSelected] = useState("");
  const [mediumSelected, setMediumSelected] = useState("Marathi");
  const [examSelected, setExamSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [examsList, setExamsList] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, number | "">>({});
  const [totalMarks, setTotalMarks] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Step 1: Fetch exams for selected class/medium
  useEffect(() => {
    if (classSelected && mediumSelected) {
      const fetchExams = async () => {
        const { data, error } = await supabase
          .from("exams")
          .select("*")
          .eq("class", classSelected)
          .eq("medium", mediumSelected);
        if (!error && data) setExamsList(data);
      };
      fetchExams();
    } else {
      setExamsList([]);
      setExamSelected("");
    }
  }, [classSelected, mediumSelected]);

  // Step 2: After exam is selected, fetch subjects & students
  useEffect(() => {
    const fetchSubjects = async () => {
      // You may want to adjust how subjects are fetched/stored per class
      if (examSelected) {
        // Example: hardcoded subject lists
        // Optionally, fetch from backend if available!
        setSubjectsList([
          "English", "Mathematics", "Science", "Social Studies", "Marathi"
          // ...change based on class if needed
        ]);
      } else {
        setSubjectsList([]);
      }
    };
    fetchSubjects();
  }, [examSelected]);

  useEffect(() => {
    if (classSelected && subjectSelected) {
      // Fetch students for selected class
      const fetchStudents = async () => {
        const { data, error } = await supabase
          .from("students")
          .select("id, student_id, first_name, last_name")
          .eq("current_class", classSelected);
        if (!error && data) setStudentsList(data);
      };
      fetchStudents();
    } else {
      setStudentsList([]);
    }
  }, [classSelected, subjectSelected]);

  // Step 3: After all selections, fetch total marks for validation
  useEffect(() => {
    if (examSelected && examsList.length) {
      const exam = examsList.find(ex => ex.id === examSelected);
      setTotalMarks(exam ? exam.total_marks : null);
    } else {
      setTotalMarks(null);
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

  // Save individual
  const saveMark = async (studentId: string) => {
    if (!user || !subjectSelected || !examSelected) return;
    const val = marks[studentId];
    if (typeof val !== "number" || val < 0 || (totalMarks && val > totalMarks)) {
      toast({ title: "Validation", description: "Enter a valid number!" });
      return;
    }
    setSaving(true);
    // Use marks table (Insert or Update)
    const { error } = await supabase
      .from("marks")
      .upsert({
        student_id: studentId,
        marks: val,
        total_marks: totalMarks || 0,
        exam_type: examSelected,
        subject: subjectSelected,
        created_by: user.id,
        academic_year: (new Date()).getFullYear().toString(), // adjust per your schema
      }, { onConflict: ["student_id", "exam_type", "subject"] });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message });
    } else {
      toast({ title: "Saved", description: `Mark saved for student.` });
    }
  };

  // Save all
  const saveAll = async () => {
    if (!user || studentsList.length === 0) return;
    setSaving(true);
    for (const student of studentsList) {
      const val = marks[student.id];
      if (typeof val !== "number" || val < 0 || (totalMarks && val > totalMarks)) continue;
      await supabase
        .from("marks")
        .upsert({
          student_id: student.id,
          marks: val,
          total_marks: totalMarks || 0,
          exam_type: examSelected,
          subject: subjectSelected,
          created_by: user.id,
          academic_year: (new Date()).getFullYear().toString(),
        }, { onConflict: ["student_id", "exam_type", "subject"] });
    }
    setSaving(false);
    toast({ title: "Success", description: "Marks updated for all students." });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <select value={classSelected} onChange={(e) => setClassSelected(e.target.value)} className="border rounded px-3 py-2 min-w-[120px]">
          <option value="">Class</option>
          {classes.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <select value={mediumSelected} onChange={(e) => setMediumSelected(e.target.value)} className="border rounded px-3 py-2 min-w-[120px]">
          {mediums.map((m) => (<option key={m} value={m}>{m}</option>))}
        </select>
        <select value={examSelected} onChange={(e) => setExamSelected(e.target.value)} className="border rounded px-3 py-2 min-w-[180px]">
          <option value="">Exam</option>
          {examsList.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.exam_name}</option>
          ))}
        </select>
        <select value={subjectSelected} onChange={(e) => setSubjectSelected(e.target.value)} className="border rounded px-3 py-2 min-w-[180px]">
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
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Marks Obtained</th>
                <th className="px-2 py-1 border"></th>
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
            <Button onClick={saveAll} disabled={saving}>Update Marks</Button>
          </div>
        </div>
      )}
    </div>
  );
};
