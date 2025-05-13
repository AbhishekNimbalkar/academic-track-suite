
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Fee } from "@/types/models";
import { FeeDetailsDialog } from "@/components/fees/FeeDetailsDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ResidentialFees: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Check if user has permission
  if (!hasPermission("view_fee_records") && !hasPermission("collect_fees") && !hasPermission("view_residential_students")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [fees, setFees] = useState<Fee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Fetch fees
  useEffect(() => {
    const fetchFees = () => {
      const residentialFees = dataService.getResidentialFees();
      setFees(residentialFees);
    };
    
    fetchFees();
  }, []);
  
  // Filter fees based on search query
  const filteredFees = fees.filter(fee =>
    fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
          <h1 className="text-2xl font-bold tracking-tight">Residential Fees</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Residential Student Fees</CardTitle>
            <CardDescription>
              View and manage fees for residential students
            </CardDescription>
            <div className="flex items-center mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academic Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stationary Pool
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No residential student fees found.
                      </td>
                    </tr>
                  ) : (
                    filteredFees.map((fee) => {
                      const pendingInstallments = fee.installments.filter(
                        inst => inst.status === "due" || inst.status === "overdue"
                      ).length;
                      
                      return (
                        <tr key={fee.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {fee.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {fee.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {fee.academicYear}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{fee.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{fee.medicalAndStationaryPool.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pendingInstallments === 0 ? (
                              <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">
                                {pendingInstallments} installment{pendingInstallments !== 1 ? 's' : ''} pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(fee)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
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

export default ResidentialFees;
