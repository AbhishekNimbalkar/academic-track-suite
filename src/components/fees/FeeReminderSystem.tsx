
import React, { useState } from "react";
import { Fee } from "@/types/models";
import { FeeReminder } from "@/types/feeTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeeReminderSystemProps {
  fees: Fee[];
}

export const FeeReminderSystem: React.FC<FeeReminderSystemProps> = ({ fees }) => {
  const { toast } = useToast();
  const [selectedReminderType, setSelectedReminderType] = useState<"email" | "sms" | "both">("email");
  const [reminders, setReminders] = useState<FeeReminder[]>([]);

  // Get overdue fees
  const overdueFees = fees.filter(fee =>
    fee.installments.some(inst => {
      const dueDate = new Date(inst.dueDate);
      const today = new Date();
      return inst.status !== "paid" && dueDate < today;
    })
  );

  // Get fees due in next 7 days
  const upcomingFees = fees.filter(fee =>
    fee.installments.some(inst => {
      const dueDate = new Date(inst.dueDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return inst.status !== "paid" && dueDate >= today && dueDate <= nextWeek;
    })
  );

  const sendReminder = (fee: Fee, installmentId: string, type: "overdue" | "upcoming") => {
    const installment = fee.installments.find(inst => inst.id === installmentId);
    if (!installment) return;

    const reminder: FeeReminder = {
      id: `rem_${Date.now()}`,
      studentId: fee.studentId,
      feeId: fee.id,
      installmentId: installmentId,
      reminderType: selectedReminderType,
      sentDate: new Date().toISOString(),
      status: "sent",
    };

    setReminders(prev => [...prev, reminder]);

    // Simulate sending reminder
    setTimeout(() => {
      setReminders(prev => prev.map(rem => 
        rem.id === reminder.id ? { ...rem, status: "delivered" } : rem
      ));
    }, 2000);

    toast({
      title: "Reminder Sent",
      description: `${type === "overdue" ? "Overdue" : "Upcoming"} fee reminder sent to ${fee.studentName} via ${selectedReminderType}.`,
    });
  };

  const sendBulkReminders = (feeList: Fee[], type: "overdue" | "upcoming") => {
    feeList.forEach(fee => {
      const pendingInstallment = fee.installments.find(inst => inst.status !== "paid");
      if (pendingInstallment) {
        sendReminder(fee, pendingInstallment.id, type);
      }
    });

    toast({
      title: "Bulk Reminders Sent",
      description: `Sent ${feeList.length} ${type} fee reminders.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fee Reminder System</CardTitle>
          <CardDescription>
            Send automated reminders for overdue and upcoming fee payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="reminderType" className="text-sm font-medium">
              Reminder Method:
            </label>
            <Select
              value={selectedReminderType}
              onValueChange={(value: "email" | "sms" | "both") => setSelectedReminderType(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Only</SelectItem>
                <SelectItem value="sms">SMS Only</SelectItem>
                <SelectItem value="both">Email & SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-500" />
              <span>Overdue Payments</span>
              <Badge variant="destructive">{overdueFees.length}</Badge>
            </CardTitle>
            <CardDescription>
              Students with overdue fee payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueFees.length === 0 ? (
              <p className="text-sm text-gray-500">No overdue payments!</p>
            ) : (
              <>
                <Button
                  onClick={() => sendBulkReminders(overdueFees, "overdue")}
                  className="w-full"
                  variant="destructive"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send All Overdue Reminders
                </Button>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {overdueFees.map(fee => {
                    const overdueInstallment = fee.installments.find(inst => {
                      const dueDate = new Date(inst.dueDate);
                      return inst.status !== "paid" && dueDate < new Date();
                    });
                    
                    return (
                      <div key={fee.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{fee.studentName}</p>
                          <p className="text-xs text-gray-500">
                            Due: {overdueInstallment ? new Date(overdueInstallment.dueDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => overdueInstallment && sendReminder(fee, overdueInstallment.id, "overdue")}
                        >
                          Send
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span>Upcoming Payments</span>
              <Badge variant="secondary">{upcomingFees.length}</Badge>
            </CardTitle>
            <CardDescription>
              Fees due in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingFees.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming payments in the next 7 days.</p>
            ) : (
              <>
                <Button
                  onClick={() => sendBulkReminders(upcomingFees, "upcoming")}
                  className="w-full"
                  variant="secondary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send All Upcoming Reminders
                </Button>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {upcomingFees.map(fee => {
                    const upcomingInstallment = fee.installments.find(inst => {
                      const dueDate = new Date(inst.dueDate);
                      const today = new Date();
                      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return inst.status !== "paid" && dueDate >= today && dueDate <= nextWeek;
                    });
                    
                    return (
                      <div key={fee.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{fee.studentName}</p>
                          <p className="text-xs text-gray-500">
                            Due: {upcomingInstallment ? new Date(upcomingInstallment.dueDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => upcomingInstallment && sendReminder(fee, upcomingInstallment.id, "upcoming")}
                        >
                          Send
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {reminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reminders</CardTitle>
            <CardDescription>
              Recently sent fee reminders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {reminders.slice(-10).reverse().map(reminder => {
                const fee = fees.find(f => f.id === reminder.feeId);
                return (
                  <div key={reminder.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <div className="flex items-center space-x-3">
                      {reminder.reminderType === "email" ? (
                        <Mail className="h-4 w-4 text-blue-500" />
                      ) : reminder.reminderType === "sms" ? (
                        <MessageSquare className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="flex space-x-1">
                          <Mail className="h-3 w-3 text-blue-500" />
                          <MessageSquare className="h-3 w-3 text-green-500" />
                        </div>
                      )}
                      <span>{fee?.studentName || 'Unknown Student'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(reminder.sentDate).toLocaleString()}
                      </span>
                      <Badge 
                        variant={reminder.status === "delivered" ? "default" : "secondary"}
                      >
                        {reminder.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
