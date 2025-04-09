
export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  class: string;
  section: string;
  admissionDate: string;
  admissionClass: string; // For tracking academic history
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  medicalInfo: string;
  academicHistory?: AcademicRecord[];
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  academicYear: string;
  class: string;
  section: string;
  marks: Marks[];
  attendance: AttendanceRecord[];
  fees: FeeRecord;
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
    grade?: string;
    examType: "midterm" | "final" | "quarterly" | "halfYearly";
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

export interface AttendanceRecord {
  month: string;
  year: string;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  totalDays: number;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  status: "present" | "absent" | "late" | "leave";
  reason?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  totalAmount: number;
  medicalAndStationaryPool: number;
  installments: FeeInstallment[];
  expenses: FeeExpense[];
}

export interface FeeInstallment {
  id: string;
  dueDate: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  paidDate?: string;
  receiptNumber?: string;
  paymentMethod?: string;
}

export interface FeeExpense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: "medical" | "stationary";
  billNumber?: string;
  receiptGenerated?: boolean;
}

export interface FeeRecord {
  academicYear: string;
  totalFee: number;
  medicalStationaryPool: number;
  paidAmount: number;
  dueAmount: number;
  installments: FeeInstallment[];
}

export interface Document {
  id: string;
  studentId: string;
  type: "bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt";
  generatedDate: string;
  academicYear: string;
  fileUrl?: string;
  status: "generated" | "downloaded" | "printed";
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  joiningDate: string;
  qualification: string;
  address: string;
  attendance?: TeacherAttendance[];
}

export interface Notification {
  id: string;
  recipient: {
    id: string;
    type: "student" | "teacher" | "parent";
  };
  title: string;
  message: string;
  type: "fee_reminder" | "attendance" | "academic" | "general";
  sentVia: ("email" | "sms" | "app")[];
  dateSent: string;
  status: "sent" | "delivered" | "read" | "failed";
}
