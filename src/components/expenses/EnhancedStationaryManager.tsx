
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
import { dataService } from "@/services/mockData";
import { Student, StationaryExpense, CommonExpense, ExpenseFund } from "@/types/models";

export const EnhancedStationaryManager: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [expenses, setExpenses] = useState<StationaryExpense[]>([]);
  const [commonExpenses, setCommonExpenses] = useState<CommonExpense[]>([]);
  const [funds, setFunds] = useState<ExpenseFund[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [isCommonDialogOpen, setIsCommonDialogOpen] = useState(false);
  
  // Form states
  const [selectedStudent, setSelectedStudent] = useState("");
  const [individualAmount, setIndividualAmount] = useState("");
  const [individualDescription, setIndividualDescription] = useState("");
  const [commonAmount, setCommonAmount] = useState("");
  const [commonDescription, setCommonDescription] = useState("");

  useEffect(() => {
    const studentData = dataService.getStudents().filter(s => s.residentialType === "residential");
    setStudents(studentData);
    loadMockData();
  }, []);

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
    const classes = [...new Set(students.map(s => s.class))].sort();
    return classes;
  };

  const getSectionOptions = (selectedClass: string) => {
    const sections = [...new Set(students.filter(s => s.class === selectedClass).map(s => s.section))].sort();
    return sections;
  };

  const getFilteredStudents = () => {
    return students.filter(s => 
      (!selectedClass || s.class === selectedClass) &&
      (!selectedSection || s.section === selectedSection) &&
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

    if (!student || !fund) {
      toast({
        title: "Error",
        description: "Student or fund information not found.",
        variant: "destructive",
      });
      return;
    }

    const newExpense: StationaryExpense = {
      id: `SE${Date.now()}`,
      studentId: selectedStudent,
      studentName: student.fullName,
      date: new Date().toISOString().split("T")[0],
      amount,
      description: individualDescription,
      academicYear: "2024-25",
      class: student.class,
      section: student.section,
      type: "individual"
    };

    setExpenses([...expenses, newExpense]);

    // Update fund
    const updatedFund = {
      ...fund,
      totalExpenses: fund.totalExpenses + amount,
      remainingBalance: fund.remainingBalance - amount,
      isNegative: fund.remainingBalance - amount < 0,
      negativeAmount: fund.remainingBalance - amount < 0 ? Math.abs(fund.remainingBalance - amount) : undefined
    };

    setFunds(funds.map(f => f.studentId === selectedStudent ? updatedFund : f));

    toast({
      title: "Individual Expense Added",
      description: `₹${amount} stationary expense recorded for ${student.fullName}.`,
    });

    // Reset form
    setSelectedStudent("");
    setIndividualAmount("");
    setIndividualDescription("");
    setIsIndividualDialogOpen(false);
  };

  const handleAddCommonExpense = () => {
    if (!commonAmount || !commonDescription || !selectedClass || !selectedSection) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including class and section.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(commonAmount);
    const affectedStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);
    const amountPerStudent = totalAmount / affectedStudents.length;

    const newCommonExpense: CommonExpense = {
      id: `CE${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: commonDescription,
      totalAmount,
      category: "stationary",
      class: selectedClass,
      section: selectedSection,
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

  const downloadMonthlyReport = () => {
    // Mock download functionality
    toast({
      title: "Report Downloaded",
      description: "Monthly stationary report has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stationary Management (Residential)</h2>
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
        </div>
      </div>

      {/* Class and Section Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Division</CardTitle>
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
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sections</SelectItem>
                {getSectionOptions(selectedClass).map(sec => (
                  <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
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

      <Tabs defaultValue="funds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funds">Expense Funds</TabsTrigger>
          <TabsTrigger value="individual">Individual Expenses</TabsTrigger>
          <TabsTrigger value="common">Common Expenses</TabsTrigger>
        </TabsList>

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
                {getFilteredStudents().map(student => {
                  const fund = getStudentFund(student.id);
                  if (!fund) return null;
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{student.fullName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Class {student.class}-{student.section}
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
                })}
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
                {expenses.filter(e => e.type === "individual").map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{expense.studentName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {expense.description} • {expense.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{expense.amount.toLocaleString()}</div>
                      <Badge variant="outline">Individual</Badge>
                    </div>
                  </div>
                ))}
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
                {commonExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{expense.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        Class {expense.class}-{expense.section} • {expense.date}
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
                ))}
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
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredStudents().map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} (Class {student.class}-{student.section})
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="section">Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSectionOptions(selectedClass).map(sec => (
                      <SelectItem key={sec} value={sec}>Section {sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

            {selectedClass && selectedSection && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This expense will be divided among {students.filter(s => s.class === selectedClass && s.section === selectedSection).length} students
                  {commonAmount && ` (₹${(parseFloat(commonAmount) / students.filter(s => s.class === selectedClass && s.section === selectedSection).length).toFixed(2)} per student)`}
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
    </div>
  );
};
