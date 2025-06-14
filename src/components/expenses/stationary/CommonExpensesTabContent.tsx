
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommonExpense } from "./types";

interface CommonExpensesTabContentProps {
  commonExpenses: CommonExpense[];
}

export const CommonExpensesTabContent: React.FC<CommonExpensesTabContentProps> = ({
  commonExpenses,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Expenses</CardTitle>
        <CardDescription>Shared expenses divided among class students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commonExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No common expenses recorded</p>
          ) : (
            commonExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    Class {expense.class} • {expense.date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{expense.totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    ₹{expense.amountPerStudent.toFixed(2)} per student
                  </p>
                  <Badge variant="secondary">Common</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
