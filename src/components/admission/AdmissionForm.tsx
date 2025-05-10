
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Upload, X } from "lucide-react";

// Define the validation schema for the form
const formSchema = z.object({
  registrationNumber: z.string().min(1, { message: "Registration number is required" }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  parentName: z.string().min(2, { message: "Parent name is required" }),
  caste: z.string().optional(),
  residentialType: z.enum(["residential", "non-residential"]),
  parentPhone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  aadhaarNumber: z.string().min(12, { message: "Valid Aadhaar number is required" }).max(12),
  panCardNumber: z.string().optional(),
  studentImage: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export const AdmissionForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationNumber: "",
      studentName: "",
      dateOfBirth: "",
      parentName: "",
      caste: "",
      residentialType: "non-residential",
      parentPhone: "",
      address: "",
      aadhaarNumber: "",
      panCardNumber: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (100KB limit = 100 * 1024 bytes)
      if (file.size > 100 * 1024) {
        setImageError("Image size must be less than 100KB");
        e.target.value = '';
        setImagePreview(null);
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Set the file in the form
      form.setValue("studentImage", file);
    } else {
      setImagePreview(null);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageError(null);
    form.setValue("studentImage", null);
  };

  const onSubmit = (data: FormValues) => {
    // Handle form submission
    console.log("Form data:", data);
    toast({
      title: "Admission form submitted",
      description: `Student ${data.studentName} registered successfully.`,
    });
    
    // Reset form after submission
    form.reset();
    setImagePreview(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Admission Form</CardTitle>
        <CardDescription>
          Register a new student in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ADM2023001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Parent's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="caste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caste</FormLabel>
                    <FormControl>
                      <Input placeholder="Caste (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="residentialType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Type</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="residential" id="residential" />
                          <Label htmlFor="residential">Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-residential" id="non-residential" />
                          <Label htmlFor="non-residential">Non-residential</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12-digit Aadhaar number" maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="panCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Card Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="PAN Card number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Complete residential address" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Student Image</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="studentImage" className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-dashed px-4 transition hover:border-primary">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Label>
                    <Input 
                      id="studentImage" 
                      type="file" 
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                  <FormDescription>
                    JPG, PNG or GIF. Max size 100KB.
                  </FormDescription>
                </div>
                
                {imageError && (
                  <div className="text-sm text-destructive">{imageError}</div>
                )}
                
                {imagePreview && (
                  <div className="relative w-32 h-32">
                    <img 
                      src={imagePreview} 
                      alt="Student Preview" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Student
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
