
export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  current_class: string;
  residential_type: string;
}

export interface StationaryExpense {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  description: string;
  academicYear: string;
  class: string;
  section: string;
  type: "individual";
}

export interface CommonExpense {
  id: string;
  date: string;
  description: string;
  totalAmount: number;
  category: "stationary";
  class: string;
  section: string;
  academicYear: string;
  studentsAffected: string[];
  amountPerStudent: number;
  addedBy: string;
}

export interface ExpenseFund {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  academicYear: string;
  initialAmount: number;
  totalExpenses: number;
  remainingBalance: number;
  isNegative: boolean;
  negativeAmount?: number;
}
