
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
import { Plus, Save, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClassFeeStructure {
  className: string;
  newStudentFee: number;
  oldStudentFee: number;
  medicalStationaryPool: number;
}

interface MediumFeeStructure {
  id: string;
  medium: string;
  academicYear: string;
  classes: ClassFeeStructure[];
  isEditing: boolean;
}

export const MediumFeeStructureSettings: React.FC = () => {
  const { toast } = useToast();
  const [feeStructures, setFeeStructures] = useState<MediumFeeStructure[]>([]);
  const [availableMedia, setAvailableMedia] = useState<string[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("2024-25");

  useEffect(() => {
    fetchAvailableMedia();
    loadFeeStructures();
  }, []);

  const fetchAvailableMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('medium')
        .order('medium');
      
      if (error) throw error;
      
      const uniqueMedia = [...new Set(data.map(cls => cls.medium))];
      setAvailableMedia(uniqueMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available media.",
        variant: "destructive",
      });
    }
  };

  const loadFeeStructures = () => {
    const saved = localStorage.getItem('mediumFeeStructures');
    if (saved) {
      setFeeStructures(JSON.parse(saved));
    }
  };

  const saveFeeStructures = (structures: MediumFeeStructure[]) => {
    localStorage.setItem('mediumFeeStructures', JSON.stringify(structures));
    setFeeStructures(structures);
  };

  const createFeeStructureForMedium = async () => {
    if (!selectedMedium || !academicYear) {
      toast({
        title: "Validation Error",
        description: "Please select a medium and academic year.",
        variant: "destructive",
      });
      return;
    }

    // Check if structure already exists
    const exists = feeStructures.find(
      fs => fs.medium === selectedMedium && fs.academicYear === academicYear
    );

    if (exists) {
      toast({
        title: "Structure Exists",
        description: "Fee structure for this medium and academic year already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch all classes for the selected medium
      const { data: classes, error } = await supabase
        .from('classes')
        .select('class_name')
        .eq('medium', selectedMedium)
        .order('class_name');

      if (error) throw error;

      if (classes.length === 0) {
        toast({
          title: "No Classes Found",
          description: "No classes found for the selected medium.",
          variant: "destructive",
        });
        return;
      }

      const classStructures: ClassFeeStructure[] = classes.map(cls => ({
        className: cls.class_name,
        newStudentFee: 9000,
        oldStudentFee: 7000,
        medicalStationaryPool: 2000,
      }));

      const newStructure: MediumFeeStructure = {
        id: `mfs_${Date.now()}`,
        medium: selectedMedium,
        academicYear,
        classes: classStructures,
        isEditing: false,
      };

      const updated = [...feeStructures, newStructure];
      saveFeeStructures(updated);

      setSelectedMedium("");
      
      toast({
        title: "Fee Structure Created",
        description: `Fee structure for ${selectedMedium} medium has been created.`,
      });
    } catch (error) {
      console.error('Error creating fee structure:', error);
      toast({
        title: "Error",
        description: "Failed to create fee structure.",
        variant: "destructive",
      });
    }
  };

  const toggleEdit = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: !fs.isEditing } : fs
    );
    saveFeeStructures(updated);
  };

  const updateClassFee = (structureId: string, className: string, field: keyof ClassFeeStructure, value: number) => {
    const updated = feeStructures.map(structure => {
      if (structure.id === structureId) {
        return {
          ...structure,
          classes: structure.classes.map(cls =>
            cls.className === className ? { ...cls, [field]: value } : cls
          )
        };
      }
      return structure;
    });
    saveFeeStructures(updated);
  };

  const deleteStructure = (id: string) => {
    const updated = feeStructures.filter(fs => fs.id !== id);
    saveFeeStructures(updated);
    
    toast({
      title: "Structure Deleted",
      description: "Fee structure has been removed.",
    });
  };

  const saveChanges = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: false } : fs
    );
    saveFeeStructures(updated);
    
    toast({
      title: "Changes Saved",
      description: "Fee structure has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medium-wise Fee Structure</CardTitle>
          <CardDescription>
            Create and manage fee structures for all classes within each medium
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
                        onClick={() => saveChanges(structure.id)}
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
                      onClick={() => deleteStructure(structure.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {structure.classes.map((classStructure, index) => (
                    <div key={classStructure.className} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-lg">Class {classStructure.className}</h4>
                      </div>
                      
                      {structure.isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>New Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={classStructure.newStudentFee}
                              onChange={(e) => updateClassFee(structure.id, classStructure.className, 'newStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Old Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={classStructure.oldStudentFee}
                              onChange={(e) => updateClassFee(structure.id, classStructure.className, 'oldStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Medical & Stationary Pool (₹)</Label>
                            <Input
                              type="number"
                              value={classStructure.medicalStationaryPool}
                              onChange={(e) => updateClassFee(structure.id, classStructure.className, 'medicalStationaryPool', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">New Student Fee:</span>
                            <p className="text-green-600 font-semibold">₹{classStructure.newStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Old Student Fee:</span>
                            <p className="text-blue-600 font-semibold">₹{classStructure.oldStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Medical & Stationary Pool:</span>
                            <p className="text-purple-600 font-semibold">₹{classStructure.medicalStationaryPool.toLocaleString()}</p>
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
