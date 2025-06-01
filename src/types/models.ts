export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  class: string;
  section: string;
  stream?: "APC" | "USA"; // For classes 11-12
  admissionDate: string;
  admissionClass: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  medicalInfo: string;
  caste?: string;
  residentialType?: "residential" | "non-residential";
  aadhaarNumber?: string;
  panCardNumber?: string;
  imageUrl?: string;
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
  studentName: string;
  type: "bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt";
  generatedDate: string;
  academicYear: string;
  class: string;
  section: string;
  status: "generated" | "downloaded" | "printed";
  fileUrl?: string;
  templateData?: DocumentTemplateData;
}

export interface DocumentTemplateData {
  studentDetails: {
    fullName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    class: string;
    section: string;
    rollNumber?: string;
    admissionDate: string;
    academicYear: string;
  };
  schoolDetails: {
    name: string;
    address: string;
    principal: string;
    affiliationNumber: string;
  };
  purpose?: string;
  marks?: {
    subjects: Array<{
      name: string;
      marksObtained: number;
      totalMarks: number;
      grade: string;
    }>;
    totalMarks: number;
    percentage: number;
    result: string;
  };
  conduct?: string;
  character?: string;
  reasonForLeaving?: string;
}

export interface DocumentTemplate {
  id: string;
  type: "bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt";
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
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

// Add additional model types for library management
export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  availability: number;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
}

// Add types for expenses
export interface StationaryExpense {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  amount: number;
  description: string;
  academic_year: string;
}

// Add types for student promotion
export interface PromotionRecord {
  id: string;
  studentId: string;
  studentName: string;
  fromClass: string;
  toClass: string;
  fromSection: string;
  toSection: string;
  promotionDate: string;
  academicYear: string;
}
