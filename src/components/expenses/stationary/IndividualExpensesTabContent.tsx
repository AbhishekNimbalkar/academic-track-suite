
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StationaryExpense } from "./types";

interface IndividualExpensesTabContentProps {
  expenses: StationaryExpense[];
}

export const IndividualExpensesTabContent: React.FC<IndividualExpensesTabContentProps> = ({
  expenses,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Expenses</CardTitle>
        <CardDescription>Student-specific stationary purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No individual expenses recorded</p>
          ) : (
            expenses.filter(e => e.type === "individual").map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{expense.studentName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {expense.description} • {expense.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Class {expense.class}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{expense.amount.toLocaleString()}</div>
                  <Badge variant="outline">Individual</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
