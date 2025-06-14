
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Student, StationaryExpense, CommonExpense } from "./types";

interface StudentExpenseHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  expenses: StationaryExpense[];
  commonExpenses: CommonExpense[];
  canManage: boolean; // To control edit/delete visibility
  onDelete: (expenseId: string, type: "individual" | "common") => void;
  onEdit: (expense: StationaryExpense | CommonExpense) => void;
}

export const StudentExpenseHistoryDialog: React.FC<StudentExpenseHistoryDialogProps> = ({
  isOpen,
  onClose,
  student,
  expenses,
  commonExpenses,
  canManage,
  onDelete,
  onEdit,
}) => {
  if (!student) return null;

  const individualStudentExpenses = expenses.filter(
    (e) => e.studentId === student.id
  );
  const commonStudentExpenses = commonExpenses.filter((e) =>
    e.studentsAffected.includes(student.id)
  );
  
  const allExpenses = [
    ...individualStudentExpenses.map(e => ({...e, type: 'individual'})),
    ...commonStudentExpenses.map(e => ({...e, type: 'common'}))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense History for {student.first_name} {student.last_name}</DialogTitle>
          <DialogDescription>
            Showing all individual and common stationary expenses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {allExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No expenses recorded for this student.</p>
          ) : (
            allExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-medium">
                        ₹{expense.type === 'individual' ? (expense as StationaryExpense).amount.toLocaleString() : (expense as CommonExpense).amountPerStudent.toFixed(2)}
                        </div>
                        <Badge variant={expense.type === 'individual' ? 'outline' : 'secondary'}>
                        {expense.type === 'individual' ? 'Individual' : 'Common'}
                        </Badge>
                    </div>
                    {canManage && (
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" onClick={() => onEdit(expense as StationaryExpense | CommonExpense)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => onDelete(expense.id, expense.type as 'individual' | 'common')}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
