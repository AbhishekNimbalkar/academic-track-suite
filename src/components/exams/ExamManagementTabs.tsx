
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddExamForm } from "./AddExamForm";
import { ManageMarks } from "./ManageMarks";

export const ExamManagementTabs: React.FC = () => (
  <Tabs defaultValue="add-exam" className="w-full">
    <TabsList>
      <TabsTrigger value="add-exam">Add Exam</TabsTrigger>
      <TabsTrigger value="manage-marks">Manage Marks</TabsTrigger>
    </TabsList>
    <TabsContent value="add-exam">
      <AddExamForm />
    </TabsContent>
    <TabsContent value="manage-marks">
      <ManageMarks />
    </TabsContent>
  </Tabs>
);
