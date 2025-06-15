
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StationaryDashboard: React.FC = () => {
  // Mock data based on your requirements
  const totalCommonExpenses = 12500;
  const totalIndividualExpenses = 19500;
  const totalAllocated = 50000;
  const totalExpenses = totalCommonExpenses + totalIndividualExpenses;
  const totalRemainingBalance = totalAllocated - totalExpenses;
  const negativeBalanceStudents = 3;

  const recentStudentExpenses = [
    { id: 1, studentName: "Ravi Kumar", item: "Graph Book", amount: 150, date: "2025-06-14", class: "10" },
    { id: 2, studentName: "Sunita Sharma", item: "Geometry Box", amount: 250, date: "2025-06-13", class: "9" },
    { id: 3, studentName: "Anil Singh", item: "Crayons Set", amount: 300, date: "2025-06-12", class: "11" },
    { id: 4, studentName: "Priya Das", item: "Lab Journal", amount: 180, date: "2025-06-11", class: "12" },
    { id: 5, studentName: "Amit Patel", item: "Paint Brush", amount: 120, date: "2025-06-10", class: "10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Common Expenses
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommonExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Shared item expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Individual Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalIndividualExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Student-specific expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Remaining Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRemainingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all student funds
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Negative Balance Students
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{negativeBalanceStudents}</div>
            <p className="text-xs text-muted-foreground">
              Click to view details
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Student Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentStudentExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.studentName}</TableCell>
                  <TableCell>{expense.class}</TableCell>
                  <TableCell>{expense.item}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">₹{expense.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
