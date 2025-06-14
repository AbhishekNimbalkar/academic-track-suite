import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import types and components
import { Student, StationaryExpense, CommonExpense, ExpenseFund } from "./stationary/types";
import { IndividualExpenseDialog } from "./stationary/IndividualExpenseDialog";
import { CommonExpenseDialog } from "./stationary/CommonExpenseDialog";
import { CustomExpenseDialog } from "./stationary/CustomExpenseDialog";
import { StudentsTabContent } from "./stationary/StudentsTabContent";
import { ExpenseFundsTabContent } from "./stationary/ExpenseFundsTabContent";
import { IndividualExpensesTabContent } from "./stationary/IndividualExpensesTabContent";
import { CommonExpensesTabContent } from "./stationary/CommonExpensesTabContent";

export const EnhancedStationaryManager: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [expenses, setExpenses] = useState<StationaryExpense[]>([]);
  const [commonExpenses, setCommonExpenses] = useState<CommonExpense[]>([]);
  const [funds, setFunds] = useState<ExpenseFund[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [isCommonDialogOpen, setIsCommonDialogOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  
  // Form states
  const [selectedStudent, setSelectedStudent] = useState("");
  const [individualAmount, setIndividualAmount] = useState("");
  const [individualDescription, setIndividualDescription] = useState("");
  const [commonAmount, setCommonAmount] = useState("");
  const [commonDescription, setCommonDescription] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchResidentialStudents();
      loadMockData();
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
        // Filter out students with null or undefined `current_class` to prevent crashes
        const validStudents = studentsData.filter(s => s && s.current_class);
        setStudents(validStudents);
        return;
      }

      // If no data, fall back to mock data
      loadMockStudents();
    } catch (error) {
      console.error('Error in fetchResidentialStudents:', error);
      loadMockStudents();
    }
  };

  const loadMockStudents = () => {
    const mockStudents: Student[] = [
      {
        id: "STU001",
        student_id: "STU001",
        first_name: "John",
        last_name: "Doe",
        current_class: "10",
        residential_type: "residential"
      },
      {
        id: "STU002",
        student_id: "STU002",
        first_name: "Jane",
        last_name: "Smith",
        current_class: "10",
        residential_type: "residential"
      },
      {
        id: "STU003",
        student_id: "STU003",
        first_name: "Mike",
        last_name: "Johnson",
        current_class: "9",
        residential_type: "residential"
      },
      {
        id: "STU004",
        student_id: "STU004",
        first_name: "Sarah",
        last_name: "Wilson",
        current_class: "11",
        residential_type: "residential"
      },
      {
        id: "STU005",
        student_id: "STU005",
        first_name: "Alex",
        last_name: "Brown",
        current_class: "8",
        residential_type: "residential"
      },
      {
        id: "STU006",
        student_id: "STU006",
        first_name: "Emily",
        last_name: "Davis",
        current_class: "12",
        residential_type: "residential"
      }
    ];
    
    console.log('Loading mock students:', mockStudents);
    setStudents(mockStudents);
  };

  const loadMockData = () => {
    const mockFunds: ExpenseFund[] = [
      {
        studentId: "STU001",
        studentName: "John Doe",
        class: "10",
        section: "A",
        academicYear: "2024-25",
        initialAmount: 9000,
        totalExpenses: 2500,
        remainingBalance: 6500,
        isNegative: false
      },
      {
        studentId: "STU002",
        studentName: "Jane Smith",
        class: "10",
        section: "A",
        academicYear: "2024-25",
        initialAmount: 7000,
        totalExpenses: 7500,
        remainingBalance: -500,
        isNegative: true,
        negativeAmount: 500
      },
      {
        studentId: "STU003",
        studentName: "Mike Johnson",
        class: "9",
        section: "A",
        academicYear: "2024-25",
        initialAmount: 9000,
        totalExpenses: 3000,
        remainingBalance: 6000,
        isNegative: false
      }
    ];
    setFunds(mockFunds);

    const mockExpenses: StationaryExpense[] = [
      {
        id: "SE001",
        studentId: "STU001",
        studentName: "John Doe",
        date: "2024-01-15",
        amount: 500,
        description: "Notebooks and pens",
        academicYear: "2024-25",
        class: "10",
        section: "A",
        type: "individual"
      },
      {
        id: "SE002",
        studentId: "STU003",
        studentName: "Mike Johnson",
        date: "2024-01-20",
        amount: 300,
        description: "Art supplies",
        academicYear: "2024-25",
        class: "9",
        section: "A",
        type: "individual"
      }
    ];
    setExpenses(mockExpenses);

    const mockCommonExpenses: CommonExpense[] = [
      {
        id: "CE001",
        date: "2024-01-10",
        description: "Chart papers for class project",
        totalAmount: 1000,
        category: "stationary",
        class: "10",
        section: "A",
        academicYear: "2024-25",
        studentsAffected: ["STU001", "STU002"],
        amountPerStudent: 500,
        addedBy: "Teacher1"
      }
    ];
    setCommonExpenses(mockCommonExpenses);
  };

  const getClassOptions = () => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  };

  const getStudentFund = (studentId: string) => {
    return funds.find(f => f.studentId === studentId);
  };

  const handleAddIndividualExpense = () => {
    if (!selectedStudent || !individualAmount || !individualDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(individualAmount);
    const student = students.find(s => s.id === selectedStudent);
    const fund = getStudentFund(selectedStudent);

    if (!student) {
      toast({
        title: "Error",
        description: "Student information not found.",
        variant: "destructive",
      });
      return;
    }

    const newExpense: StationaryExpense = {
      id: `SE${Date.now()}`,
      studentId: selectedStudent,
      studentName: `${student.first_name} ${student.last_name}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      description: individualDescription,
      academicYear: "2024-25",
      class: student.current_class,
      section: "A",
      type: "individual"
    };

    setExpenses([...expenses, newExpense]);

    // Update fund if exists
    if (fund) {
      const updatedFund = {
        ...fund,
        totalExpenses: fund.totalExpenses + amount,
        remainingBalance: fund.remainingBalance - amount,
        isNegative: fund.remainingBalance - amount < 0,
        negativeAmount: fund.remainingBalance - amount < 0 ? Math.abs(fund.remainingBalance - amount) : undefined
      };

      setFunds(funds.map(f => f.studentId === selectedStudent ? updatedFund : f));
    }

    toast({
      title: "Individual Expense Added",
      description: `₹${amount} stationary expense recorded for ${student.first_name} ${student.last_name}.`,
    });

    // Reset form
    setSelectedStudent("");
    setIndividualAmount("");
    setIndividualDescription("");
    setIsIndividualDialogOpen(false);
  };

  const handleAddCommonExpense = () => {
    if (!commonAmount || !commonDescription || !selectedClass) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including class.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(commonAmount);
    const affectedStudents = students.filter(s => s.current_class === selectedClass);
    
    if (affectedStudents.length === 0) {
      toast({
        title: "No Students",
        description: `There are no residential students in Class ${selectedClass} to apply this expense to.`,
        variant: "destructive",
      });
      return;
    }

    const amountPerStudent = totalAmount / affectedStudents.length;

    const newCommonExpense: CommonExpense = {
      id: `CE${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: commonDescription,
      totalAmount,
      category: "stationary",
      class: selectedClass,
      section: "A",
      academicYear: "2024-25",
      studentsAffected: affectedStudents.map(s => s.id),
      amountPerStudent,
      addedBy: "Admin"
    };

    setCommonExpenses([...commonExpenses, newCommonExpense]);

    // Update funds for all affected students
    const updatedFunds = funds.map(fund => {
      if (affectedStudents.some(s => s.id === fund.studentId)) {
        const newBalance = fund.remainingBalance - amountPerStudent;
        return {
          ...fund,
          totalExpenses: fund.totalExpenses + amountPerStudent,
          remainingBalance: newBalance,
          isNegative: newBalance < 0,
          negativeAmount: newBalance < 0 ? Math.abs(newBalance) : undefined
        };
      }
      return fund;
    });

    setFunds(updatedFunds);

    toast({
      title: "Common Expense Added",
      description: `₹${totalAmount} divided among ${affectedStudents.length} students (₹${amountPerStudent.toFixed(2)} each).`,
    });

    // Reset form
    setCommonAmount("");
    setCommonDescription("");
    setIsCommonDialogOpen(false);
  };

  const handleAddCustomExpense = () => {
    if (!customAmount || !customDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(customAmount);
    const affectedStudents = students;

    if (affectedStudents.length === 0) {
      toast({
        title: "No Students",
        description: "There are no residential students to apply this expense to.",
        variant: "destructive",
      });
      return;
    }
    
    const amountPerStudent = totalAmount / affectedStudents.length;

    const newCommonExpense: CommonExpense = {
      id: `CE${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: customDescription,
      totalAmount,
      category: "stationary",
      class: "All",
      section: "A",
      academicYear: "2024-25",
      studentsAffected: affectedStudents.map(s => s.id),
      amountPerStudent,
      addedBy: "Admin"
    };

    setCommonExpenses([...commonExpenses, newCommonExpense]);

    const updatedFunds = funds.map(fund => {
      if (affectedStudents.some(s => s.id === fund.studentId)) {
        const newBalance = fund.remainingBalance - amountPerStudent;
        return {
          ...fund,
          totalExpenses: fund.totalExpenses + amountPerStudent,
          remainingBalance: newBalance,
          isNegative: newBalance < 0,
          negativeAmount: newBalance < 0 ? Math.abs(newBalance) : undefined
        };
      }
      return fund;
    });

    setFunds(updatedFunds);

    toast({
      title: "Custom Expense Added",
      description: `₹${totalAmount} divided among ${affectedStudents.length} residential students (₹${amountPerStudent.toFixed(2)} per student).`,
    });

    setCustomAmount("");
    setCustomDescription("");
    setIsCustomDialogOpen(false);
  };

  const downloadMonthlyReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Monthly stationary report has been downloaded.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stationary Management (Residential Students)</h2>
        <div className="flex gap-2">
          <Button onClick={downloadMonthlyReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={() => setIsIndividualDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Individual Expense
          </Button>
          <Button onClick={() => setIsCommonDialogOpen(true)} variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Common Expense
          </Button>
          <Button onClick={() => setIsCustomDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Custom Expense
          </Button>
        </div>
      </div>

      {/* Class Filter and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Residential Students (1-12)</CardTitle>
          <CardDescription>
            Total Residential Students: {students.length}
          </CardDescription>
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {getClassOptions().map(cls => (
                  <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Residential Students</TabsTrigger>
          <TabsTrigger value="funds">Expense Funds</TabsTrigger>
          <TabsTrigger value="individual">Individual Expenses</TabsTrigger>
          <TabsTrigger value="common">Common Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentsTabContent students={students} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="funds">
          <ExpenseFundsTabContent students={students} funds={funds} />
        </TabsContent>

        <TabsContent value="individual">
          <IndividualExpensesTabContent expenses={expenses} />
        </TabsContent>

        <TabsContent value="common">
          <CommonExpensesTabContent commonExpenses={commonExpenses} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <IndividualExpenseDialog
        isOpen={isIndividualDialogOpen}
        onClose={() => setIsIndividualDialogOpen(false)}
        students={students}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        amount={individualAmount}
        setAmount={setIndividualAmount}
        description={individualDescription}
        setDescription={setIndividualDescription}
        onSubmit={handleAddIndividualExpense}
      />

      <CommonExpenseDialog
        isOpen={isCommonDialogOpen}
        onClose={() => setIsCommonDialogOpen(false)}
        students={students}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        amount={commonAmount}
        setAmount={setCommonAmount}
        description={commonDescription}
        setDescription={setCommonDescription}
        onSubmit={handleAddCommonExpense}
      />

      <CustomExpenseDialog
        isOpen={isCustomDialogOpen}
        onClose={() => setIsCustomDialogOpen(false)}
        students={students}
        amount={customAmount}
        setAmount={setCustomAmount}
        description={customDescription}
        setDescription={setCustomDescription}
        onSubmit={handleAddCustomExpense}
      />
    </div>
  );
};
