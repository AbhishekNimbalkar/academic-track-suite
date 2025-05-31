import React from "react";
import { Fee } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FeeListProps {
  fees: Fee[];
  onViewDetails: (fee: Fee) => void;
}

export const FeeList: React.FC<FeeListProps> = ({ fees, onViewDetails }) => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  return (
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
          {fees.length > 0 ? (
            fees.map((fee) => {
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
                          onClick={() => onViewDetails(fee)}
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
  );
};
