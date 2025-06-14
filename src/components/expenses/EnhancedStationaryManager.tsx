import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import types and components
import { Student, StationaryExpense, CommonExpense, ExpenseFund } from "./stationary/types";
import { IndividualExpenseDialog } from "./stationary/IndividualExpenseDialog";
import { StudentExpenseHistoryDialog } from "./stationary/StudentExpenseHistoryDialog";

export const EnhancedStationaryManager: React.FC = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("1");
  const [expenses, setExpenses] = useState<StationaryExpense[]>([]);
  const [commonExpenses, setCommonExpenses] = useState<CommonExpense[]>([]);
  const [funds, setFunds] = useState<ExpenseFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [studentForDialog, setStudentForDialog] = useState<Student | null>(null);

  // Form states
  const [individualAmount, setIndividualAmount] = useState("");
  const [individualDescription, setIndividualDescription] = useState("");
  const [globalCommonAmount, setGlobalCommonAmount] = useState("");
  const [globalCommonDescription, setGlobalCommonDescription] = useState("");

  // Permissions for action logic
  const canAdd = hasPermission("manage_stationary") || hasPermission("stationary_add_expense");
  const canEdit = hasPermission("manage_stationary") || hasPermission("stationary_edit_expense");
  const canDelete = hasPermission("manage_stationary") || hasPermission("stationary_delete_expense");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchResidentialStudents();
      loadMockData(); // Keep mock data for now
    } catch (error) {
      console.error('Error loading data:', error);
      loadMockStudents();
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResidentialStudents = async () => {
    try {
      console.log('Fetching residential students...');
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('residential_type', 'residential')
        .order('current_class', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      console.log('Fetched residential students:', studentsData);
      
      if (studentsData && studentsData.length > 0) {
        const validStudents = studentsData.filter(s => s && s.current_class);
        setStudents(validStudents);
        return;
      }

      loadMockStudents();
    } catch (error) {
      console.error('Error in fetchResidentialStudents:', error);
      loadMockStudents();
    }
  };

  const loadMockStudents = () => {
    const mockStudents: Student[] = [
      { id: "STU001", student_id: "STU001", first_name: "John", last_name: "Doe", current_class: "10", residential_type: "residential" },
      { id: "STU002", student_id: "STU002", first_name: "Jane", last_name: "Smith", current_class: "10", residential_type: "residential" },
      { id: "STU003", student_id: "STU003", first_name: "Mike", last_name: "Johnson", current_class: "9", residential_type: "residential" },
      { id: "STU004", student_id: "STU004", first_name: "Sarah", last_name: "Wilson", current_class: "11", stream: "APC", residential_type: "residential" },
      { id: "STU005", student_id: "STU005", first_name: "Alex", last_name: "Brown", current_class: "1", residential_type: "residential" },
      { id: "STU006", student_id: "STU006", first_name: "Emily", last_name: "Davis", current_class: "12", stream: "USA", residential_type: "residential" }
    ];
    setStudents(mockStudents);
  };

  const loadMockData = () => {
    const mockFunds: ExpenseFund[] = [
      { studentId: "STU001", studentName: "John Doe", class: "10", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 2500, remainingBalance: 6500, isNegative: false },
      { studentId: "STU002", studentName: "Jane Smith", class: "10", section: "A", academicYear: "2024-25", initialAmount: 7000, totalExpenses: 7500, remainingBalance: -500, isNegative: true, negativeAmount: 500 },
      { studentId: "STU003", studentName: "Mike Johnson", class: "9", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 3000, remainingBalance: 6000, isNegative: false },
      { studentId: "STU004", studentName: "Sarah Wilson", class: "11", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 1000, remainingBalance: 8000, isNegative: false },
    ];
    setFunds(mockFunds);

    const mockExpenses: StationaryExpense[] = [
      { id: "SE001", studentId: "STU001", studentName: "John Doe", date: "2024-01-15", amount: 500, description: "Notebooks and pens", academicYear: "2024-25", class: "10", section: "A", type: "individual" },
      { id: "SE002", studentId: "STU003", studentName: "Mike Johnson", date: "2024-01-20", amount: 300, description: "Art supplies", academicYear: "2024-25", class: "9", section: "A", type: "individual" },
    ];
    setExpenses(mockExpenses);

    const mockCommonExpenses: CommonExpense[] = [
      { id: "CE001", date: "2024-01-10", description: "Chart papers for class project", totalAmount: 1000, category: "stationary", class: "10", section: "A", academicYear: "2024-25", studentsAffected: ["STU001", "STU002"], amountPerStudent: 500, addedBy: "Teacher1" }
    ];
    setCommonExpenses(mockCommonExpenses);
  };

  const getClassOptions = () => {
    const classes = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
    classes.push("11-APC", "11-USA", "12-APC", "12-USA");
    return classes;
  };

  const getStudentFund = (studentId: string) => {
    return funds.find(f => f.studentId === studentId);
  };

  const openIndividualExpenseDialog = (student: Student) => {
    setStudentForDialog(student);
    setIndividualAmount("");
    setIndividualDescription("");
    setIsIndividualDialogOpen(true);
  };

  const openHistoryDialog = (student: Student) => {
    setStudentForDialog(student);
    setIsHistoryDialogOpen(true);
  };

  const handleAddIndividualExpense = () => {
    if (!studentForDialog || !individualAmount || !individualDescription) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const amount = parseFloat(individualAmount);
    const fund = getStudentFund(studentForDialog.id);

    const newExpense: StationaryExpense = {
      id: `SE${Date.now()}`,
      studentId: studentForDialog.id,
      studentName: `${studentForDialog.first_name} ${studentForDialog.last_name}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      description: individualDescription,
      academicYear: "2024-25",
      class: studentForDialog.current_class,
      section: "A", // Assuming section 'A'
      type: "individual",
    };

    setExpenses([...expenses, newExpense]);

    if (fund) {
      const updatedFund = {
        ...fund,
        totalExpenses: fund.totalExpenses + amount,
        remainingBalance: fund.remainingBalance - amount,
        isNegative: fund.remainingBalance - amount < 0,
        negativeAmount: fund.remainingBalance - amount < 0 ? Math.abs(fund.remainingBalance - amount) : undefined,
      };
      setFunds(funds.map(f => f.studentId === studentForDialog.id ? updatedFund : f));
    }

    toast({ title: "Individual Expense Added", description: `₹${amount} expense for ${studentForDialog.first_name}.` });
    
    setIndividualAmount("");
    setIndividualDescription("");
    setIsIndividualDialogOpen(false);
    setStudentForDialog(null);
  };

  const handleAddGlobalCommonExpense = () => {
    if (!globalCommonAmount || !globalCommonDescription) {
      toast({ title: "Missing Information", description: "Please provide amount and description.", variant: "destructive" });
      return;
    }

    const amountPerStudent = parseFloat(globalCommonAmount);
    if (isNaN(amountPerStudent) || amountPerStudent <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }

    const newCommonExpense: CommonExpense = {
      id: `CE${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: globalCommonDescription,
      totalAmount: amountPerStudent * students.length,
      category: "stationary",
      class: "All",
      section: "All",
      academicYear: "2024-25",
      studentsAffected: students.map(s => s.id),
      amountPerStudent,
      addedBy: "Admin",
    };

    setCommonExpenses([...commonExpenses, newCommonExpense]);

    const updatedFunds = funds.map(fund => {
      if (students.some(s => s.id === fund.studentId)) {
        const newBalance = fund.remainingBalance - amountPerStudent;
        return {
          ...fund,
          totalExpenses: fund.totalExpenses + amountPerStudent,
          remainingBalance: newBalance,
          isNegative: newBalance < 0,
          negativeAmount: newBalance < 0 ? Math.abs(newBalance) : undefined,
        };
      }
      return fund;
    });
    setFunds(updatedFunds);

    toast({ title: "Global Expense Added", description: `₹${amountPerStudent} deducted from each of the ${students.length} residential students.` });

    setGlobalCommonAmount("");
    setGlobalCommonDescription("");
  };
  
  const handleDeleteExpense = (expenseId: string, type: "individual" | "common") => {
    // This is a mock implementation. In a real app, you'd call an API.
    if (type === 'individual') {
        setExpenses(expenses.filter(e => e.id !== expenseId));
    } else {
        setCommonExpenses(commonExpenses.filter(e => e.id !== expenseId));
    }
    toast({ title: "Expense Deleted", description: "The expense has been removed."});
    setIsHistoryDialogOpen(false); // Close dialog after action
  }
  
  const handleEditExpense = (expense: StationaryExpense | CommonExpense) => {
    // Mock implementation
    toast({ title: "Edit functionality not implemented", description: "This would open an edit form."});
  }

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const classIdentifier = student.stream ? `${student.current_class}-${student.stream}` : student.current_class;
      return classIdentifier === selectedClass;
    });
  }, [students, selectedClass]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stationary Management</h2>
        <Button onClick={() => {}} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Section 1: Global Common Expense */}
      <Card>
        <CardHeader>
          <CardTitle>Add Global Common Expense</CardTitle>
          <CardDescription>This expense will be deducted from every residential student's fund.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="globalDesc">Description</Label>
              <Input id="globalDesc" placeholder="e.g., Annual stationary kit" value={globalCommonDescription} onChange={e => setGlobalCommonDescription(e.target.value)} />
            </div>
            <div className="w-48 space-y-2">
              <Label htmlFor="globalAmount">Amount per Student (₹)</Label>
              <Input id="globalAmount" type="number" placeholder="e.g., 3000" value={globalCommonAmount} onChange={e => setGlobalCommonAmount(e.target.value)} />
            </div>
            {/* Only allow add if canAdd */}
            {canAdd && (
              <Button onClick={handleAddGlobalCommonExpense}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Class-wise Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Student Expenses</CardTitle>
            <div className="flex gap-4 pt-2">
                <div className="w-64">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>
                        {getClassOptions().map(clsOpt => {
                            if (/^\d+$/.test(clsOpt)) return <SelectItem key={clsOpt} value={clsOpt}>Class {clsOpt}</SelectItem>;
                            if (clsOpt.startsWith("11-")) return <SelectItem key={clsOpt} value={clsOpt}>Class 11 ({clsOpt.endsWith("APC") ? "APC" : "USA"})</SelectItem>;
                            if (clsOpt.startsWith("12-")) return <SelectItem key={clsOpt} value={clsOpt}>Class 12 ({clsOpt.endsWith("APC") ? "APC" : "USA"})</SelectItem>;
                            return null;
                        })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
            {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                    const fund = getStudentFund(student.id);
                    return (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{student.first_name} {student.last_name}</h4>
                                <p className="text-sm text-muted-foreground">{student.student_id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className={`font-medium ${fund?.isNegative ? 'text-red-500' : ''}`}>
                                        ₹{fund ? fund.remainingBalance.toLocaleString() : 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Remaining Fund</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => openHistoryDialog(student)}>History</Button>
                                {/* Only allow adding if canAdd */}
                                {canAdd && (
                                  <Button size="sm" onClick={() => openIndividualExpenseDialog(student)}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Expense
                                  </Button>
                                )}
                            </div>
                        </div>
                    )
                })
            ) : (
                <p className="text-center text-muted-foreground py-8">No residential students in this class.</p>
            )}
            </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <IndividualExpenseDialog
        isOpen={isIndividualDialogOpen}
        onClose={() => setIsIndividualDialogOpen(false)}
        student={studentForDialog}
        amount={individualAmount}
        setAmount={setIndividualAmount}
        description={individualDescription}
        setDescription={setIndividualDescription}
        onSubmit={handleAddIndividualExpense}
      />
      
      <StudentExpenseHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        student={studentForDialog}
        expenses={expenses}
        commonExpenses={commonExpenses}
        // Only admin can manage (edit/delete), not stationary
        canManage={canEdit && canDelete}
        onDelete={handleDeleteExpense}
        onEdit={handleEditExpense}
      />
    </div>
  );
};
