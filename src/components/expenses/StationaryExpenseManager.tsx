
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/services/mockData";
import { Fee, Student } from "@/types/models";

export const StationaryExpenseManager: React.FC = () => {
  const { toast } = useToast();
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [stationaryType, setStationaryType] = useState<"notebooks" | "uniform" | "lab_equipment">("notebooks");

  useEffect(() => {
    const feeData = dataService.getFees();
    const studentData = dataService.getStudents().filter(s => s.residentialType === "residential");
    setFees(feeData);
    setStudents(studentData);
  }, []);

  const getAllStationaryExpenses = () => {
    return fees.flatMap(fee => 
      fee.expenses
        .filter(expense => expense.category === "stationary")
        .map(expense => ({
          ...expense,
          studentName: fee.studentName,
          studentId: fee.studentId,
          academicYear: fee.academicYear,
        }))
    );
  };

  const filteredExpenses = getAllStationaryExpenses().filter(expense =>
    expense.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExpense = () => {
    if (!selectedStudent || !expenseAmount || !expenseDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid expense amount.",
        variant: "destructive",
      });
      return;
    }

    const studentFee = fees.find(fee => fee.studentId === selectedStudent);
    if (!studentFee) {
      toast({
        title: "Fee Record Not Found",
        description: "No fee record found for this student.",
        variant: "destructive",
      });
      return;
    }

    const totalExpenses = studentFee.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingPool = studentFee.medicalAndStationaryPool - totalExpenses;

    if (amount > remainingPool) {
      toast({
        title: "Insufficient Funds",
        description: `Expense exceeds remaining pool amount (₹${remainingPool})`,
        variant: "destructive",
      });
      return;
    }

    const expense = {
      date: new Date().toISOString().split("T")[0],
      description: `${stationaryType.replace('_', ' ').charAt(0).toUpperCase() + stationaryType.replace('_', ' ').slice(1)}: ${expenseDescription}`,
      amount,
      category: "stationary" as const,
    };

    const newExpense = dataService.addFeeExpense(studentFee.id, expense);
    
    if (newExpense) {
      const updatedFees = dataService.getFees();
      setFees(updatedFees);
      
      toast({
        title: "Stationary Expense Added",
        description: `₹${amount} stationary expense recorded successfully.`,
      });

      // Reset form
      setSelectedStudent("");
      setExpenseAmount("");
      setExpenseDescription("");
      setStationaryType("notebooks");
      setIsAddExpenseOpen(false);
    }
  };

  const getCategoryBadge = (description: string) => {
    if (description.toLowerCase().includes("uniform")) {
      return <Badge variant="secondary">Uniform</Badge>;
    } else if (description.toLowerCase().includes("lab")) {
      return <Badge variant="default">Lab Equipment</Badge>;
    }
    return <Badge variant="outline">Notebooks & Books</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stationary Expense Management</h2>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stationary Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Stationary Expenses
          </CardTitle>
          <CardDescription>
            Track stationary expenses from student pools
          </CardDescription>
          <div className="flex items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stationary expenses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No stationary expenses found.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCategoryBadge(expense.description)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Stationary Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stationary Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} (Class {student.class}-{student.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stationaryType">Stationary Type</Label>
              <Select value={stationaryType} onValueChange={(value: "notebooks" | "uniform" | "lab_equipment") => setStationaryType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notebooks">Notebooks & Books</SelectItem>
                  <SelectItem value="uniform">School Uniform</SelectItem>
                  <SelectItem value="lab_equipment">Lab Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
