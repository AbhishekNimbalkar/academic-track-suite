
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
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      class: data.class,
      section: data.section,
      stream: data.stream,
      admissionDate: data.admissionDate,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      address: data.address,
      medicalInfo: data.medicalInfo || "",
      imageUrl: studentImage || undefined,
      admissionClass: data.class,
      caste: data.caste,
      residentialType: data.residentialType,
      aadhaarNumber: data.aadhaarNumber,
      panCardNumber: data.panCardNumber,
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
