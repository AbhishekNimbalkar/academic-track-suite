
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "./types";

interface IndividualExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudent: string;
  setSelectedStudent: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onSubmit: () => void;
}

export const IndividualExpenseDialog: React.FC<IndividualExpenseDialogProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudent,
  setSelectedStudent,
  amount,
  setAmount,
  description,
  setDescription,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Individual Stationary Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select residential student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} (Class {student.current_class})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
