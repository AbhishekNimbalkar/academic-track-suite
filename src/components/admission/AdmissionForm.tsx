
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/types/models";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface AdmissionFormProps {
  onSubmit: (data: Omit<Student, "id">) => void;
}

export function AdmissionForm({ onSubmit }: AdmissionFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Omit<Student, "id">>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.size > 100 * 1024) { // 100KB limit
      toast({
        title: "Image too large",
        description: "The image size exceeds the 100KB limit",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setValue('imageUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const onFormSubmit = (data: Omit<Student, "id">) => {
    if (!imagePreview) {
      toast({
        title: "Missing student image",
        description: "Please upload a student image (max 100KB)",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      ...data,
      imageUrl: imagePreview,
      // Set default values for fields not in the form
      admissionDate: new Date().toISOString().split('T')[0],
      medicalInfo: ""
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Admission Form</CardTitle>
        <CardDescription>Enter student details for admission</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Student Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="fullName" 
                {...register("fullName", { required: "Student name is required" })} 
                placeholder="Enter student's full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
              <Input 
                id="dateOfBirth" 
                type="date" 
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                max={format(new Date(), "yyyy-MM-dd")}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name <span className="text-red-500">*</span></Label>
              <Input 
                id="parentName" 
                {...register("parentName", { required: "Parent name is required" })}
                placeholder="Enter parent/guardian name"
              />
              {errors.parentName && <p className="text-red-500 text-sm">{errors.parentName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caste">Caste</Label>
              <Input 
                id="caste" 
                {...register("caste")}
                placeholder="Enter student's caste"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentialType">Residential Type <span className="text-red-500">*</span></Label>
              <RadioGroup defaultValue="non-residential">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="residential" 
                    value="residential" 
                    onClick={() => setValue("residentialType", "residential")}
                  />
                  <Label htmlFor="residential">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="non-residential" 
                    value="non-residential" 
                    onClick={() => setValue("residentialType", "non-residential")}
                  />
                  <Label htmlFor="non-residential">Non-Residential</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone Number <span className="text-red-500">*</span></Label>
              <Input 
                id="parentPhone" 
                {...register("parentPhone", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9\s-]{10,15}$/,
                    message: "Please enter a valid phone number"
                  } 
                })}
                placeholder="+91 XXXXXXXXXX"
              />
              {errors.parentPhone && <p className="text-red-500 text-sm">{errors.parentPhone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Parent Email</Label>
              <Input 
                id="parentEmail" 
                type="email"
                {...register("parentEmail", { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address"
                  }
                })}
                placeholder="parent@example.com"
              />
              {errors.parentEmail && <p className="text-red-500 text-sm">{errors.parentEmail.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber">Aadhaar Card Number</Label>
              <Input 
                id="aadhaarNumber" 
                {...register("aadhaarNumber", {
                  pattern: {
                    value: /^\d{12}$/,
                    message: "Aadhaar number must be 12 digits"
                  }
                })}
                placeholder="XXXX XXXX XXXX"
              />
              {errors.aadhaarNumber && <p className="text-red-500 text-sm">{errors.aadhaarNumber.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="panCardNumber">PAN Card Number</Label>
              <Input 
                id="panCardNumber" 
                {...register("panCardNumber", {
                  pattern: {
                    value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    message: "Please enter a valid PAN card number"
                  }
                })}
                placeholder="ABCDE1234F"
              />
              {errors.panCardNumber && <p className="text-red-500 text-sm">{errors.panCardNumber.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue("class", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
                    <SelectItem key={classNum} value={String(classNum)}>
                      Class {classNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && <p className="text-red-500 text-sm">{errors.class.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section">Section <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value) => setValue("section", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.section && <p className="text-red-500 text-sm">{errors.section.message}</p>}
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea 
                id="address" 
                {...register("address", { required: "Address is required" })}
                placeholder="Enter complete address"
                className="min-h-[100px]"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="studentImage">Student Image (Max 100KB) <span className="text-red-500">*</span></Label>
              <Input 
                id="studentImage" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Student preview" 
                    className="h-32 w-32 object-cover rounded-md border" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit">Submit Admission Form</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
