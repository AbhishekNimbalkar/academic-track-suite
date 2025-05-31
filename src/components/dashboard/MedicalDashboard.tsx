
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, DollarSign, Activity, 
  AlertCircle, Users, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MedicalDashboard: React.FC = () => {
  // Mock data for medical dashboard
  const totalBudget = 75000;
  const usedBudget = 45000;
  const remainingBudget = totalBudget - usedBudget;
  const monthlyExpenses = 12000;
  const totalCheckups = 156;
  const emergencyCases = 3;

  const recentMedicalRecords = [
    { id: 1, student: "Alice Smith", type: "Regular Checkup", amount: 500, date: "2024-01-15", priority: "Low" },
    { id: 2, student: "Bob Johnson", type: "Emergency", amount: 2500, date: "2024-01-14", priority: "High" },
    { id: 3, student: "Carol Davis", type: "Medication", amount: 800, date: "2024-01-13", priority: "Medium" },
    { id: 4, student: "David Wilson", type: "Regular Checkup", amount: 500, date: "2024-01-12", priority: "Low" },
    { id: 5, student: "Emma Brown", type: "Specialist Visit", amount: 1500, date: "2024-01-11", priority: "Medium" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Budget
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Annual medical budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checkups
            </CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckups}</div>
            <p className="text-xs text-muted-foreground">
              This academic year
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
            <div className="text-2xl font-bold text-red-600">{emergencyCases}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month spending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Medical Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used Budget</span>
                  <span>₹{usedBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(usedBudget / totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Remaining Budget</span>
                  <span>₹{remainingBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(remainingBudget / totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{totalCheckups - emergencyCases}</div>
                    <p className="text-xs text-muted-foreground">Regular Checkups</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{emergencyCases}</div>
                    <p className="text-xs text-muted-foreground">Emergency Cases</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMedicalRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{record.student}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.type} • {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">₹{record.amount.toLocaleString()}</div>
                    <Badge variant={getPriorityColor(record.priority) as any}>
                      {record.priority}
                    </Badge>
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
