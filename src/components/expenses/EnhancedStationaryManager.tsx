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
  const { hasPermission, user } = useAuth();

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

  // Load all stationary data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Students (residential only)
      const { data: studentsData /*, error: stuErr */ } = await supabase
        .from("students")
        .select("*")
        .eq("residential_type", "residential")
        .order("current_class", { ascending: true });
      setStudents(studentsData || []);

      // 2. Stationary Funds
      const { data: fundsData /*, error: fundsErr */ } = await supabase
        .from("stationary_expense_funds")
        .select("*");

      // map fundsData to ExpenseFund interface
      setFunds(
        (fundsData || []).map((f: any) => {
          // Find the matching student
          const student = (studentsData || []).find((s: any) => s.id === f.student_id);
          return {
            studentId: f.student_id,
            studentName: student ? `${student.first_name} ${student.last_name}` : "",
            class: student ? student.current_class : "",
            section: f.section,
            academicYear: f.academic_year,
            initialAmount: Number(f.initial_amount),
            totalExpenses: Number(f.total_expenses),
            remainingBalance: Number(f.remaining_balance),
            isNegative: Number(f.remaining_balance) < 0,
            negativeAmount: Number(f.remaining_balance) < 0 ? Math.abs(Number(f.remaining_balance)) : undefined,
            // Optionally include: id, createdAt
          } as ExpenseFund;
        })
      );

      // 3. Individual Expenses
      const { data: iExpenses /*, error: iErr */ } = await supabase
        .from("stationary_expenses")
        .select("*");

      setExpenses(
        (iExpenses || []).map((e: any) => {
          // Find the matching student
          const student = (studentsData || []).find((s: any) => s.id === e.student_id);
          return {
            id: e.id,
            studentId: e.student_id,
            studentName: student ? `${student.first_name} ${student.last_name}` : "",
            date: e.date,
            amount: Number(e.amount),
            description: e.description,
            academicYear: e.academic_year,
            class: e.class,
            section: e.section,
            type: "individual"
          } as StationaryExpense;
        })
      );

      // 4. Common Expenses
      const { data: cExpenses /*, error: cErr */ } = await supabase
        .from("stationary_common_expenses")
        .select("*");
      setCommonExpenses(
        (cExpenses || []).map((ce: any) => ({
          id: ce.id,
          date: ce.date,
          description: ce.description,
          totalAmount: Number(ce.total_amount),
          category: "stationary",
          class: ce.class || "",
          section: ce.section || "",
          academicYear: ce.academic_year,
          studentsAffected: ce.students_affected || [],
          amountPerStudent: Number(ce.amount_per_student),
          addedBy: ce.added_by || ""
        } as CommonExpense))
      );
    } catch (err) {
      toast({ title: "Error", description: "Failed to load stationary data.", variant: "destructive" });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find fund by student ID
  const getStudentFund = (studentId: string) => {
    return funds.find(f => f.studentId === studentId);
  };

  // Classes from 1-10, plus 11/12-APC/USA
  const getClassOptions = () => {
    const classes = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
    classes.push("11-APC", "11-USA", "12-APC", "12-USA");
    return classes;
  };

  // Open dialogs
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

  // Add an individual expense (Supabase)
  const handleAddIndividualExpense = async () => {
    if (!studentForDialog || !individualAmount || !individualDescription) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const amount = parseFloat(individualAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }

    // Find the student's fund (make sure it exists)
    let fund = getStudentFund(studentForDialog.id);
    if (!fund) {
      const { data: newFund, error: nfErr } = await supabase
        .from("stationary_expense_funds")
        .insert({
          student_id: studentForDialog.id,
          initial_amount: 9000,
          total_expenses: 0,
          remaining_balance: 9000,
          academic_year: "2024-25",
          section: "A"
        })
        .select()
        .single();
      if (!newFund) {
        toast({
          title: "Error",
          description: "Could not create stationary fund for the student.",
          variant: "destructive"
        });
        return;
      }
      fund = {
        studentId: studentForDialog.id,
        studentName: `${studentForDialog.first_name} ${studentForDialog.last_name}`,
        class: studentForDialog.current_class,
        section: "A",
        academicYear: "2024-25",
        initialAmount: 9000,
        totalExpenses: 0,
        remainingBalance: 9000,
        isNegative: false,
        id: newFund.id // <-- add id for fund from database
      } as ExpenseFund & { id?: string }; // Force-allow .id, since we use it for fund_id below
      setFunds(funds => [...funds, fund!]);
    }

    // Create new expense
    const { data: exp, error: expErr } = await supabase
      .from("stationary_expenses")
      .insert({
        student_id: studentForDialog.id,
        fund_id: fund && "id" in fund && fund.id ? fund.id : "", // Use fund.id if available
        amount,
        description: individualDescription,
        academic_year: "2024-25",
        class: studentForDialog.current_class,
        section: "A",
        date: new Date().toISOString().split("T")[0],
        created_by: null // Set to null, as user.id unavailable
      })
      .select()
      .single();

    if (!exp) {
      toast({ title: "Could not add expense", description: expErr?.message, variant: "destructive" });
      return;
    }
    setExpenses(expenses => [
      ...expenses,
      {
        id: exp.id,
        studentId: studentForDialog.id,
        studentName: `${studentForDialog.first_name} ${studentForDialog.last_name}`,
        date: exp.date,
        amount,
        description: individualDescription,
        academicYear: "2024-25",
        class: studentForDialog.current_class,
        section: "A",
        type: "individual"
      }
    ]);

    // Update fund
    const updatedFund = {
      ...fund!,
      totalExpenses: Number(fund!.totalExpenses) + amount,
      remainingBalance: Number(fund!.remainingBalance) - amount,
      isNegative: Number(fund!.remainingBalance) - amount < 0,
      negativeAmount: Number(fund!.remainingBalance) - amount < 0 ? Math.abs(Number(fund!.remainingBalance) - amount) : undefined
    };

    await supabase
      .from("stationary_expense_funds")
      .update({
        total_expenses: updatedFund.totalExpenses,
        remaining_balance: updatedFund.remainingBalance
      })
      .eq("student_id", fund!.studentId);

    setFunds(funds =>
      funds.map(f =>
        f.studentId === fund!.studentId
          ? updatedFund
          : f
      )
    );

    toast({ title: "Individual Expense Added", description: `₹${amount} expense for ${studentForDialog.first_name}.` });

    setIndividualAmount("");
    setIndividualDescription("");
    setIsIndividualDialogOpen(false);
    setStudentForDialog(null);
  };

  // Add a global (common) expense (Supabase)
  const handleAddGlobalCommonExpense = async () => {
    if (!globalCommonAmount || !globalCommonDescription) {
      toast({ title: "Missing Information", description: "Please provide amount and description.", variant: "destructive" });
      return;
    }

    const amountPerStudent = parseFloat(globalCommonAmount);
    if (isNaN(amountPerStudent) || amountPerStudent <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }

    const affectedStudents = students.map(s => s.id);
    const totalAmount = amountPerStudent * affectedStudents.length;

    const { data: ceData, error: ceError } = await supabase
      .from("stationary_common_expenses")
      .insert({
        description: globalCommonDescription,
        total_amount: totalAmount,
        amount_per_student: amountPerStudent,
        date: new Date().toISOString().split("T")[0],
        academic_year: "2024-25",
        class: "All",
        section: "All",
        students_affected: affectedStudents,
        added_by: null // Use null until user.id is available from AuthContext
      })
      .select()
      .single();

    if (!ceData) {
      toast({ title: "Error", description: ceError?.message, variant: "destructive" });
      return;
    }
    setCommonExpenses(commonExpenses => [
      ...commonExpenses,
      {
        id: ceData.id,
        date: ceData.date,
        description: ceData.description,
        totalAmount: Number(ceData.total_amount),
        category: "stationary",
        class: ceData.class || "",
        section: ceData.section || "",
        academicYear: ceData.academic_year,
        studentsAffected: ceData.students_affected || [],
        amountPerStudent: Number(ceData.amount_per_student),
        addedBy: ceData.added_by || ""
      }
    ]);

    // Deduct from all affected funds
    const updatedFunds = funds.map(fund => {
      if (affectedStudents.includes(fund.studentId)) {
        const newTotal = Number(fund.totalExpenses) + amountPerStudent;
        const newBalance = Number(fund.remainingBalance) - amountPerStudent;
        supabase
          .from("stationary_expense_funds")
          .update({
            total_expenses: newTotal,
            remaining_balance: newBalance
          })
          .eq("student_id", fund.studentId);
        return {
          ...fund,
          totalExpenses: newTotal,
          remainingBalance: newBalance,
          isNegative: newBalance < 0,
          negativeAmount: newBalance < 0 ? Math.abs(newBalance) : undefined
        };
      }
      return fund;
    });
    setFunds(updatedFunds);

    toast({ title: "Global Expense Added", description: `₹${amountPerStudent} deducted from each of the ${affectedStudents.length} residential students.` });

    setGlobalCommonAmount("");
    setGlobalCommonDescription("");
  };

  // Delete an expense
  const handleDeleteExpense = async (expenseId: string, type: "individual" | "common") => {
    if (type === "individual") {
      await supabase.from("stationary_expenses").delete().eq("id", expenseId);
      setExpenses(expenses => expenses.filter(e => e.id !== expenseId));
    } else {
      await supabase.from("stationary_common_expenses").delete().eq("id", expenseId);
      setCommonExpenses(commonExpenses => commonExpenses.filter(e => e.id !== expenseId));
    }
    toast({ title: "Expense Deleted", description: "The expense has been removed." });
    setIsHistoryDialogOpen(false);
  };

  // Edit an expense — not implemented, but display toast
  const handleEditExpense = (expense: StationaryExpense | CommonExpense) => {
    toast({ title: "Edit functionality not implemented", description: "This would open an edit form." });
  };

  // Display students by selected class (support class/stream names)
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const classIdentifier = student.stream ? `${student.current_class}-${student.stream}` : student.current_class;
      return classIdentifier === selectedClass;
    });
  }, [students, selectedClass]);

  // Loading spinner
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
                          ₹{fund ? Number(fund.remainingBalance).toLocaleString() : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">Remaining Fund</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openHistoryDialog(student)}>History</Button>
                      {canAdd && (
                        <Button size="sm" onClick={() => openIndividualExpenseDialog(student)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Expense
                        </Button>
                      )}
                    </div>
                  </div>
                );
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
        canManage={canEdit && canDelete}
        onDelete={handleDeleteExpense}
        onEdit={handleEditExpense}
      />
    </div>
  );
};
