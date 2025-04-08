
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Fee } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  FileText,
  DollarSign,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Fees: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [fees, setFees] = useState<Fee[]>(dataService.getFees());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    category: "medical" as "medical" | "stationary",
  });
  const { toast } = useToast();

  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "paid") {
      return (
        matchesSearch &&
        fee.installments.some((inst) => inst.status === "paid")
      );
    }
    if (selectedTab === "due") {
      return (
        matchesSearch &&
        fee.installments.some((inst) => inst.status === "due")
      );
    }
    if (selectedTab === "overdue") {
      return (
        matchesSearch &&
        fee.installments.some((inst) => inst.status === "overdue")
      );
    }
    return matchesSearch;
  });

  const handlePayInstallment = (feeId: string, installmentId: string) => {
    dataService.updateFeeInstallment(feeId, installmentId, {
      status: "paid",
      paidDate: new Date().toISOString().split("T")[0],
    });
    
    // Update local state
    setFees(
      fees.map((fee) => {
        if (fee.id === feeId) {
          return {
            ...fee,
            installments: fee.installments.map((inst) => {
              if (inst.id === installmentId) {
                return {
                  ...inst,
                  status: "paid",
                  paidDate: new Date().toISOString().split("T")[0],
                };
              }
              return inst;
            }),
          };
        }
        return fee;
      })
    );
    
    // Update selected fee if it's currently being viewed
    if (selectedFee?.id === feeId) {
      setSelectedFee({
        ...selectedFee,
        installments: selectedFee.installments.map((inst) => {
          if (inst.id === installmentId) {
            return {
              ...inst,
              status: "paid",
              paidDate: new Date().toISOString().split("T")[0],
            };
          }
          return inst;
        }),
      });
    }
    
    toast({
      title: "Payment Recorded",
      description: "The installment has been marked as paid.",
    });
  };

  const handleAddExpense = () => {
    if (!selectedFee) return;
    
    // Check if adding this expense would exceed the pool
    const currentExpensesTotal = selectedFee.expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    
    if (currentExpensesTotal + newExpense.amount > selectedFee.medicalAndStationaryPool) {
      toast({
        title: "Error",
        description: `This expense would exceed the medical & stationary pool of ₹${selectedFee.medicalAndStationaryPool}. Available: ₹${
          selectedFee.medicalAndStationaryPool - currentExpensesTotal
        }`,
        variant: "destructive",
      });
      return;
    }
    
    const addedExpense = dataService.addFeeExpense(selectedFee.id, newExpense);
    
    if (addedExpense) {
      // Update local state
      setFees(
        fees.map((fee) => {
          if (fee.id === selectedFee.id) {
            return {
              ...fee,
              expenses: [...fee.expenses, addedExpense],
            };
          }
          return fee;
        })
      );
      
      // Update selected fee
      setSelectedFee({
        ...selectedFee,
        expenses: [...selectedFee.expenses, addedExpense],
      });
      
      setIsAddExpenseDialogOpen(false);
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: 0,
        category: "medical",
      });
      
      toast({
        title: "Expense Added",
        description: `${newExpense.category === "medical" ? "Medical" : "Stationary"} expense of ₹${newExpense.amount} has been added.`,
      });
    }
  };

  const getRemainingPoolAmount = (fee: Fee) => {
    const totalExpenses = fee.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return fee.medicalAndStationaryPool - totalExpenses;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Fee Records</CardTitle>
            <CardDescription>
              Manage and track fee payments and expenses
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs
              defaultValue="all"
              className="mt-4"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="due">Due</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => {
                      const paidAmount = fee.installments
                        .filter((inst) => inst.status === "paid")
                        .reduce((sum, inst) => sum + inst.amount, 0);
                      const remainingAmount = fee.totalAmount - paidAmount;
                      const overdueInstallments = fee.installments.filter(
                        (inst) => inst.status === "overdue"
                      );
                      const dueInstallments = fee.installments.filter(
                        (inst) => inst.status === "due"
                      );
                      
                      let status = "Paid";
                      let statusClass = "bg-green-100 text-green-800";
                      
                      if (overdueInstallments.length > 0) {
                        status = "Overdue";
                        statusClass = "bg-red-100 text-red-800";
                      } else if (dueInstallments.length > 0) {
                        status = "Due";
                        statusClass = "bg-yellow-100 text-yellow-800";
                      }
                      
                      return (
                        <TableRow key={fee.id}>
                          <TableCell>{fee.studentId}</TableCell>
                          <TableCell className="font-medium">
                            {fee.studentName}
                          </TableCell>
                          <TableCell>{fee.academicYear}</TableCell>
                          <TableCell>₹{fee.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>₹{paidAmount.toLocaleString()}</TableCell>
                          <TableCell>₹{remainingAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
                            >
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedFee(fee);
                                    setIsDetailsDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {isAdmin && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate Fee Receipt
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Fee Record
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No fee records found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Fee Details</DialogTitle>
            <DialogDescription>
              {selectedFee?.studentName}'s fee details for {selectedFee?.academicYear}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Student ID</Label>
                <p className="text-sm font-medium">{selectedFee?.studentId}</p>
              </div>
              <div className="space-y-1">
                <Label>Academic Year</Label>
                <p className="text-sm font-medium">{selectedFee?.academicYear}</p>
              </div>
              <div className="space-y-1">
                <Label>Total Fee Amount</Label>
                <p className="text-sm font-medium">₹{selectedFee?.totalAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <Label>Medical & Stationary Pool</Label>
                <p className="text-sm font-medium">
                  ₹{selectedFee?.medicalAndStationaryPool.toLocaleString()}
                  <span className="text-xs text-muted-foreground ml-2">
                    (Remaining: ₹{selectedFee && getRemainingPoolAmount(selectedFee).toLocaleString()})
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
                    {selectedFee?.installments.map((installment) => (
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
                                selectedFee &&
                                handlePayInstallment(
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
                  <Dialog
                    open={isAddExpenseDialogOpen}
                    onOpenChange={setIsAddExpenseDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>
                          Add a new medical or stationary expense for {selectedFee?.studentName}.
                          Available balance: ₹
                          {selectedFee && getRemainingPoolAmount(selectedFee).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="expenseDate">Date</Label>
                          <Input
                            id="expenseDate"
                            type="date"
                            value={newExpense.date}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expenseDescription">Description</Label>
                          <Input
                            id="expenseDescription"
                            value={newExpense.description}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description of the expense"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expenseAmount">Amount (₹)</Label>
                          <Input
                            id="expenseAmount"
                            type="number"
                            min="0"
                            value={newExpense.amount}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                amount: Number(e.target.value),
                              })
                            }
                            placeholder="Amount in rupees"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expenseCategory">Category</Label>
                          <select
                            id="expenseCategory"
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            value={newExpense.category}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                category: e.target.value as "medical" | "stationary",
                              })
                            }
                          >
                            <option value="medical">Medical</option>
                            <option value="stationary">Stationary</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddExpenseDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddExpense}>Add Expense</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                    {selectedFee?.expenses.length ? (
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
    </MainLayout>
  );
};

export default Fees;
