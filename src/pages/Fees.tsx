
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Fee } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FeeList } from "@/components/fees/FeeList";
import { FeeDetailsDialog } from "@/components/fees/FeeDetailsDialog";
import { FeesFilterBar } from "@/components/fees/FeesFilterBar";

const Fees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>(dataService.getFees());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
        </div>

        <Card>
          <FeesFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <CardContent>
            <FeeList 
              fees={filteredFees} 
              onViewDetails={handleViewDetails} 
            />
          </CardContent>
        </Card>
      </div>

      <FeeDetailsDialog 
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        selectedFee={selectedFee}
        onPayInstallment={handlePayInstallment}
        getRemainingPoolAmount={getRemainingPoolAmount}
      />
    </MainLayout>
  );
};

export default Fees;
