
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { dataService } from "@/services/mockData";
import { Fee } from "@/types/models";
import { FeeStructure } from "@/types/feeTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeeList } from "@/components/fees/FeeList";
import { FeeDetailsDialog } from "@/components/fees/FeeDetailsDialog";
import { FeeStructureManager } from "@/components/fees/FeeStructureManager";
import { ExpenseManager } from "@/components/fees/ExpenseManager";
import { ReceiptGenerator } from "@/components/fees/ReceiptGenerator";
import { FeeReminderSystem } from "@/components/fees/FeeReminderSystem";
import { FeesFilterBar } from "@/components/fees/FeesFilterBar";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, FileText, Bell, Settings } from "lucide-react";

const FeeManagement: React.FC = () => {
  const { hasPermission, userRole } = useAuth();
  const { toast } = useToast();
  
  // Check permissions
  if (!hasPermission("view_fee_records") && !hasPermission("collect_fees") && userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [fees, setFees] = useState<Fee[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  
  useEffect(() => {
    const fetchFees = () => {
      const allFees = dataService.getFees();
      setFees(allFees);
    };
    
    fetchFees();
  }, []);
  
  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "paid") {
      return (
        matchesSearch &&
        fee.installments.every((inst) => inst.status === "paid")
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
    // Update payment status
    dataService.updateFeeInstallment(feeId, installmentId, {
      status: "paid",
      paidDate: new Date().toISOString().split("T")[0],
    });
    
    // Update local state
    setFees(prev => prev.map((fee) => {
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
    }));
    
    // Update selected fee if it's currently being viewed
    if (selectedFee?.id === feeId) {
      setSelectedFee(prev => prev ? {
        ...prev,
        installments: prev.installments.map((inst) => {
          if (inst.id === installmentId) {
            return {
              ...inst,
              status: "paid",
              paidDate: new Date().toISOString().split("T")[0],
            };
          }
          return inst;
        }),
      } : null);
    }
    
    // Show receipt dialog
    setSelectedInstallment(installmentId);
    setIsReceiptDialogOpen(true);
    
    toast({
      title: "Payment Recorded",
      description: "The installment has been marked as paid.",
    });
  };

  const handleAddExpense = (feeId: string, expense: Omit<Fee["expenses"][0], "id">) => {
    const expenseWithId = {
      ...expense,
      id: `exp_${Date.now()}`,
    };
    
    // Update fee with new expense
    dataService.addFeeExpense(feeId, expenseWithId);
    
    // Update local state
    setFees(prev => prev.map(fee => {
      if (fee.id === feeId) {
        return {
          ...fee,
          expenses: [...fee.expenses, expenseWithId],
        };
      }
      return fee;
    }));
    
    // Update selected fee if it's currently being viewed
    if (selectedFee?.id === feeId) {
      setSelectedFee(prev => prev ? {
        ...prev,
        expenses: [...prev.expenses, expenseWithId],
      } : null);
    }
  };

  const getRemainingPoolAmount = (fee: Fee) => {
    const totalExpenses = fee.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return fee.medicalAndStationaryPool - totalExpenses;
  };

  const handleViewDetails = (fee: Fee) => {
    setSelectedFee(fee);
    setIsDetailsDialogOpen(true);
  };

  const handleStructureUpdate = (structure: FeeStructure) => {
    setFeeStructures(prev => [...prev, structure]);
    toast({
      title: "Fee Structure Created",
      description: `Fee structure for Class ${structure.class} (${structure.residentialType}) has been created.`,
    });
  };

  const getTotalStats = () => {
    const totalFees = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const totalPaid = fees.reduce((sum, fee) => {
      const paid = fee.installments
        .filter(inst => inst.status === "paid")
        .reduce((instSum, inst) => instSum + inst.amount, 0);
      return sum + paid;
    }, 0);
    const totalDue = totalFees - totalPaid;
    const overdueCount = fees.filter(fee =>
      fee.installments.some(inst => inst.status === "overdue")
    ).length;

    return { totalFees, totalPaid, totalDue, overdueCount };
  };

  const stats = getTotalStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalFees.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{stats.totalPaid.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{stats.totalDue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.overdueCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Fees</TabsTrigger>
            <TabsTrigger value="structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <FeesFilterBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTab="all"
                setSelectedTab={() => {}}
              />
              <CardContent>
                <FeeList 
                  fees={filteredFees} 
                  onViewDetails={handleViewDetails} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-4">
            <FeeStructureManager onStructureUpdate={handleStructureUpdate} />
            
            {feeStructures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Created Fee Structures</CardTitle>
                  <CardDescription>
                    Recently created fee structures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feeStructures.map((structure) => (
                      <div key={structure.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <span className="font-medium">
                            Class {structure.class} - {structure.residentialType}
                          </span>
                          <p className="text-sm text-gray-500">
                            {structure.academicYear} • ₹{structure.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {structure.categories.length} categories
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>
                  Track expenses from medical and stationary pools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a student from the "All Fees" tab to manage their expenses.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4">
            <FeeReminderSystem fees={fees} />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive fee reports and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Fee reports and analytics coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FeeDetailsDialog 
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        selectedFee={selectedFee}
        onPayInstallment={handlePayInstallment}
        getRemainingPoolAmount={getRemainingPoolAmount}
      />

      {selectedFee && (
        <ReceiptGenerator
          isOpen={isReceiptDialogOpen}
          onOpenChange={setIsReceiptDialogOpen}
          fee={selectedFee}
          installmentId={selectedInstallment}
          paymentMethod={paymentMethod}
        />
      )}
    </MainLayout>
  );
};

export default FeeManagement;
