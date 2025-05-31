
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/services/mockData";
import { 
  Users, BookOpen, CalendarDays, 
  DollarSign, AlertCircle, Check, Clock,
  GraduationCap, UserCheck, Building
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const students = dataService.getStudents();
  const attendance = dataService.getAttendance();
  const fees = dataService.getFees();

  // Calculate dashboard stats
  const totalStudents = students.length;
  const residentialStudents = students.filter(s => s.residentialType === "residential").length;
  const nonResidentialStudents = totalStudents - residentialStudents;

  // Attendance stats
  const todayDate = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  const present = todayAttendance.filter(a => a.status === "present").length;
  const absent = todayAttendance.filter(a => a.status === "absent").length;
  const late = todayAttendance.filter(a => a.status === "late").length;

  const attendanceData = [
    { name: "Present", value: present, color: "#4ade80" },
    { name: "Absent", value: absent, color: "#f87171" },
    { name: "Late", value: late, color: "#facc15" },
  ];

  // Fee stats
  const totalFees = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);
  const paidFees = fees.reduce((sum, fee) => {
    return sum + fee.installments
      .filter(inst => inst.status === "paid")
      .reduce((instSum, inst) => instSum + inst.amount, 0);
  }, 0);
  const pendingFees = totalFees - paidFees;

  // Class-wise student distribution
  const classDistribution = students.reduce((acc, student) => {
    const classKey = `Class ${student.class}`;
    if (!acc[classKey]) {
      acc[classKey] = 0;
    }
    acc[classKey]++;
    return acc;
  }, {} as Record<string, number>);

  const classData = Object.entries(classDistribution).map(([name, value]) => ({
    name,
    students: value,
  }));

  // Recent fee transactions
  const recentTransactions = fees
    .flatMap(fee => 
      fee.installments
        .filter(inst => inst.status === "paid" && inst.paidDate)
        .map(inst => ({
          id: inst.id,
          studentName: fee.studentName,
          date: inst.paidDate!,
          amount: inst.amount,
        }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Residential Students
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residentialStudents}</div>
            <p className="text-xs text-muted-foreground">
              {nonResidentialStudents} non-residential
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Attendance
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {present} / {todayAttendance.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Students present today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Fee Collection
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.floor(paidFees / 1000)}k
            </div>
            <p className="text-xs text-muted-foreground">
              Of ₹{Math.floor(totalFees / 1000)}k total fees
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="students"
                    name="Number of Students"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Fee Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3">Student</th>
                  <th className="text-left pb-3">Date</th>
                  <th className="text-right pb-3">Amount</th>
                  <th className="text-right pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3">{transaction.studentName}</td>
                    <td className="py-3">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">₹{transaction.amount.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td className="py-4 text-center text-muted-foreground" colSpan={4}>
                      No recent transactions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
