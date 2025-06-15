
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/services/mockData";
import { 
  Users, BookOpen, CalendarDays, 
  DollarSign, AlertCircle, Check, Clock,
  GraduationCap, UserCheck, Building, 
  CreditCard, School, TrendingUp, Heart, Receipt
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
  const totalTeachers = 45; // Mock data - replace with actual count
  const residentialStudents = students.filter(s => s.residentialType === "residential").length;
  const nonResidentialStudents = totalStudents - residentialStudents;

  // Attendance stats
  const todayDate = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  const present = todayAttendance.filter(a => a.status === "present").length;
  const absent = todayAttendance.filter(a => a.status === "absent").length;
  const late = todayAttendance.filter(a => a.status === "late").length;
  const attendancePercentage = todayAttendance.length > 0 ? Math.round((present / todayAttendance.length) * 100) : 0;

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

  // Mock data for new metrics
  const activeClasses = 24;
  const healthCases = 12;
  const stationaryExpenses = 85000;

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
      {/* Summary Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📊 Admin Dashboard Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                🎓 Total Students
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{totalStudents}</div>
              <p className="text-xs text-blue-600">
                Total enrolled students
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                🧑‍🏫 Total Teachers
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{totalTeachers}</div>
              <p className="text-xs text-green-600">
                Active teaching staff
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">
                💰 Total Fees Collected
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-800">
                ₹{Math.floor(paidFees / 1000)}k
              </div>
              <p className="text-xs text-emerald-600">
                For academic year
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                🧾 Pending Fees
              </CardTitle>
              <CreditCard className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                ₹{Math.floor(pendingFees / 1000)}k
              </div>
              <p className="text-xs text-red-600">
                Outstanding amount
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                📚 Active Classes
              </CardTitle>
              <School className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{activeClasses}</div>
              <p className="text-xs text-purple-600">
                Ongoing classes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">
                📅 Attendance %
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800">{attendancePercentage}%</div>
              <p className="text-xs text-indigo-600">
                Current month average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">
                🏥 Health Cases
              </CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-800">{healthCases}</div>
              <p className="text-xs text-pink-600">
                Logged incidents this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                🧾 Stationary Expenses
              </CardTitle>
              <Receipt className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                ₹{Math.floor(stationaryExpenses / 1000)}k
              </div>
              <p className="text-xs text-orange-600">
                Used expense amount
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Residential Students Summary */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Student Residential Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{residentialStudents}</div>
              <p className="text-sm text-blue-600">Residential Students</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{nonResidentialStudents}</div>
              <p className="text-sm text-green-600">Non-Residential Students</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Attendance Distribution</CardTitle>
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
            <CardTitle>Class-wise Student Distribution</CardTitle>
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Fee Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-semibold">Student</th>
                  <th className="text-left pb-3 font-semibold">Date</th>
                  <th className="text-right pb-3 font-semibold">Amount</th>
                  <th className="text-right pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{transaction.studentName}</td>
                    <td className="py-3 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right font-semibold">₹{transaction.amount.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td className="py-8 text-center text-gray-500" colSpan={4}>
                      No recent transactions found
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
