
import React, { useState } from "react";
import { Fee } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign, FileText, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddExpenseDialog } from "./AddExpenseDialog";

interface FeeDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFee: Fee | null;
  onPayInstallment: (feeId: string, installmentId: string) => void;
  getRemainingPoolAmount: (fee: Fee) => number;
}

export const FeeDetailsDialog: React.FC<FeeDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedFee,
  onPayInstallment,
  getRemainingPoolAmount,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);

  if (!selectedFee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Fee Details</DialogTitle>
          <DialogDescription>
            {selectedFee.studentName}'s fee details for {selectedFee.academicYear}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Student ID</Label>
              <p className="text-sm font-medium">{selectedFee.studentId}</p>
            </div>
            <div className="space-y-1">
              <Label>Academic Year</Label>
              <p className="text-sm font-medium">{selectedFee.academicYear}</p>
            </div>
            <div className="space-y-1">
              <Label>Total Fee Amount</Label>
              <p className="text-sm font-medium">₹{selectedFee.totalAmount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <Label>Medical & Stationary Pool</Label>
              <p className="text-sm font-medium">
                ₹{selectedFee.medicalAndStationaryPool.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-2">
                  (Remaining: ₹{getRemainingPoolAmount(selectedFee).toLocaleString()})
                </span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Installments</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedFee.installments.map((installment) => (
                    <TableRow key={installment.id}>
                      <TableCell>
                        {new Date(installment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{installment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            installment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : installment.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {installment.status === "paid"
                            ? "Paid"
                            : installment.status === "overdue"
                            ? "Overdue"
                            : "Due"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {installment.paidDate
                          ? new Date(installment.paidDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {installment.status !== "paid" && isAdmin && (
                          <Button
                            size="sm"
                            onClick={() =>
                              onPayInstallment(
                                selectedFee.id,
                                installment.id
                              )
                            }
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Mark as Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Medical & Stationary Expenses
              </h3>
              {isAdmin && (
                <AddExpenseDialog 
                  isOpen={isAddExpenseDialogOpen}
                  onOpenChange={setIsAddExpenseDialogOpen}
                  selectedFee={selectedFee}
                  remainingAmount={getRemainingPoolAmount(selectedFee)}
                />
              )}
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedFee.expenses.length ? (
                    selectedFee.expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="capitalize">
                          {expense.category}
                        </TableCell>
                        <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Download Receipt</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 5 : 4}
                        className="text-center py-4"
                      >
                        No expenses recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
