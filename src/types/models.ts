
export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  class: string;
  section: string;
  admissionDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  medicalInfo: string;
}

export interface Marks {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  academicYear: string;
  subjects: {
    subjectName: string;
    marksObtained: number;
    totalMarks: number;
  }[];
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  totalAmount: number;
  medicalAndStationaryPool: number;
  installments: {
    id: string;
    dueDate: string;
    amount: number;
    status: "paid" | "due" | "overdue";
    paidDate?: string;
  }[];
  expenses: {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: "medical" | "stationary";
  }[];
}
