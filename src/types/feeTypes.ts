
export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  baseAmount: number;
  isRequired: boolean;
}

export interface FeeStructure {
  id: string;
  academicYear: string;
  class: string;
  residentialType: "residential" | "non-residential";
  categories: FeeCategory[];
  totalAmount: number;
  medicalStationaryPool: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: "medical" | "stationary";
  description: string;
}

export interface FeeReceipt {
  id: string;
  feeId: string;
  installmentId: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: "cash" | "cheque" | "online" | "card";
  generatedDate: string;
  generatedBy: string;
  paymentDetails?: string;
}

export interface FeeReminder {
  id: string;
  studentId: string;
  feeId: string;
  installmentId: string;
  reminderType: "email" | "sms" | "both";
  sentDate: string;
  status: "sent" | "delivered" | "failed";
}
