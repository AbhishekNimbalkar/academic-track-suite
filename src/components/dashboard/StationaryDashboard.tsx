
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, DollarSign, TrendingUp, 
  ShoppingCart, AlertTriangle, Eye, RefreshCw, CheckCircle, XCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the dashboard
const mockStudents = [
  { id: "STU001", name: "Ramesh Patil", class: "5", fund: 9000, commonExp: 300, individualExp: 1200, balance: 7500, status: "good" },
  { id: "STU002", name: "Sita Yadav", class: "5", fund: 7000, commonExp: 300, individualExp: 7200, balance: -500, status: "due" },
  { id: "STU003", name: "Rohit Shinde", class: "6", fund: 9000, commonExp: 400, individualExp: 8850, balance: -250, status: "due" },
  { id: "STU004", name: "Priya Sharma", class: "5", fund: 9000, commonExp: 300, individualExp: 2000, balance: 6700, status: "good" },
  { id: "STU005", name: "Amit Kumar", class: "6", fund: 9000, commonExp: 400, individualExp: 3500, balance: 5100, status: "good" },
  { id: "STU006", name: "Kavya Singh", class: "7", fund: 7000, commonExp: 250, individualExp: 4500, balance: 2250, status: "good" },
  { id: "STU007", name: "Dev Patel", class: "7", fund: 9000, commonExp: 250, individualExp: 6000, balance: 2750, status: "good" },
  { id: "STU008", name: "Anita Joshi", class: "8", fund: 9000, commonExp: 350, individualExp: 8900, balance: -250, status: "due" }
];

const mockCommonExpenses = [
  { id: "CE001", class: "5", description: "Books for all students", amount: 300, date: "2024-01-15" },
  { id: "CE002", class: "6", description: "Chart papers", amount: 400, date: "2024-01-20" },
  { id: "CE003", class: "7", description: "Art supplies", amount: 250, date: "2024-01-18" },
  { id: "CE004", class: "8", description: "Science kits", amount: 350, date: "2024-01-22" }
];

export const StationaryDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [viewingClass, setViewingClass] = useState<string | null>(null);

  // Calculate summary metrics
  const totalCommonExpenses = mockCommonExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIndividualExpenses = mockStudents.reduce((sum, student) => sum + student.individualExp, 0);
  const totalRemainingBalance = mockStudents.reduce((sum, student) => sum + Math.max(0, student.balance), 0);
  const negativeBalanceStudents = mockStudents.filter(student => student.balance < 0);

  // Filter students based on selected filters
  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student => {
      if (selectedClass && student.class !== selectedClass) return false;
      if (selectedStudent && !student.name.toLowerCase().includes(selectedStudent.toLowerCase())) return false;
      return true;
    });
  }, [selectedClass, selectedStudent]);

  // Calculate class-wise data
  const classWiseData = useMemo(() => {
    const classes = Array.from(new Set(filteredStudents.map(s => s.class)));
    return classes.map(cls => {
      const classStudents = filteredStudents.filter(s => s.class === cls);
      const totalCommonExp = classStudents.reduce((sum, s) => sum + s.commonExp, 0);
      const totalIndividualExp = classStudents.reduce((sum, s) => sum + s.individualExp, 0);
      const totalBalance = classStudents.reduce((sum, s) => sum + s.balance, 0);
      
      return {
        class: cls,
        studentCount: classStudents.length,
        totalCommonExp,
        totalIndividualExp,
        totalBalance
      };
    });
  }, [filteredStudents]);

  // Students for selected class
  const classStudents = viewingClass ? filteredStudents.filter(s => s.class === viewingClass) : [];

  const getStatusIcon = (status: string) => {
    return status === "good" ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (status: string) => {
    return status === "good" ? "✅ Good" : "❌ Due";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Stationary Dashboard</h1>
        <p className="text-gray-600">Manage and monitor stationary expenses across all classes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              💸 Total Common Expenses
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">₹{totalCommonExpenses.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">Across all classes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              🧾 Total Individual Expenses
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">₹{totalIndividualExpenses.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Student purchases</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              🔄 Total Remaining Balance
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">₹{totalRemainingBalance.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 mt-1">Available funds</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              ❌ Negative Balance Students
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{negativeBalanceStudents.length}</div>
            <p className="text-xs text-red-600 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">🔍 Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="month" className="text-sm font-medium">Select Month / Date Range</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All months</SelectItem>
                  <SelectItem value="january">January 2024</SelectItem>
                  <SelectItem value="february">February 2024</SelectItem>
                  <SelectItem value="march">March 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="text-sm font-medium">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All classes</SelectItem>
                  <SelectItem value="5">Class 5</SelectItem>
                  <SelectItem value="6">Class 6</SelectItem>
                  <SelectItem value="7">Class 7</SelectItem>
                  <SelectItem value="8">Class 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student" className="text-sm font-medium">Select Student</Label>
              <Input
                id="student"
                placeholder="Search student name..."
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Expense Table */}
      {!viewingClass && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">📊 Class-wise Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">No. of Students</TableHead>
                    <TableHead className="font-semibold">Total Common Exp.</TableHead>
                    <TableHead className="font-semibold">Total Individual Exp.</TableHead>
                    <TableHead className="font-semibold">Total Balance</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classWiseData.map((classData) => (
                    <TableRow key={classData.class} className="hover:bg-gray-50">
                      <TableCell className="font-medium">Class {classData.class}</TableCell>
                      <TableCell>{classData.studentCount}</TableCell>
                      <TableCell>₹{classData.totalCommonExp.toLocaleString()}</TableCell>
                      <TableCell>₹{classData.totalIndividualExp.toLocaleString()}</TableCell>
                      <TableCell className={classData.totalBalance < 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                        ₹{classData.totalBalance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingClass(classData.class)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {classWiseData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No data available with current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student-wise Expense Table (shown when class is selected) */}
      {viewingClass && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">👥 Class {viewingClass} - Student-wise Expenses</CardTitle>
            <Button variant="outline" onClick={() => setViewingClass(null)} className="hover:bg-gray-50">
              ← Back to Classes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold">Fund</TableHead>
                    <TableHead className="font-semibold">Common Exp.</TableHead>
                    <TableHead className="font-semibold">Individual Exp.</TableHead>
                    <TableHead className="font-semibold">Balance</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>₹{student.fund.toLocaleString()}</TableCell>
                      <TableCell>₹{student.commonExp.toLocaleString()}</TableCell>
                      <TableCell>₹{student.individualExp.toLocaleString()}</TableCell>
                      <TableCell className={student.balance < 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                        ₹{student.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(student.status)}
                          <span className={student.status === "good" ? "text-green-600" : "text-red-600"}>
                            {getStatusText(student.status)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {classStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No students in this class
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Negative Balance Alert Section */}
      {negativeBalanceStudents.length > 0 && (
        <Card className="border-red-200 bg-red-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-6 w-6" />
              🚨 Negative Balance Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-100">
                    <TableHead className="font-semibold text-red-800">Student Name</TableHead>
                    <TableHead className="font-semibold text-red-800">Class</TableHead>
                    <TableHead className="font-semibold text-red-800">Balance</TableHead>
                    <TableHead className="font-semibold text-red-800">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {negativeBalanceStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-red-100">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>Class {student.class}</TableCell>
                      <TableCell className="text-red-600 font-bold">₹{student.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Adjust / Notify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
