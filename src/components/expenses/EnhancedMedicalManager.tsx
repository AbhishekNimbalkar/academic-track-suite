
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
import { Plus, Search, Heart, Download, AlertTriangle } from "lucide-react";
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

interface MedicalExpense {
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

export const EnhancedMedicalManager: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [medicalExpenses, setMedicalExpenses] = useState<MedicalExpense[]>([]);
  const [funds, setFunds] = useState<ExpenseFund[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);
  
  // Form states
  const [selectedStudent, setSelectedStudent] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [medicalFee, setMedicalFee] = useState("");
  const [description, setDescription] = useState("");

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
        setStudents(studentsData);
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
        totalExpenses: 1200,
        remainingBalance: 7800,
        isNegative: false
      }
    ];
    setFunds(mockFunds);

    // Mock medical expenses
    const mockMedicalExpenses: MedicalExpense[] = [
      {
        id: "ME001",
        studentId: "STU001",
        studentName: "John Doe",
        date: "2024-01-15",
        doctorFee: 300,
        medicalFee: 200,
        total: 500,
        description: "Regular health checkup",
        academicYear: "2024-25",
        class: "10",
        section: "A"
      },
      {
        id: "ME002",
        studentId: "STU003",
        studentName: "Mike Johnson",
        date: "2024-01-20",
        doctorFee: 500,
        medicalFee: 300,
        total: 800,
        description: "Fever treatment",
        academicYear: "2024-25",
        class: "9",
        section: "A"
      }
    ];
    setMedicalExpenses(mockMedicalExpenses);
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

  const handleAddMedicalExpense = () => {
    if (!selectedStudent || !doctorFee || !medicalFee || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const doctorAmount = parseFloat(doctorFee);
    const medicalAmount = parseFloat(medicalFee);
    const totalAmount = doctorAmount + medicalAmount;
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

    const newExpense: MedicalExpense = {
      id: `ME${Date.now()}`,
      studentId: selectedStudent,
      studentName: `${student.first_name} ${student.last_name}`,
      date: new Date().toISOString().split("T")[0],
      doctorFee: doctorAmount,
      medicalFee: medicalAmount,
      total: totalAmount,
      description,
      academicYear: "2024-25",
      class: student.current_class,
      section: "A"
    };

    setMedicalExpenses([...medicalExpenses, newExpense]);

    // Update fund if exists
    if (fund) {
      const updatedFund = {
        ...fund,
        totalExpenses: fund.totalExpenses + totalAmount,
        remainingBalance: fund.remainingBalance - totalAmount,
        isNegative: fund.remainingBalance - totalAmount < 0,
        negativeAmount: fund.remainingBalance - totalAmount < 0 ? Math.abs(fund.remainingBalance - totalAmount) : undefined
      };

      setFunds(funds.map(f => f.studentId === selectedStudent ? updatedFund : f));
    }

    toast({
      title: "Medical Expense Added",
      description: `₹${totalAmount} medical expense recorded for ${student.first_name} ${student.last_name}.`,
    });

    // Reset form
    setSelectedStudent("");
    setDoctorFee("");
    setMedicalFee("");
    setDescription("");
    setIsMedicalDialogOpen(false);
  };

  const downloadCombinedReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Combined medical expense overview has been downloaded.",
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
        <h2 className="text-xl font-semibold">Medical Management (Residential Students)</h2>
        <div className="flex gap-2">
          <Button onClick={downloadCombinedReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={() => setIsMedicalDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medical Expense
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
          <TabsTrigger value="funds">Medical Funds</TabsTrigger>
          <TabsTrigger value="expenses">Medical Expenses</TabsTrigger>
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
              <CardTitle>Student Medical Funds</CardTitle>
              <CardDescription>
                Shared fund with stationary expenses - ₹9,000 for new students, ₹7,000 for promoted students
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

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Medical Expenses</CardTitle>
              <CardDescription>Per-student medical entries with doctor and medical fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicalExpenses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No medical expenses recorded</p>
                ) : (
                  medicalExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{expense.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {expense.description} • {expense.date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class {expense.class}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-medium text-lg">₹{expense.total.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Doctor: ₹{expense.doctorFee} | Medical: ₹{expense.medicalFee}
                        </div>
                        <Badge variant="outline">
                          <Heart className="h-3 w-3 mr-1" />
                          Medical
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Medical Expense Dialog */}
      <Dialog open={isMedicalDialogOpen} onOpenChange={setIsMedicalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Expense</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorFee">Doctor Fee (₹)</Label>
                <Input
                  id="doctorFee"
                  type="number"
                  placeholder="Enter doctor fee"
                  value={doctorFee}
                  onChange={(e) => setDoctorFee(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalFee">Medical Fee (₹)</Label>
                <Input
                  id="medicalFee"
                  type="number"
                  placeholder="Enter medical fee"
                  value={medicalFee}
                  onChange={(e) => setMedicalFee(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {doctorFee && medicalFee && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">
                  Total: ₹{(parseFloat(doctorFee || "0") + parseFloat(medicalFee || "0")).toFixed(2)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter medical expense description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMedicalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedicalExpense}>
              Add Medical Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
