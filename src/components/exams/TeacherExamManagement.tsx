
import React from "react";
import { ManageMarks } from "./ManageMarks";

export const TeacherExamManagement: React.FC = () => (
  <div className="w-full">
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Manage Marks</h2>
      <p className="text-muted-foreground">Enter and update student marks for exams</p>
    </div>
    <ManageMarks />
  </div>
);
