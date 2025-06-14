
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "./types";

interface CommonExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onSubmit: () => void;
}

export const CommonExpenseDialog: React.FC<CommonExpenseDialogProps> = ({
  isOpen,
  onClose,
  students,
  selectedClass,
  setSelectedClass,
  amount,
  setAmount,
  description,
  setDescription,
  onSubmit,
}) => {
  const getClassOptions = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Common Stationary Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {getClassOptions().map(cls => (
                  <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commonAmount">Total Amount (₹)</Label>
            <Input
              id="commonAmount"
              type="number"
              placeholder="Enter total amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commonDescription">Description</Label>
            <Textarea
              id="commonDescription"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {selectedClass && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This expense will be divided among {students.filter(s => s.current_class === selectedClass).length} residential students in Class {selectedClass}
                {amount && students.filter(s => s.current_class === selectedClass).length > 0 && ` (₹${(parseFloat(amount) / students.filter(s => s.current_class === selectedClass).length).toFixed(2)} per student)`}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Add Common Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
