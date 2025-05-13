
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Plus, Search } from "lucide-react";
import { dataService } from "@/services/mockData";
import { StationaryExpense, Student } from "@/types/models";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Stationary: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Check if user has permission
  if (!hasPermission("manage_stationary") && !hasPermission("view_residential_students")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // State for expense tracking
  const [expenses, setExpenses] = useState<StationaryExpense[]>([]);
  const [residentialStudents, setResidentialStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  // Form state for new expense
  const [selectedStudent, setSelectedStudent] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  
  // Fetch expenses and students
  useEffect(() => {
    const fetchData = () => {
      const stationaryExpenses = dataService.getStationaryExpenses();
      setExpenses(stationaryExpenses);
      
      const students = dataService.getStudents().filter(
        student => student.residentialType === "residential"
      );
      setResidentialStudents(students);
    };
    
    fetchData();
  }, []);
  
  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense =>
    expense.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Helper to find student by ID
  const getStudentById = (id: string) => {
    return residentialStudents.find(student => student.id === id);
  };
  
  // Handle adding new expense
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
    
    const student = getStudentById(selectedStudent);
    if (!student) {
      toast({
        title: "Student Not Found",
        description: "Selected student was not found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Get student's fee record to check remaining medical/stationary pool
    const studentFee = dataService.getFeeByStudentId(selectedStudent);
    
    if (!studentFee) {
      toast({
        title: "Fee Record Not Found",
        description: "No fee record found for this student.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate remaining pool amount
    const totalExpenses = studentFee.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const remainingPool = studentFee.medicalAndStationaryPool - totalExpenses;
    
    if (amount > remainingPool) {
      toast({
        title: "Insufficient Funds",
        description: `Expense exceeds remaining pool amount (₹${remainingPool})`,
        variant: "destructive",
      });
      return;
    }
    
    // Add expense to fee record
    const expense = {
      date: new Date().toISOString().split("T")[0],
      description: expenseDescription,
      amount,
      category: "stationary" as const,
    };
    
    const newExpense = dataService.addFeeExpense(studentFee.id, expense);
    
    if (newExpense) {
      // Add to local expenses list
      const newStationaryExpense: StationaryExpense = {
        id: newExpense.id,
        studentId: selectedStudent,
        studentName: student.fullName,
        date: newExpense.date,
        amount: newExpense.amount,
        description: newExpense.description,
        academic_year: studentFee.academicYear,
      };
      
      setExpenses([newStationaryExpense, ...expenses]);
      
      toast({
        title: "Expense Added",
        description: `₹${amount} expense recorded for ${student.fullName}`,
      });
      
      // Reset form
      setSelectedStudent("");
      setExpenseAmount("");
      setExpenseDescription("");
      setIsAddExpenseOpen(false);
    } else {
      toast({
        title: "Failed to Add Expense",
        description: "There was an error recording the expense.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Stationary Management</h1>
          {hasPermission("manage_stationary") && (
            <Button onClick={() => setIsAddExpenseOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Stationary Expenses</CardTitle>
            <CardDescription>
              Track and manage stationary expenses for residential students
            </CardDescription>
            <div className="flex items-center mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search expenses..."
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
                      Academic Year
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
                        No expenses found.
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
                          {expense.academic_year}
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
      </div>
      
      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stationary Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {residentialStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} (Class {student.class}-{student.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
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
            
            {selectedStudent && (
              <div className="text-sm text-muted-foreground">
                <p>
                  Student: {getStudentById(selectedStudent)?.fullName || 'Unknown'}
                </p>
                <p>
                  Class: {getStudentById(selectedStudent)?.class || 'N/A'}-
                  {getStudentById(selectedStudent)?.section || 'N/A'}
                </p>
              </div>
            )}
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
    </MainLayout>
  );
};

export default Stationary;
