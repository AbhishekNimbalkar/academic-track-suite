
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MediumFeeStructure {
  id: string;
  medium: string;
  academicYear: string;
  classFees: ClassFee[];
  isEditing: boolean;
}

interface ClassFee {
  className: string;
  newStudentFee: number;
  oldStudentFee: number;
  medicalStationaryPool: number;
}

export const FeeStructureSettings: React.FC = () => {
  const { toast } = useToast();
  const [feeStructures, setFeeStructures] = useState<MediumFeeStructure[]>([]);
  const [classes, setClasses] = useState<{ id: string; className: string; medium: string }[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("2024-25");
  const [availableMedia, setAvailableMedia] = useState<string[]>([]);

  useEffect(() => {
    fetchClasses();
    fetchFeeStructures();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name, medium')
        .order('medium', { ascending: true })
        .order('class_name', { ascending: true });
      
      if (error) throw error;
      
      const formattedClasses = data.map(cls => ({
        id: cls.id,
        className: cls.class_name,
        medium: cls.medium,
      }));
      
      setClasses(formattedClasses);
      
      // Extract unique media
      const uniqueMedia = [...new Set(data.map(cls => cls.medium))];
      setAvailableMedia(uniqueMedia);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes.",
        variant: "destructive",
      });
    }
  };

  const fetchFeeStructures = () => {
    const saved = localStorage.getItem('mediumFeeStructures');
    if (saved) {
      setFeeStructures(JSON.parse(saved));
    }
  };

  const saveFeeStructures = (structures: MediumFeeStructure[]) => {
    localStorage.setItem('mediumFeeStructures', JSON.stringify(structures));
    setFeeStructures(structures);
  };

  const createFeeStructureForMedium = () => {
    if (!selectedMedium || !academicYear) {
      toast({
        title: "Validation Error",
        description: "Please select a medium and academic year.",
        variant: "destructive",
      });
      return;
    }

    // Check if fee structure already exists for this medium and academic year
    const exists = feeStructures.find(
      fs => fs.medium === selectedMedium && fs.academicYear === academicYear
    );

    if (exists) {
      toast({
        title: "Fee Structure Exists",
        description: "Fee structure for this medium and academic year already exists.",
        variant: "destructive",
      });
      return;
    }

    // Get all classes for the selected medium
    const mediumClasses = classes.filter(cls => cls.medium === selectedMedium);
    
    if (mediumClasses.length === 0) {
      toast({
        title: "No Classes Found",
        description: "No classes found for the selected medium.",
        variant: "destructive",
      });
      return;
    }

    const classFees: ClassFee[] = mediumClasses.map(cls => ({
      className: cls.className,
      newStudentFee: 9000,
      oldStudentFee: 7000,
      medicalStationaryPool: 2000,
    }));

    const newStructure: MediumFeeStructure = {
      id: `mfs_${Date.now()}`,
      medium: selectedMedium,
      academicYear,
      classFees,
      isEditing: false,
    };

    const updated = [...feeStructures, newStructure];
    saveFeeStructures(updated);

    // Reset form
    setSelectedMedium("");

    toast({
      title: "Fee Structure Created",
      description: `Fee structure for ${selectedMedium} medium has been created.`,
    });
  };

  const toggleEdit = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: !fs.isEditing } : fs
    );
    saveFeeStructures(updated);
  };

  const updateClassFee = (structureId: string, className: string, field: keyof ClassFee, value: number) => {
    const updated = feeStructures.map(structure => {
      if (structure.id === structureId) {
        return {
          ...structure,
          classFees: structure.classFees.map(classFee =>
            classFee.className === className ? { ...classFee, [field]: value } : classFee
          )
        };
      }
      return structure;
    });
    saveFeeStructures(updated);
  };

  const deleteFeeStructure = (id: string) => {
    const updated = feeStructures.filter(fs => fs.id !== id);
    saveFeeStructures(updated);
    
    toast({
      title: "Fee Structure Deleted",
      description: "The fee structure has been removed.",
    });
  };

  const saveEdit = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: false } : fs
    );
    saveFeeStructures(updated);
    
    toast({
      title: "Fee Structure Updated",
      description: "Changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Fee Structure by Medium</CardTitle>
          <CardDescription>
            Set fee amounts for all classes within a specific medium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024-25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a medium" />
                </SelectTrigger>
                <SelectContent>
                  {availableMedia.map((medium) => (
                    <SelectItem key={medium} value={medium}>
                      {medium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={createFeeStructureForMedium} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Fee Structure for Medium
          </Button>
        </CardContent>
      </Card>

      {feeStructures.length > 0 && (
        <div className="space-y-4">
          {feeStructures.map((structure) => (
            <Card key={structure.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {structure.medium} Medium - {structure.academicYear}
                    </CardTitle>
                    <CardDescription>
                      Fee structure for all classes in {structure.medium} medium
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {structure.isEditing ? (
                      <Button
                        size="sm"
                        onClick={() => saveEdit(structure.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleEdit(structure.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteFeeStructure(structure.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {structure.classFees.map((classFee, index) => (
                    <div key={classFee.className} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-lg">Class {classFee.className}</h4>
                      </div>
                      
                      {structure.isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>New Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={classFee.newStudentFee}
                              onChange={(e) => updateClassFee(structure.id, classFee.className, 'newStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Old Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={classFee.oldStudentFee}
                              onChange={(e) => updateClassFee(structure.id, classFee.className, 'oldStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Medical & Stationary Pool (₹)</Label>
                            <Input
                              type="number"
                              value={classFee.medicalStationaryPool}
                              onChange={(e) => updateClassFee(structure.id, classFee.className, 'medicalStationaryPool', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">New Student Fee:</span>
                            <p className="text-green-600 font-semibold">₹{classFee.newStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Old Student Fee:</span>
                            <p className="text-blue-600 font-semibold">₹{classFee.oldStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Medical & Stationary Pool:</span>
                            <p className="text-purple-600 font-semibold">₹{classFee.medicalStationaryPool.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
