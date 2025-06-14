
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MedicalExpense } from "./EnhancedMedicalExpenseManager";

interface StudentMedicalExpenseHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  expenses: MedicalExpense[];
}

const StudentMedicalExpenseHistoryDialog: React.FC<StudentMedicalExpenseHistoryDialogProps> = ({
  isOpen,
  onClose,
  studentName,
  expenses
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Medical Expense History for <span className="text-primary font-semibold">{studentName}</span>
          </DialogTitle>
          <DialogDescription>
            All recorded medical expenses for this student.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No medical expenses recorded for this student.
            </p>
          ) : (
            expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{expense.description || "No description"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        ₹{expense.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Doctor: ₹{expense.doctorFee} | Medical: ₹{expense.medicalFee}
                      </div>
                      <Badge variant="outline" className="mt-1">Medical</Badge>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentMedicalExpenseHistoryDialog;
