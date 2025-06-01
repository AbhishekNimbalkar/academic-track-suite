
import React, { useState } from "react";
import { FeeStructure, FeeCategory } from "@/types/feeTypes";
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
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeeStructureManagerProps {
  onStructureUpdate: (structure: FeeStructure) => void;
}

export const FeeStructureManager: React.FC<FeeStructureManagerProps> = ({
  onStructureUpdate,
}) => {
  const { toast } = useToast();
  const [structure, setStructure] = useState<Partial<FeeStructure>>({
    academicYear: "",
    class: "",
    residentialType: "non-residential",
    categories: [],
    totalAmount: 0,
    medicalStationaryPool: 0,
  });

  const addClass = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const addCategory = () => {
    const newCategory: FeeCategory = {
      id: `cat_${Date.now()}`,
      name: "",
      description: "",
      baseAmount: 0,
      isRequired: true,
    };
    
    setStructure(prev => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory],
    }));
  };

  const updateCategory = (categoryId: string, field: keyof FeeCategory, value: any) => {
    setStructure(prev => ({
      ...prev,
      categories: prev.categories?.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const removeCategory = (categoryId: string) => {
    setStructure(prev => ({
      ...prev,
      categories: prev.categories?.filter(cat => cat.id !== categoryId),
    }));
  };

  const calculateTotal = () => {
    const categoriesTotal = structure.categories?.reduce((sum, cat) => sum + cat.baseAmount, 0) || 0;
    const medicalStationaryPool = structure.medicalStationaryPool || 0;
    return categoriesTotal + medicalStationaryPool;
  };

  const saveStructure = () => {
    if (!structure.academicYear || !structure.class || !structure.categories?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one fee category.",
        variant: "destructive",
      });
      return;
    }

    const finalStructure: FeeStructure = {
      id: `fs_${Date.now()}`,
      academicYear: structure.academicYear!,
      class: structure.class!,
      residentialType: structure.residentialType!,
      categories: structure.categories!,
      totalAmount: calculateTotal(),
      medicalStationaryPool: structure.medicalStationaryPool || 0,
    };

    onStructureUpdate(finalStructure);
    toast({
      title: "Fee Structure Saved",
      description: "The fee structure has been successfully created.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Structure Manager</CardTitle>
        <CardDescription>
          Create and manage fee structures for different classes and residential types
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              placeholder="2023-2024"
              value={structure.academicYear || ""}
              onChange={(e) => setStructure(prev => ({ ...prev, academicYear: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={structure.class || ""}
              onValueChange={(value) => setStructure(prev => ({ ...prev, class: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {addClass.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="residentialType">Residential Type</Label>
            <Select
              value={structure.residentialType || "non-residential"}
              onValueChange={(value: "residential" | "non-residential") => 
                setStructure(prev => ({ ...prev, residentialType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="non-residential">Non-Residential</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fee Categories</h3>
            <Button onClick={addCategory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          {structure.categories?.map((category) => (
            <div key={category.id} className="border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label>Category Name</Label>
                  <Input
                    placeholder="Tuition Fee"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    placeholder="Monthly tuition fees"
                    value={category.description}
                    onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={category.baseAmount}
                    onChange={(e) => updateCategory(category.id, 'baseAmount', Number(e.target.value))}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCategory(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalStationaryPool">Medical & Stationary Pool (₹)</Label>
          <Input
            id="medicalStationaryPool"
            type="number"
            placeholder="9000"
            value={structure.medicalStationaryPool || ""}
            onChange={(e) => setStructure(prev => ({ ...prev, medicalStationaryPool: Number(e.target.value) }))}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Fee Amount:</span>
            <span className="text-lg font-bold">₹{calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <Button onClick={saveStructure} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Fee Structure
        </Button>
      </CardContent>
    </Card>
  );
};
