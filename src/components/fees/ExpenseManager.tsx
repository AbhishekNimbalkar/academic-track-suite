
import React, { useState } from "react";
import { Fee } from "@/types/models";
import { ExpenseCategory } from "@/types/feeTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseManagerProps {
  selectedFee: Fee;
  remainingAmount: number;
  onAddExpense: (expense: Omit<Fee["expenses"][0], "id">) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  selectedFee,
  remainingAmount,
  onAddExpense,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [expense, setExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    category: "medical" as "medical" | "stationary",
    billNumber: "",
  });

  const expenseCategories: ExpenseCategory[] = [
    {
      id: "medical_checkup",
      name: "Medical Checkup",
      type: "medical",
      description: "Regular health checkups and medical examinations",
    },
    {
      id: "medical_emergency",
      name: "Medical Emergency",
      type: "medical",
      description: "Emergency medical treatments and procedures",
    },
    {
      id: "notebooks",
      name: "Notebooks & Books",
      type: "stationary",
      description: "Textbooks, notebooks, and educational materials",
    },
    {
      id: "uniform",
      name: "School Uniform",
      type: "stationary",
      description: "School uniforms and accessories",
    },
    {
      id: "lab_equipment",
      name: "Lab Equipment",
      type: "stationary",
      description: "Science lab equipment and materials",
    },
  ];

  const handleSubmit = () => {
    if (!expense.description || expense.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a description and valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (expense.amount > remainingAmount) {
      toast({
        title: "Insufficient Funds",
        description: `Amount cannot exceed remaining pool balance of ₹${remainingAmount}.`,
        variant: "destructive",
      });
      return;
    }

    onAddExpense({
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      billNumber: expense.billNumber,
    });

    // Reset form
    setExpense({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
      category: "medical",
      billNumber: "",
    });
    
    setIsOpen(false);
    
    toast({
      title: "Expense Added",
      description: "The expense has been recorded successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense from {selectedFee.studentName}'s medical & stationary pool.
            Remaining balance: ₹{remainingAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={expense.date}
                onChange={(e) => setExpense(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="500"
                value={expense.amount || ""}
                onChange={(e) => setExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={expense.category}
              onValueChange={(value: "medical" | "stationary") =>
                setExpense(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="stationary">Stationary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the expense..."
              value={expense.description}
              onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="billNumber">Bill/Receipt Number (Optional)</Label>
            <Input
              id="billNumber"
              placeholder="BILL-2024-001"
              value={expense.billNumber}
              onChange={(e) => setExpense(prev => ({ ...prev, billNumber: e.target.value }))}
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Quick Templates:</h4>
            <div className="space-y-1">
              {expenseCategories
                .filter(cat => cat.type === expense.category)
                .map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setExpense(prev => ({ ...prev, description: cat.description }))}
                  >
                    {cat.name}
                  </Button>
                ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <FileText className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
