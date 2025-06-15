
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
import { Plus, Save, Edit, Trash2, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeeStructure {
  id: string;
  academicYear: string;
  className: string;
  residentialType: string;
  studentFee: number;
  medicalStationaryPool: number;
  createdAt: string;
  isEditing: boolean;
}

export const AcademicFeeStructureSettings: React.FC = () => {
  const { toast } = useToast();
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  
  const [newFee, setNewFee] = useState({
    academicYear: "2024-25",
    className: "",
    residentialType: "",
    studentFee: 9000,
    medicalStationaryPool: 2000,
  });

  const residentialTypes = ["Residential", "Non-Residential"];

  useEffect(() => {
    fetchClasses();
    loadFeeStructures();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('class_name')
        .order('class_name');
      
      if (error) throw error;
      
      const classes = [...new Set(data.map(cls => cls.class_name))];
      setAvailableClasses(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes.",
        variant: "destructive",
      });
    }
  };

  const loadFeeStructures = () => {
    const saved = localStorage.getItem('academicFeeStructures');
    if (saved) {
      setFeeStructures(JSON.parse(saved));
    }
  };

  const saveFeeStructures = (structures: FeeStructure[]) => {
    localStorage.setItem('academicFeeStructures', JSON.stringify(structures));
    setFeeStructures(structures);
  };

  const handleAddFee = () => {
    if (!newFee.className || !newFee.residentialType) {
      toast({
        title: "Validation Error",
        description: "Please select both class and residential type.",
        variant: "destructive",
      });
      return;
    }

    // Check if structure already exists for this combination
    const exists = feeStructures.find(
      fs => fs.academicYear === newFee.academicYear && 
           fs.className === newFee.className && 
           fs.residentialType === newFee.residentialType
    );

    if (exists) {
      toast({
        title: "Fee Structure Exists",
        description: "Fee structure for this combination already exists.",
        variant: "destructive",
      });
      return;
    }

    const newStructure: FeeStructure = {
      id: `afs_${Date.now()}`,
      academicYear: newFee.academicYear,
      className: newFee.className,
      residentialType: newFee.residentialType,
      studentFee: newFee.studentFee,
      medicalStationaryPool: newFee.medicalStationaryPool,
      createdAt: new Date().toISOString(),
      isEditing: false,
    };

    const updated = [...feeStructures, newStructure];
    saveFeeStructures(updated);

    // Reset form
    setNewFee({
      academicYear: "2024-25",
      className: "",
      residentialType: "",
      studentFee: 9000,
      medicalStationaryPool: 2000,
    });

    toast({
      title: "Fee Structure Added",
      description: `Fee structure for ${newFee.className} (${newFee.residentialType}) has been added.`,
    });
  };

  const toggleEdit = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: !fs.isEditing } : fs
    );
    saveFeeStructures(updated);
  };

  const updateFee = (id: string, field: keyof FeeStructure, value: any) => {
    const updated = feeStructures.map(structure => 
      structure.id === id ? { ...structure, [field]: value } : structure
    );
    saveFeeStructures(updated);
  };

  const deleteFee = (id: string) => {
    const updated = feeStructures.filter(fs => fs.id !== id);
    saveFeeStructures(updated);
    
    toast({
      title: "Fee Structure Deleted",
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
          <CardTitle>Academic Fee Structure Management</CardTitle>
          <CardDescription>
            Add and manage fee structures for each academic year, class, and residential type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={newFee.academicYear}
                onChange={(e) => setNewFee({...newFee, academicYear: e.target.value})}
                placeholder="2024-25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="className">Class</Label>
              <Select value={newFee.className} onValueChange={(value) => setNewFee({...newFee, className: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="residentialType">Residential Type</Label>
              <Select value={newFee.residentialType} onValueChange={(value) => setNewFee({...newFee, residentialType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select residential type" />
                </SelectTrigger>
                <SelectContent>
                  {residentialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentFee">Student Fee (₹)</Label>
              <Input
                id="studentFee"
                type="number"
                value={newFee.studentFee}
                onChange={(e) => setNewFee({...newFee, studentFee: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalStationaryPool">Medical & Stationary Pool (₹)</Label>
              <Input
                id="medicalStationaryPool"
                type="number"
                value={newFee.medicalStationaryPool}
                onChange={(e) => setNewFee({...newFee, medicalStationaryPool: Number(e.target.value)})}
              />
            </div>
          </div>

          <Button onClick={handleAddFee} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Structure
          </Button>
        </CardContent>
      </Card>

      {feeStructures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Fee Structure History
            </CardTitle>
            <CardDescription>
              View and manage all fee structures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeStructures
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((structure) => (
                <Card key={structure.id} className="border">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {structure.academicYear} - Class {structure.className} ({structure.residentialType})
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(structure.createdAt).toLocaleDateString()}
                        </p>
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
                          onClick={() => deleteFee(structure.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {structure.isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Student Fee (₹)</Label>
                          <Input
                            type="number"
                            value={structure.studentFee}
                            onChange={(e) => updateFee(structure.id, 'studentFee', Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Medical & Stationary Pool (₹)</Label>
                          <Input
                            type="number"
                            value={structure.medicalStationaryPool}
                            onChange={(e) => updateFee(structure.id, 'medicalStationaryPool', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Student Fee:</span>
                          <p className="text-green-600 font-semibold">₹{structure.studentFee.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Medical & Stationary Pool:</span>
                          <p className="text-purple-600 font-semibold">₹{structure.medicalStationaryPool.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
