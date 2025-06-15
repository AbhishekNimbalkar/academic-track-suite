
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

interface ClassFeeStructure {
  id: string;
  className: string;
  newStudentFee: number;
  oldStudentFee: number;
  academicYear: string;
  medicalStationaryPool: number;
  isEditing: boolean;
}

export const FeeStructureSettings: React.FC = () => {
  const { toast } = useToast();
  const [feeStructures, setFeeStructures] = useState<ClassFeeStructure[]>([]);
  const [classes, setClasses] = useState<{ id: string; className: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [newStudentFee, setNewStudentFee] = useState<number>(9000);
  const [oldStudentFee, setOldStudentFee] = useState<number>(7000);
  const [medicalStationaryPool, setMedicalStationaryPool] = useState<number>(2000);
  const [academicYear, setAcademicYear] = useState<string>("2024-25");

  useEffect(() => {
    fetchClasses();
    fetchFeeStructures();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name')
        .order('class_name', { ascending: true });
      
      if (error) throw error;
      
      const formattedClasses = data.map(cls => ({
        id: cls.id,
        className: cls.class_name,
      }));
      
      setClasses(formattedClasses);
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
    // For now, we'll use local storage to persist fee structures
    // In a real app, this would come from the database
    const saved = localStorage.getItem('feeStructures');
    if (saved) {
      setFeeStructures(JSON.parse(saved));
    }
  };

  const saveFeeStructures = (structures: ClassFeeStructure[]) => {
    localStorage.setItem('feeStructures', JSON.stringify(structures));
    setFeeStructures(structures);
  };

  const addFeeStructure = () => {
    if (!selectedClass) {
      toast({
        title: "Validation Error",
        description: "Please select a class.",
        variant: "destructive",
      });
      return;
    }

    const selectedClassData = classes.find(c => c.id === selectedClass);
    if (!selectedClassData) return;

    // Check if fee structure already exists for this class and academic year
    const exists = feeStructures.find(
      fs => fs.className === selectedClassData.className && fs.academicYear === academicYear
    );

    if (exists) {
      toast({
        title: "Fee Structure Exists",
        description: "Fee structure for this class and academic year already exists.",
        variant: "destructive",
      });
      return;
    }

    const newStructure: ClassFeeStructure = {
      id: `fs_${Date.now()}`,
      className: selectedClassData.className,
      newStudentFee,
      oldStudentFee,
      academicYear,
      medicalStationaryPool,
      isEditing: false,
    };

    const updated = [...feeStructures, newStructure];
    saveFeeStructures(updated);

    // Reset form
    setSelectedClass("");
    setNewStudentFee(9000);
    setOldStudentFee(7000);
    setMedicalStationaryPool(2000);

    toast({
      title: "Fee Structure Added",
      description: `Fee structure for ${selectedClassData.className} has been created.`,
    });
  };

  const toggleEdit = (id: string) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, isEditing: !fs.isEditing } : fs
    );
    saveFeeStructures(updated);
  };

  const updateFeeStructure = (id: string, field: keyof ClassFeeStructure, value: any) => {
    const updated = feeStructures.map(fs => 
      fs.id === id ? { ...fs, [field]: value } : fs
    );
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
          <CardTitle>Add New Fee Structure</CardTitle>
          <CardDescription>
            Configure fee amounts for new and existing students by class
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
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newStudentFee">New Student Fee (₹)</Label>
              <Input
                id="newStudentFee"
                type="number"
                value={newStudentFee}
                onChange={(e) => setNewStudentFee(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oldStudentFee">Old Student Fee (₹)</Label>
              <Input
                id="oldStudentFee"
                type="number"
                value={oldStudentFee}
                onChange={(e) => setOldStudentFee(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicalStationaryPool">Medical & Stationary Pool (₹)</Label>
              <Input
                id="medicalStationaryPool"
                type="number"
                value={medicalStationaryPool}
                onChange={(e) => setMedicalStationaryPool(Number(e.target.value))}
              />
            </div>
          </div>

          <Button onClick={addFeeStructure} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Structure
          </Button>
        </CardContent>
      </Card>

      {feeStructures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Fee Structures</CardTitle>
            <CardDescription>
              Manage and edit fee structures for different classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeStructures.map((structure) => (
                <div key={structure.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-lg">
                        {structure.className} - {structure.academicYear}
                      </h3>
                      
                      {structure.isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>New Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={structure.newStudentFee}
                              onChange={(e) => updateFeeStructure(structure.id, 'newStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Old Student Fee (₹)</Label>
                            <Input
                              type="number"
                              value={structure.oldStudentFee}
                              onChange={(e) => updateFeeStructure(structure.id, 'oldStudentFee', Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Medical & Stationary Pool (₹)</Label>
                            <Input
                              type="number"
                              value={structure.medicalStationaryPool}
                              onChange={(e) => updateFeeStructure(structure.id, 'medicalStationaryPool', Number(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">New Student Fee:</span>
                            <p className="text-green-600 font-semibold">₹{structure.newStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Old Student Fee:</span>
                            <p className="text-blue-600 font-semibold">₹{structure.oldStudentFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Medical & Stationary Pool:</span>
                            <p className="text-purple-600 font-semibold">₹{structure.medicalStationaryPool.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
