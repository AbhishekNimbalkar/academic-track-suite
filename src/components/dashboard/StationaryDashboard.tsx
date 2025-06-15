
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Calendar,
  Eye,
  UserCheck
} from "lucide-react";

export const StationaryDashboard: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("current");

  // Mock data
  const summaryData = {
    totalCommonExpenses: 45000,
    totalIndividualExpenses: 32000,
    totalRemainingBalance: 18000,
    negativeBalanceStudents: 8
  };

  const classData = [
    {
      className: "Class 10-A",
      studentCount: 35,
      commonExpenses: 12000,
      individualExpenses: 8500,
      remainingBalance: 4500
    },
    {
      className: "Class 10-B",
      studentCount: 32,
      commonExpenses: 11500,
      individualExpenses: 7800,
      remainingBalance: 3200
    },
    {
      className: "Class 9-A",
      studentCount: 38,
      commonExpenses: 13200,
      individualExpenses: 9200,
      remainingBalance: 5800
    },
    {
      className: "Class 9-B",
      studentCount: 34,
      commonExpenses: 8300,
      individualExpenses: 6500,
      remainingBalance: 4500
    }
  ];

  const studentData = [
    {
      studentName: "Rahul Sharma",
      allocatedFund: 2000,
      usedFund: 1650,
      commonExpenses: 450,
      individualExpenses: 1200,
      currentBalance: 350,
      status: "Good"
    },
    {
      studentName: "Priya Patel",
      allocatedFund: 2000,
      usedFund: 2150,
      commonExpenses: 500,
      individualExpenses: 1650,
      currentBalance: -150,
      status: "Due"
    },
    {
      studentName: "Amit Kumar",
      allocatedFund: 2000,
      usedFund: 1800,
      commonExpenses: 400,
      individualExpenses: 1400,
      currentBalance: 200,
      status: "Good"
    }
  ];

  const negativeBalanceStudents = [
    { name: "Priya Patel", class: "Class 10-A", negativeAmount: 150 },
    { name: "Vikram Singh", class: "Class 10-B", negativeAmount: 200 },
    { name: "Sneha Reddy", class: "Class 9-A", negativeAmount: 75 },
    { name: "Arjun Mehta", class: "Class 9-B", negativeAmount: 125 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Common Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{summaryData.totalCommonExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Shared across all students
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Individual Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{summaryData.totalIndividualExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Student-specific purchases
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Remaining Balance
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{summaryData.totalRemainingBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Available for future expenses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Negative Balance Students
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryData.negativeBalanceStudents}</div>
            <p className="text-xs text-gray-500 mt-1">
              Click to view details
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Period</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  <SelectItem value="10-A">Class 10-A</SelectItem>
                  <SelectItem value="10-B">Class 10-B</SelectItem>
                  <SelectItem value="9-A">Class 9-A</SelectItem>
                  <SelectItem value="9-B">Class 9-B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Students</SelectItem>
                  <SelectItem value="rahul">Rahul Sharma</SelectItem>
                  <SelectItem value="priya">Priya Patel</SelectItem>
                  <SelectItem value="amit">Amit Kumar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Expense Table */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Class-wise Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Common Expenses</TableHead>
                <TableHead>Individual Expenses</TableHead>
                <TableHead>Remaining Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.map((classItem, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{classItem.className}</TableCell>
                  <TableCell>{classItem.studentCount} students</TableCell>
                  <TableCell>₹{classItem.commonExpenses.toLocaleString()}</TableCell>
                  <TableCell>₹{classItem.individualExpenses.toLocaleString()}</TableCell>
                  <TableCell>₹{classItem.remainingBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student-wise Expense Table (shown when class is selected) */}
      {selectedClass && (
        <Card className="bg-white shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Student-wise Expenses - Class {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Allocated Fund</TableHead>
                  <TableHead>Used Fund</TableHead>
                  <TableHead>Common Expenses</TableHead>
                  <TableHead>Individual Expenses</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{student.studentName}</TableCell>
                    <TableCell>₹{student.allocatedFund.toLocaleString()}</TableCell>
                    <TableCell>₹{student.usedFund.toLocaleString()}</TableCell>
                    <TableCell>₹{student.commonExpenses.toLocaleString()}</TableCell>
                    <TableCell>₹{student.individualExpenses.toLocaleString()}</TableCell>
                    <TableCell className={student.currentBalance < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                      ₹{student.currentBalance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Good" ? "default" : "destructive"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Negative Balance Alert Section */}
      <Card className="bg-red-50 border-red-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Students with Negative Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {negativeBalanceStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-red-600 font-semibold">
                    -₹{student.negativeAmount.toLocaleString()}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Adjust
                    </Button>
                    <Button variant="default" size="sm">
                      Notify
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
