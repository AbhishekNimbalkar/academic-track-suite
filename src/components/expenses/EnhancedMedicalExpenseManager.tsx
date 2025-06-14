import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StudentMedicalExpenseHistoryDialog from "./StudentMedicalExpenseHistoryDialog";

// Reuse types from stationary/types for Student and ExpenseFund
import { Student, ExpenseFund } from "../expenses/stationary/types";

export interface MedicalExpense {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  doctorFee: number;
  medicalFee: number;
  total: number;
  description: string;
  academicYear: string;
  class: string;
  section: string;
}

export const EnhancedMedicalExpenseManager: React.FC = () => {
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("1");
  const [funds, setFunds] = useState<ExpenseFund[]>([]);
  const [medicalExpenses, setMedicalExpenses] = useState<MedicalExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [medicalDialogOpen, setMedicalDialogOpen] = useState(false);
  const [studentForDialog, setStudentForDialog] = useState<Student | null>(null);
  const [expenseDate, setExpenseDate] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [medicalFee, setMedicalFee] = useState("");
  const [description, setDescription] = useState("");

  // History Dialog state
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [studentForHistory, setStudentForHistory] = useState<Student | null>(null);

  // Only admin or medical role may add/edit 
  const canAdd = hasPermission("manage_medical") || hasPermission("manage_stationary") || hasPermission("medical_add_expense");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchResidentialStudents();
      loadMockData();
    } catch (error) {
      // fallback to mock data
      loadMockStudents();
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResidentialStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('residential_type', 'residential')
        .order('current_class', { ascending: true });

      if (error) throw error;
      if (studentsData && studentsData.length > 0) {
        const validStudents = studentsData.filter(s => s && s.current_class);
        setStudents(validStudents);
        return;
      }
      loadMockStudents();
    } catch {
      loadMockStudents();
    }
  };

  const loadMockStudents = () => {
    setStudents([
      { id: "STU001", student_id: "STU001", first_name: "John", last_name: "Doe", current_class: "10", residential_type: "residential" },
      { id: "STU002", student_id: "STU002", first_name: "Jane", last_name: "Smith", current_class: "10", residential_type: "residential" },
      { id: "STU003", student_id: "STU003", first_name: "Mike", last_name: "Johnson", current_class: "9", residential_type: "residential" },
      { id: "STU004", student_id: "STU004", first_name: "Sarah", last_name: "Wilson", current_class: "11", stream: "APC", residential_type: "residential" },
      { id: "STU005", student_id: "STU005", first_name: "Alex", last_name: "Brown", current_class: "1", residential_type: "residential" },
      { id: "STU006", student_id: "STU006", first_name: "Emily", last_name: "Davis", current_class: "12", stream: "USA", residential_type: "residential" }
    ]);
  };

  const loadMockData = () => {
    setFunds([
      { studentId: "STU001", studentName: "John Doe", class: "10", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 2500, remainingBalance: 6500, isNegative: false },
      { studentId: "STU002", studentName: "Jane Smith", class: "10", section: "A", academicYear: "2024-25", initialAmount: 7000, totalExpenses: 7500, remainingBalance: -500, isNegative: true, negativeAmount: 500 },
      { studentId: "STU003", studentName: "Mike Johnson", class: "9", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 3000, remainingBalance: 6000, isNegative: false },
      { studentId: "STU004", studentName: "Sarah Wilson", class: "11", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 1000, remainingBalance: 8000, isNegative: false },
      { studentId: "STU005", studentName: "Alex Brown", class: "1", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 2000, remainingBalance: 7000, isNegative: false },
      { studentId: "STU006", studentName: "Emily Davis", class: "12", section: "A", academicYear: "2024-25", initialAmount: 9000, totalExpenses: 1000, remainingBalance: 8000, isNegative: false }
    ]);
    setMedicalExpenses([]);
  };

  const getClassOptions = () => {
    const classes = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
    classes.push("11-APC", "11-USA", "12-APC", "12-USA");
    return classes;
  };

  const getStudentFund = (studentId: string) => {
    return funds.find(f => f.studentId === studentId);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const classIdentifier = student.stream ? `${student.current_class}-${student.stream}` : student.current_class;
      return classIdentifier === selectedClass;
    });
  }, [students, selectedClass]);

  // Open/close dialog helpers
  const openMedicalDialog = (student: Student) => {
    setStudentForDialog(student);
    setExpenseDate("");
    setDoctorFee("");
    setMedicalFee("");
    setDescription("");
    setMedicalDialogOpen(true);
  };

  const closeMedicalDialog = () => {
    setMedicalDialogOpen(false);
    setStudentForDialog(null);
    setExpenseDate("");
    setDoctorFee("");
    setMedicalFee("");
    setDescription("");
  };

  // Add medical expense to student
  const handleAddMedicalExpense = () => {
    if (!studentForDialog || !expenseDate || !doctorFee || !medicalFee) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    const docFeeNum = parseFloat(doctorFee);
    const medFeeNum = parseFloat(medicalFee);
    if (isNaN(docFeeNum) || isNaN(medFeeNum)) {
      toast({ title: "Invalid Amount", description: "Fees should be numbers.", variant: "destructive" });
      return;
    }
    const total = docFeeNum + medFeeNum;
    const fund = getStudentFund(studentForDialog.id);
    const expense: MedicalExpense = {
      id: `ME${Date.now()}`,
      studentId: studentForDialog.id,
      studentName: `${studentForDialog.first_name} ${studentForDialog.last_name}`,
      date: expenseDate,
      doctorFee: docFeeNum,
      medicalFee: medFeeNum,
      total,
      description,
      class: studentForDialog.current_class,
      section: "A",
      academicYear: "2024-25"
    };
    setMedicalExpenses([...medicalExpenses, expense]);
    // Deduct from fund (as per stationary logic, keep in sync)
    if (fund) {
      const updatedFund = {
        ...fund,
        totalExpenses: fund.totalExpenses + total,
        remainingBalance: fund.remainingBalance - total,
        isNegative: fund.remainingBalance - total < 0,
        negativeAmount: fund.remainingBalance - total < 0 ? Math.abs(fund.remainingBalance - total) : undefined,
      };
      setFunds(funds.map(f => f.studentId === studentForDialog.id ? updatedFund : f));
    }
    toast({
      title: "Medical Expense Added",
      description: `₹${total} added for ${studentForDialog.first_name}. Fund auto-updated.`,
    });
    closeMedicalDialog();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medical Expense Management (Residential Students)</h2>
      </div>
      {/* Class Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Medical Expenses</CardTitle>
          <div className="flex gap-4 pt-2">
            <div className="w-64">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
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
                    <p className={`text-xs mt-1 ${fund?.isNegative ? 'text-red-600' : 'text-green-700'} font-bold`}>
                      {fund ? (
                        <>
                          Remaining Fund: ₹{fund.remainingBalance.toLocaleString()}
                        </>
                      ) : (
                        <>
                          Fund: N/A
                          <span className="text-xs text-orange-500 block">
                            (No fund found for ID: {student.id})
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-medium ${fund?.isNegative ? 'text-red-500' : ''}`}>
                        ₹{fund ? fund.remainingBalance.toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Remaining Fund</p>
                    </div>
                    {/* History Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setStudentForHistory(student);
                        setHistoryDialogOpen(true);
                      }}
                    >
                      <span className="mr-1">History</span>
                    </Button>
                    {/* Add medical expense (admin or medical roles only) */}
                    {canAdd && (
                      <Button size="sm" onClick={() => openMedicalDialog(student)}>
                        <Plus className="h-4 w-4 mr-1" /> Add Medical
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

      {/* Add Medical Dialog */}
      {medicalDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">
              Add Medical Expense for <span className="text-primary">{studentForDialog?.first_name} {studentForDialog?.last_name}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
              </div>
              <div>
                <Label>Doctor Fee (₹)</Label>
                <Input type="number" value={doctorFee} onChange={e => setDoctorFee(e.target.value)} />
              </div>
              <div>
                <Label>Medical Fee (₹)</Label>
                <Input type="number" value={medicalFee} onChange={e => setMedicalFee(e.target.value)} />
              </div>
              <div>
                <Label>Description <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input type="text" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={closeMedicalDialog}>Cancel</Button>
                <Button onClick={handleAddMedicalExpense}>Add Expense</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Expense History Dialog */}
      <StudentMedicalExpenseHistoryDialog
        isOpen={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        studentName={
          studentForHistory
            ? `${studentForHistory.first_name} ${studentForHistory.last_name}`
            : ""
        }
        expenses={
          studentForHistory
            ? medicalExpenses.filter((e) => e.studentId === studentForHistory.id)
            : []
        }
      />
    </div>
  );
};

export default EnhancedMedicalExpenseManager;
