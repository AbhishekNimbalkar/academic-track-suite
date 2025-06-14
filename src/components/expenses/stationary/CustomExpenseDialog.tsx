
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Student } from "./types";

interface CustomExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  amount: string;
  setAmount: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onSubmit: () => void;
}

export const CustomExpenseDialog: React.FC<CustomExpenseDialogProps> = ({
  isOpen,
  onClose,
  students,
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
          <DialogTitle>Add Custom Stationary Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customAmount">Total Amount (₹)</Label>
            <Input
              id="customAmount"
              type="number"
              placeholder="Enter total amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDescription">Description</Label>
            <Textarea
              id="customDescription"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {students.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This expense will be divided among all {students.length} residential students
                {amount && students.length > 0 && ` (₹${(parseFloat(amount) / students.length).toFixed(2)} per student)`}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Add Custom Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
