
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string | null) => void;
  existingImage?: string | null;
  maxSizeKB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  existingImage = null,
  maxSizeKB = 100,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(existingImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file size (convert KB to bytes)
    if (file.size > maxSizeKB * 1024) {
      toast({
        title: "File too large",
        description: `Image must be less than ${maxSizeKB}KB. Current size: ${Math.round(file.size / 1024)}KB`,
        variant: "destructive",
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    // Check if it's an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      onImageUpload(result);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="student-image">Student Image (Max {maxSizeKB}KB)</Label>
        <input
          ref={fileInputRef}
          id="student-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      
      {imagePreview ? (
        <Card className="p-2 relative">
          <img 
            src={imagePreview} 
            alt="Student preview" 
            className="max-h-48 w-auto mx-auto"
          />
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            Remove
          </Button>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-32 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-6 w-6 mb-2" />
            <span>Upload Student Photo</span>
            <span className="text-xs text-muted-foreground mt-1">
              Max {maxSizeKB}KB
            </span>
          </div>
        </Button>
      )}
    </div>
  );
};
