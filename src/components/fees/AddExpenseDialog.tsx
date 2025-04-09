
import React, { useState } from "react";
import { Fee } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { dataService } from "@/services/mockData";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFee: Fee;
  remainingAmount: number;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFee,
  remainingAmount,
}) => {
  const { toast } = useToast();
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    category: "medical" as "medical" | "stationary",
  });

  const handleAddExpense = () => {
    if (!selectedFee) return;
    
    // Check if adding this expense would exceed the pool
    if (newExpense.amount > remainingAmount) {
      toast({
        title: "Error",
        description: `This expense would exceed the medical & stationary pool of ₹${selectedFee.medicalAndStationaryPool}. Available: ₹${remainingAmount}`,
        variant: "destructive",
      });
      return;
    }
    
    const addedExpense = dataService.addFeeExpense(selectedFee.id, newExpense);
    
    if (addedExpense) {
      onOpenChange(false);
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: 0,
        category: "medical",
      });
      
      toast({
        title: "Expense Added",
        description: `${newExpense.category === "medical" ? "Medical" : "Stationary"} expense of ₹${newExpense.amount} has been added.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add a new medical or stationary expense for {selectedFee?.studentName}.
            Available balance: ₹{remainingAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expenseDate">Date</Label>
            <Input
              id="expenseDate"
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  date: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseDescription">Description</Label>
            <Input
              id="expenseDescription"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  description: e.target.value,
                })
              }
              placeholder="Description of the expense"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseAmount">Amount (₹)</Label>
            <Input
              id="expenseAmount"
              type="number"
              min="0"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  amount: Number(e.target.value),
                })
              }
              placeholder="Amount in rupees"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseCategory">Category</Label>
            <select
              id="expenseCategory"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  category: e.target.value as "medical" | "stationary",
                })
              }
            >
              <option value="medical">Medical</option>
              <option value="stationary">Stationary</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddExpense}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
