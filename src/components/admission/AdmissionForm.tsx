
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentDetailsForm, StudentFormValues } from "./StudentDetailsForm";
import { ImageUploader } from "./ImageUploader";
import { Student } from "@/types/models";

interface AdmissionFormProps {
  onSubmit: (student: Omit<Student, "id">) => void;
  defaultValues?: Partial<Student>;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ 
  onSubmit,
  defaultValues
}) => {
  const [studentImage, setStudentImage] = useState<string | null>(defaultValues?.imageUrl || null);
  
  const handleFormSubmit = (data: StudentFormValues) => {
    // Combine form data with image
    const studentData: Omit<Student, "id"> = {
      fullName: data.fullName, // Ensure required fields are set
      dateOfBirth: data.dateOfBirth || new Date().toISOString().split("T")[0],
      class: data.class || "",
      section: data.section || "",
      admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
      parentName: data.parentName || "",
      parentEmail: data.parentEmail || "",
      parentPhone: data.parentPhone || "",
      address: data.address || "",
      medicalInfo: data.medicalInfo || "",
      imageUrl: studentImage || undefined,
      // Set admission class to the selected class if not already set
      admissionClass: data.class || ""
    };
    
    onSubmit(studentData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Admission Form</CardTitle>
        <CardDescription>
          Enter student details to complete the admission process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ImageUploader 
              onImageUpload={setStudentImage}
              existingImage={defaultValues?.imageUrl}
              maxSizeKB={100}
            />
          </div>
          <div className="md:col-span-3">
            <StudentDetailsForm 
              onSubmit={handleFormSubmit}
              defaultValues={defaultValues}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
