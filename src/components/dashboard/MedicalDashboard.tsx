
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, DollarSign, Activity, 
  AlertCircle, Users, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const MedicalDashboard: React.FC = () => {
  const [medicalData, setMedicalData] = useState({
    totalMedicalSpend: 0,
    totalRemainingFunds: 0,
    monthlySpend: 0,
    totalCheckups: 156,
    emergencyCases: 3,
    recentExpenses: []
  });

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    try {
      // Get current academic year
      const currentYear = "2024-25";
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYearNum = currentDate.getFullYear();

      // Fetch stationary expense funds (which includes medical funds)
      const { data: funds } = await supabase
        .from('stationary_expense_funds')
        .select('*')
        .eq('academic_year', currentYear);

      // Calculate total remaining funds
      const totalRemainingFunds = funds?.reduce((sum, fund) => sum + Number(fund.remaining_balance), 0) || 0;

      // Mock data for medical expenses (since we don't have a separate medical expenses table yet)
      const mockMedicalExpenses = [
        { id: 1, studentName: "Alice Smith", amount: 500, date: "2024-01-15", description: "Regular Checkup" },
        { id: 2, studentName: "Bob Johnson", amount: 2500, date: "2024-01-14", description: "Emergency Treatment" },
        { id: 3, studentName: "Carol Davis", amount: 800, date: "2024-01-13", description: "Medication" },
        { id: 4, studentName: "David Wilson", amount: 500, date: "2024-01-12", description: "Regular Checkup" },
        { id: 5, studentName: "Emma Brown", amount: 1500, date: "2024-01-11", description: "Specialist Visit" },
      ];

      // Calculate totals from mock data
      const totalMedicalSpend = mockMedicalExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate monthly spend (current month)
      const monthlySpend = mockMedicalExpenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYearNum;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      setMedicalData({
        totalMedicalSpend,
        totalRemainingFunds,
        monthlySpend,
        totalCheckups: 156,
        emergencyCases: 3,
        recentExpenses: mockMedicalExpenses
      });

    } catch (error) {
      console.error('Error loading medical data:', error);
      // Fallback to mock data
      setMedicalData({
        totalMedicalSpend: 45000,
        totalRemainingFunds: 230000,
        monthlySpend: 12000,
        totalCheckups: 156,
        emergencyCases: 3,
        recentExpenses: [
          { id: 1, studentName: "Alice Smith", amount: 500, date: "2024-01-15", description: "Regular Checkup" },
          { id: 2, studentName: "Bob Johnson", amount: 2500, date: "2024-01-14", description: "Emergency Treatment" },
          { id: 3, studentName: "Carol Davis", amount: 800, date: "2024-01-13", description: "Medication" },
          { id: 4, studentName: "David Wilson", amount: 500, date: "2024-01-12", description: "Regular Checkup" },
          { id: 5, studentName: "Emma Brown", amount: 1500, date: "2024-01-11", description: "Specialist Visit" },
        ]
      });
    }
  };

  const getPriorityBadge = (description: string) => {
    if (description.toLowerCase().includes("emergency")) {
      return <Badge variant="destructive">Emergency</Badge>;
    } else if (description.toLowerCase().includes("medication")) {
      return <Badge variant="secondary">Medication</Badge>;
    }
    return <Badge variant="default">Checkup</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Medical Spend (This Year)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{medicalData.totalMedicalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Academic year 2024-25
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Remaining Funds
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{medicalData.totalRemainingFunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All student pools combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Medical Spend
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{medicalData.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Emergency Cases
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{medicalData.emergencyCases}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Medical Expense Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Medical Spend</span>
                  <span>₹{medicalData.totalMedicalSpend.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((medicalData.totalMedicalSpend / 100000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Remaining Funds</span>
                  <span>₹{medicalData.totalRemainingFunds.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((medicalData.totalRemainingFunds / 300000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{medicalData.totalCheckups - medicalData.emergencyCases}</div>
                    <p className="text-xs text-muted-foreground">Regular Checkups</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{medicalData.emergencyCases}</div>
                    <p className="text-xs text-muted-foreground">Emergency Cases</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicalData.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{expense.studentName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {expense.description} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">₹{expense.amount.toLocaleString()}</div>
                    {getPriorityBadge(expense.description)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
