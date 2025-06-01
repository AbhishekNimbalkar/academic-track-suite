
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { dataService } from "@/services/mockData";
import { Fee } from "@/types/models";

export const ExpenseAnalytics: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  useEffect(() => {
    const feeData = dataService.getFees();
    setFees(feeData);
  }, []);

  const getAllExpenses = () => {
    return fees.flatMap(fee => 
      fee.expenses.map(expense => ({
        ...expense,
        studentName: fee.studentName,
        academicYear: fee.academicYear,
      }))
    );
  };

  const expensesByCategory = () => {
    const expenses = getAllExpenses();
    const medical = expenses.filter(e => e.category === "medical").reduce((sum, e) => sum + e.amount, 0);
    const stationary = expenses.filter(e => e.category === "stationary").reduce((sum, e) => sum + e.amount, 0);

    return [
      { name: "Medical", value: medical, color: "#ef4444" },
      { name: "Stationary", value: stationary, color: "#3b82f6" },
    ];
  };

  const monthlyExpenseTrends = () => {
    const expenses = getAllExpenses();
    const monthlyData: { [key: string]: { medical: number; stationary: number } } = {};

    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { medical: 0, stationary: 0 };
      }
      monthlyData[month][expense.category] += expense.amount;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      medical: data.medical,
      stationary: data.stationary,
      total: data.medical + data.stationary,
    }));
  };

  const topExpenseStudents = () => {
    const studentExpenses: { [key: string]: { name: string; medical: number; stationary: number; total: number } } = {};

    fees.forEach(fee => {
      const totalMedical = fee.expenses.filter(e => e.category === "medical").reduce((sum, e) => sum + e.amount, 0);
      const totalStationary = fee.expenses.filter(e => e.category === "stationary").reduce((sum, e) => sum + e.amount, 0);
      
      studentExpenses[fee.studentId] = {
        name: fee.studentName,
        medical: totalMedical,
        stationary: totalStationary,
        total: totalMedical + totalStationary,
      };
    });

    return Object.values(studentExpenses)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const categoryData = expensesByCategory();
  const monthlyData = monthlyExpenseTrends();
  const topStudents = topExpenseStudents();

  const totalExpenses = getAllExpenses().reduce((sum, expense) => sum + expense.amount, 0);
  const totalMedical = categoryData.find(c => c.name === "Medical")?.value || 0;
  const totalStationary = categoryData.find(c => c.name === "Stationary")?.value || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expense Analytics</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Medical Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalMedical.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalExpenses > 0 ? Math.round((totalMedical / totalExpenses) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Stationary Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{totalStationary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalExpenses > 0 ? Math.round((totalStationary / totalExpenses) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="medical" stroke="#ef4444" strokeWidth={2} name="Medical" />
                  <Line type="monotone" dataKey="stationary" stroke="#3b82f6" strokeWidth={2} name="Stationary" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Students by Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStudents.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Medical: ₹{student.medical.toLocaleString()} • Stationary: ₹{student.stationary.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{student.total.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
