import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { format, subMonths } from "date-fns";

// Mock data (replace with real API later)
const mockStudents = [
  { id: "STU001", name: "John Doe", class: "10", remainingFund: 6500, commonExpense: 1500, individualExpense: 1000 },
  { id: "STU002", name: "Jane Smith", class: "10", remainingFund: -500, commonExpense: 2000, individualExpense: 5500 },
  { id: "STU003", name: "Mike Johnson", class: "9", remainingFund: 6000, commonExpense: 1800, individualExpense: 1200 },
  { id: "STU004", name: "Sarah Wilson", class: "11-APC", remainingFund: 8000, commonExpense: 800, individualExpense: 200 },
  { id: "STU005", name: "Alex Brown", class: "1", remainingFund: 7000, commonExpense: 1000, individualExpense: 1000 },
  { id: "STU006", name: "Emily Davis", class: "12-USA", remainingFund: 8000, commonExpense: 900, individualExpense: 100 },
];

const mockCommonExpenses = [
  { id: "C1", date: "2024-06-01", class: "10", amount: 1500 },
  { id: "C2", date: "2024-06-03", class: "9", amount: 1800 },
  { id: "C3", date: "2024-06-05", class: "11-APC", amount: 800 },
  { id: "C4", date: "2024-06-06", class: "1", amount: 1000 }
];

const mockIndividualExpenses = [
  { id: "I1", studentId: "STU001", date: "2024-06-10", amount: 1000 },
  { id: "I2", studentId: "STU002", date: "2024-06-15", amount: 5500 },
  { id: "I3", studentId: "STU003", date: "2024-06-12", amount: 1200 },
  { id: "I4", studentId: "STU004", date: "2024-06-14", amount: 200 },
  { id: "I5", studentId: "STU005", date: "2024-06-19", amount: 1000 },
  { id: "I6", studentId: "STU006", date: "2024-06-22", amount: 100 }
];

const COLORS = ["#4f8cfb", "#92d075"]; // For charts

type ClassSummary = { class: string; totalFund: number; used: number; count: number };

function getClasses() {
  // Extract unique class names
  return [...new Set(mockStudents.map(s => s.class))];
}

function getClassWiseSummary(students): ClassSummary[] {
  const byClass: Record<string, ClassSummary> = {};
  students.forEach(s => {
    if (!byClass[s.class]) {
      byClass[s.class] = { class: s.class, totalFund: 0, used: 0, count: 0 };
    }
    byClass[s.class].totalFund += (s.remainingFund + s.commonExpense + s.individualExpense);
    byClass[s.class].used += (s.commonExpense + s.individualExpense);
    byClass[s.class].count++;
  });
  return Object.values(byClass);
}

function getMonthRange(date = new Date()) {
  // first/last day of current month
  const year = date.getFullYear(), month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay };
}

export default function StationaryExpenseDashboard() {
  const { toast } = useToast();

  // Filters
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined);
  const [studentFilter, setStudentFilter] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string>(format(subMonths(new Date(), 1), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  // For download simulation
  const handleDownload = (format) => {
    toast({
      title: `Download ${format.toUpperCase()} Report`,
      description: "Report generation is currently mocked.",
    });
  };

  // Table + filters
  const filteredStudents = useMemo(() => {
    return mockStudents.filter(s => {
      let cond = true;
      if (classFilter && s.class !== classFilter) cond = false;
      if (studentFilter && s.id !== studentFilter) cond = false;
      return cond;
    });
  }, [classFilter, studentFilter]);

  // Aggregates/summaries
  const totalResidential = mockStudents.length;
  const totalCommon = mockCommonExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIndividual = mockIndividualExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingFund = mockStudents.reduce((sum, s) => sum + s.remainingFund, 0);

  const studentsWithNegative = mockStudents.filter(s => s.remainingFund < 0);

  // Data for charts
  const classWiseData = useMemo(
    () =>
      getClassWiseSummary(mockStudents).map(row => ({
        class: row.class,
        used: row.used,
      })),
    []
  );

  const pieData = [
    { name: "Common", value: totalCommon },
    { name: "Individual", value: totalIndividual }
  ];

  // Notification for negative balance
  const handleNotify = () => {
    if (studentsWithNegative.length === 0) {
      toast({ title: "No Negative Balances", description: "No students have a negative fund balance." });
      return;
    }
    toast({
      title: "Admin Notified",
      description: `${studentsWithNegative.length} student(s) with negative balances.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Residential Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidential}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Common Stationery Expenses (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommon.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Individual Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalIndividual.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remaining Expense Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingFund < 0 ? 'text-red-500' : 'text-green-700'}`}>₹{remainingFund.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Class-wise & Student-wise below.</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex items-end flex-wrap gap-4">
          <div>
            <Label htmlFor="filter-class">Class</Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {getClasses().map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-student">Student</Label>
            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All students" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {mockStudents.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date-from">From</Label>
            <Input type="date" id="date-from" className="w-36" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date-to">To</Label>
            <Input type="date" id="date-to" className="w-36" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleDownload('pdf')} variant="secondary">Download PDF</Button>
          <Button onClick={() => handleDownload('excel')} variant="secondary">Download Excel</Button>
        </div>
      </div>

      {/* Monthly Expense Report Table */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Monthly Expense Report</CardTitle>
            <CardDescription>Track all stationery expenses and fund balances.</CardDescription>
          </div>
          <div>
            <Button size="sm" variant="outline" onClick={handleNotify}>
              Notify Admin (Negative Balance)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Common Expense (₹)</TableHead>
                <TableHead>Individual Expense (₹)</TableHead>
                <TableHead>Total Deducted (₹)</TableHead>
                <TableHead>Remaining Fund (₹)</TableHead>
                <TableHead>Negative Balance?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>₹{s.commonExpense.toLocaleString()}</TableCell>
                  <TableCell>₹{s.individualExpense.toLocaleString()}</TableCell>
                  <TableCell>
                    ₹{(s.commonExpense + s.individualExpense).toLocaleString()}
                  </TableCell>
                  <TableCell className={s.remainingFund < 0 ? "text-red-600 font-bold" : "text-green-700"}>
                    ₹{s.remainingFund.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {s.remainingFund < 0 ? (
                      <span className="text-red-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No data for selected filters.</div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Expense Fund Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ReBarChart data={classWiseData}>
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill="#4f8cfb" name="Used Amount" />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Common vs. Individual Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
