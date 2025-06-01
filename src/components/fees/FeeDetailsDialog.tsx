
import React, { useState } from "react";
import { Fee } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, FileText, Receipt } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ExpenseManager } from "./ExpenseManager";

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
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  if (!selectedFee) return null;

  const handlePayment = (installmentId: string) => {
    onPayInstallment(selectedFee.id, installmentId);
  };

  const handleAddExpense = (expense: Omit<Fee["expenses"][0], "id">) => {
    // This will be handled by the parent component
    console.log("Adding expense:", expense);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
          
          {/* Payment Method Selection for Admins */}
          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online Transfer</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
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
                    <TableHead>Payment Method</TableHead>
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
                      <TableCell>
                        {installment.paymentMethod || "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {installment.status !== "paid" && isAdmin && (
                          <Button
                            size="sm"
                            onClick={() => handlePayment(installment.id)}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Mark as Paid
                          </Button>
                        )}
                        {installment.status === "paid" && (
                          <Button variant="outline" size="sm">
                            <Receipt className="h-4 w-4 mr-1" />
                            Receipt
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
                <ExpenseManager 
                  selectedFee={selectedFee}
                  remainingAmount={getRemainingPoolAmount(selectedFee)}
                  onAddExpense={handleAddExpense}
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
                    <TableHead>Bill Number</TableHead>
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
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            expense.category === "medical" 
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{expense.billNumber || "-"}</TableCell>
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
                        colSpan={isAdmin ? 6 : 5}
                        className="text-center py-8"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">No expenses recorded yet.</p>
                        </div>
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
