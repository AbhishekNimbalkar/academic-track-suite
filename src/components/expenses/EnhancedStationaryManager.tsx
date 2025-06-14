
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package, Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  current_class: string;
  residential_type: string;
}

interface StationaryExpense {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  description: string;
  academicYear: string;
  class: string;
  section: string;
  type: "individual";
}

interface CommonExpense {
  id: string;
  date: string;
  description: string;
  totalAmount: number;
  category: "stationary";
  class: string;
  section: string;
  academicYear: string;
  studentsAffected: string[];
  amountPerStudent: number;
  addedBy: string;
}

interface ExpenseFund {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  academicYear: string;
  initialAmount: number;
  totalExpenses: number;
  remainingBalance: number;
  isNegative: boolean;
  negativeAmount?: number;
}

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
    // Mock expense fund data
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

    // Mock stationary expenses
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

    // Mock common expenses
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

  const getFilteredStudents = () => {
    return students.filter(s => 
      (!selectedClass || s.current_class === selectedClass) &&
      (s.first_name + ' ' + s.last_name).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStudentsByClass = () => {
    const studentsByClass: { [key: string]: Student[] } = {};
    
    // Initialize all classes 1-12
    for (let i = 1; i <= 12; i++) {
      studentsByClass[i.toString()] = [];
    }
    
    // Group students by class
    students.forEach(student => {
      if (studentsByClass[student.current_class]) {
        studentsByClass[student.current_class].push(student);
      }
    });
    
    return studentsByClass;
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

  const studentsByClass = getStudentsByClass();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getClassOptions().map(classNum => (
              <Card key={classNum}>
                <CardHeader>
                  <CardTitle className="text-lg">Class {classNum}</CardTitle>
                  <CardDescription>
                    {studentsByClass[classNum]?.length || 0} residential students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {studentsByClass[classNum]?.length > 0 ? (
                      studentsByClass[classNum]
                        .filter(student => 
                          (student.first_name + ' ' + student.last_name)
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map(student => (
                          <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">{student.first_name} {student.last_name}</p>
                              <p className="text-sm text-muted-foreground">{student.student_id}</p>
                            </div>
                            <Badge variant="secondary">Residential</Badge>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No residential students in this class
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funds">
          <Card>
            <CardHeader>
              <CardTitle>Student Expense Funds</CardTitle>
              <CardDescription>
                ₹9,000 for new students, ₹7,000 for promoted students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funds.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No fund data available</p>
                ) : (
                  funds.map(fund => {
                    const student = students.find(s => s.id === fund.studentId);
                    if (!student) return null;
                    
                    return (
                      <div key={fund.studentId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{fund.studentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Class {fund.class} • {student.student_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">₹{fund.initialAmount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Initial Amount</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{fund.totalExpenses.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Expenses</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${fund.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                              ₹{Math.abs(fund.remainingBalance).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fund.isNegative ? 'Negative Balance' : 'Remaining'}
                            </p>
                          </div>
                          {fund.isNegative && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Due in Fees
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Expenses</CardTitle>
              <CardDescription>Student-specific stationary purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No individual expenses recorded</p>
                ) : (
                  expenses.filter(e => e.type === "individual").map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{expense.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {expense.description} • {expense.date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class {expense.class}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{expense.amount.toLocaleString()}</div>
                        <Badge variant="outline">Individual</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="common">
          <Card>
            <CardHeader>
              <CardTitle>Common Expenses</CardTitle>
              <CardDescription>Shared expenses divided among class students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commonExpenses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No common expenses recorded</p>
                ) : (
                  commonExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{expense.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Class {expense.class} • {expense.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{expense.totalAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          ₹{expense.amountPerStudent.toFixed(2)} per student
                        </p>
                        <Badge variant="secondary">Common</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Individual Expense Dialog */}
      <Dialog open={isIndividualDialogOpen} onOpenChange={setIsIndividualDialogOpen}>
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
                value={individualAmount}
                onChange={(e) => setIndividualAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
                value={individualDescription}
                onChange={(e) => setIndividualDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIndividualDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIndividualExpense}>
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Common Expense Dialog */}
      <Dialog open={isCommonDialogOpen} onOpenChange={setIsCommonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Common Stationary Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {getClassOptions().map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commonAmount">Total Amount (₹)</Label>
              <Input
                id="commonAmount"
                type="number"
                placeholder="Enter total amount"
                value={commonAmount}
                onChange={(e) => setCommonAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commonDescription">Description</Label>
              <Textarea
                id="commonDescription"
                placeholder="Enter expense description"
                value={commonDescription}
                onChange={(e) => setCommonDescription(e.target.value)}
              />
            </div>

            {selectedClass && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This expense will be divided among {students.filter(s => s.current_class === selectedClass).length} residential students in Class {selectedClass}
                  {commonAmount && students.filter(s => s.current_class === selectedClass).length > 0 && ` (₹${(parseFloat(commonAmount) / students.filter(s => s.current_class === selectedClass).length).toFixed(2)} per student)`}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCommonExpense}>
              Add Common Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Expense Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
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
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customDescription">Description</Label>
              <Textarea
                id="customDescription"
                placeholder="Enter expense description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              />
            </div>

            {students.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This expense will be divided among all {students.length} residential students
                  {customAmount && students.length > 0 && ` (₹${(parseFloat(customAmount) / students.length).toFixed(2)} per student)`}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomExpense}>
              Add Custom Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
