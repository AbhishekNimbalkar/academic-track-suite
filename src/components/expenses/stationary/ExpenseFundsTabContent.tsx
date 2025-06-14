
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Student, ExpenseFund } from "./types";

interface ExpenseFundsTabContentProps {
  students: Student[];
  funds: ExpenseFund[];
}

export const ExpenseFundsTabContent: React.FC<ExpenseFundsTabContentProps> = ({
  students,
  funds,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Expense Funds</CardTitle>
        <CardDescription>
          ₹9,000 for new students, ₹7,000 for promoted students
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
  );
};
