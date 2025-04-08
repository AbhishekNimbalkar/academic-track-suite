
import { Student, Marks, Attendance, Fee } from "@/types/models";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate mock students
export const generateMockStudents = (count: number): Student[] => {
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C"];
  
  return Array.from({ length: count }).map((_, index) => {
    const studentClass = classes[Math.floor(Math.random() * classes.length)];
    const studentSection = sections[Math.floor(Math.random() * sections.length)];
    
    return {
      id: `STU${(index + 1).toString().padStart(4, "0")}`,
      fullName: `Student ${index + 1}`,
      dateOfBirth: new Date(
        2005 + Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString().split("T")[0],
      class: studentClass,
      section: studentSection,
      admissionDate: new Date(
        2020 + Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString().split("T")[0],
      parentName: `Parent of Student ${index + 1}`,
      parentEmail: `parent${index + 1}@example.com`,
      parentPhone: `+91${Math.floor(Math.random() * 10000000000).toString().padStart(10, "0")}`,
      address: `Address of Student ${index + 1}`,
      medicalInfo: Math.random() > 0.7 ? "No medical issues" : "Allergic to peanuts",
    };
  });
};

// Generate mock marks
export const generateMockMarks = (students: Student[]): Marks[] => {
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Hindi"];
  const academicYears = ["2022-2023", "2023-2024"];
  
  return students.map((student) => {
    return {
      id: generateId(),
      studentId: student.id,
      studentName: student.fullName,
      class: student.class,
      section: student.section,
      academicYear: academicYears[Math.floor(Math.random() * academicYears.length)],
      subjects: subjects.map((subject) => {
        const total = 100;
        const obtained = Math.floor(Math.random() * 40) + 60; // Marks between 60-100
        
        return {
          subjectName: subject,
          marksObtained: obtained,
          totalMarks: total,
        };
      }),
    };
  });
};

// Generate mock attendance
export const generateMockAttendance = (students: Student[]): Attendance[] => {
  const statuses: ("present" | "absent" | "late")[] = ["present", "absent", "late"];
  const attendanceRecords: Attendance[] = [];
  
  students.forEach((student) => {
    // Generate attendance for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      attendanceRecords.push({
        id: generateId(),
        studentId: student.id,
        studentName: student.fullName,
        date: date.toISOString().split("T")[0],
        status,
        remarks: status === "absent" ? "Parent informed" : undefined,
      });
    }
  });
  
  return attendanceRecords;
};

// Generate mock fees
export const generateMockFees = (students: Student[]): Fee[] => {
  return students.map((student) => {
    const totalAmount = 59000;
    const medicalAndStationaryPool = 9000;
    const remainingAmount = totalAmount - medicalAndStationaryPool;
    const installmentAmount = remainingAmount / 2;
    
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    // Generate random expenses from the medical and stationary pool
    const expenses = [];
    let totalExpenses = 0;
    
    for (let i = 0; i < 3; i++) {
      if (totalExpenses >= medicalAndStationaryPool) break;
      
      const categories = ["medical", "stationary"] as const;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const expenseAmount = Math.min(
        Math.floor(Math.random() * 2000) + 500,
        medicalAndStationaryPool - totalExpenses
      );
      
      totalExpenses += expenseAmount;
      
      expenses.push({
        id: generateId(),
        date: new Date().toISOString().split("T")[0],
        description: category === "medical" 
          ? "Medical checkup" 
          : "Stationary supplies",
        amount: expenseAmount,
        category,
      });
    }
    
    // Generate installments
    const currentMonth = new Date().getMonth();
    const june = 5; // 0-indexed, so June is 5
    const november = 10;
    
    const firstInstallmentStatus = 
      currentMonth >= june 
        ? Math.random() > 0.3 
          ? "paid" as const 
          : "due" as const
        : "due" as const;
        
    const secondInstallmentStatus = 
      currentMonth >= november 
        ? Math.random() > 0.7 
          ? "paid" as const 
          : "due" as const
        : "due" as const;
    
    return {
      id: generateId(),
      studentId: student.id,
      studentName: student.fullName,
      academicYear,
      totalAmount,
      medicalAndStationaryPool,
      installments: [
        {
          id: generateId(),
          dueDate: `${currentYear}-06-15`,
          amount: installmentAmount,
          status: firstInstallmentStatus,
          paidDate: firstInstallmentStatus === "paid" 
            ? `${currentYear}-06-${Math.floor(Math.random() * 15) + 1}`.padStart(10, "0") 
            : undefined,
        },
        {
          id: generateId(),
          dueDate: `${currentYear}-11-15`,
          amount: installmentAmount,
          status: secondInstallmentStatus,
          paidDate: secondInstallmentStatus === "paid" 
            ? `${currentYear}-11-${Math.floor(Math.random() * 15) + 1}`.padStart(10, "0") 
            : undefined,
        },
      ],
      expenses,
    };
  });
};

// Generate all mock data
export const generateMockData = () => {
  const students = generateMockStudents(20);
  const marks = generateMockMarks(students);
  const attendance = generateMockAttendance(students);
  const fees = generateMockFees(students);
  
  return {
    students,
    marks,
    attendance,
    fees,
  };
};

// Simulate data storage
let mockData = generateMockData();

// Data service
export const dataService = {
  // Students
  getStudents: () => mockData.students,
  getStudentById: (id: string) => mockData.students.find(s => s.id === id),
  addStudent: (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: `STU${(mockData.students.length + 1).toString().padStart(4, "0")}`,
    };
    mockData.students.push(newStudent);
    return newStudent;
  },
  updateStudent: (id: string, data: Partial<Student>) => {
    const index = mockData.students.findIndex(s => s.id === id);
    if (index !== -1) {
      mockData.students[index] = { ...mockData.students[index], ...data };
      return mockData.students[index];
    }
    return null;
  },
  deleteStudent: (id: string) => {
    mockData.students = mockData.students.filter(s => s.id !== id);
    return true;
  },
  
  // Marks
  getMarks: () => mockData.marks,
  getMarksByStudentId: (studentId: string) => mockData.marks.filter(m => m.studentId === studentId),
  addMarks: (marks: Omit<Marks, "id">) => {
    const newMarks = { ...marks, id: generateId() };
    mockData.marks.push(newMarks);
    return newMarks;
  },
  updateMarks: (id: string, data: Partial<Marks>) => {
    const index = mockData.marks.findIndex(m => m.id === id);
    if (index !== -1) {
      mockData.marks[index] = { ...mockData.marks[index], ...data };
      return mockData.marks[index];
    }
    return null;
  },
  
  // Attendance
  getAttendance: () => mockData.attendance,
  getAttendanceByStudentId: (studentId: string) => mockData.attendance.filter(a => a.studentId === studentId),
  addAttendance: (attendance: Omit<Attendance, "id">) => {
    const newAttendance = { ...attendance, id: generateId() };
    mockData.attendance.push(newAttendance);
    return newAttendance;
  },
  updateAttendance: (id: string, data: Partial<Attendance>) => {
    const index = mockData.attendance.findIndex(a => a.id === id);
    if (index !== -1) {
      mockData.attendance[index] = { ...mockData.attendance[index], ...data };
      return mockData.attendance[index];
    }
    return null;
  },
  
  // Fees
  getFees: () => mockData.fees,
  getFeeByStudentId: (studentId: string) => mockData.fees.find(f => f.studentId === studentId),
  addFee: (fee: Omit<Fee, "id">) => {
    const newFee = { ...fee, id: generateId() };
    mockData.fees.push(newFee);
    return newFee;
  },
  updateFee: (id: string, data: Partial<Fee>) => {
    const index = mockData.fees.findIndex(f => f.id === id);
    if (index !== -1) {
      mockData.fees[index] = { ...mockData.fees[index], ...data };
      return mockData.fees[index];
    }
    return null;
  },
  addFeeExpense: (feeId: string, expense: Omit<Fee["expenses"][0], "id">) => {
    const index = mockData.fees.findIndex(f => f.id === feeId);
    if (index !== -1) {
      const newExpense = { ...expense, id: generateId() };
      mockData.fees[index].expenses.push(newExpense);
      return newExpense;
    }
    return null;
  },
  updateFeeInstallment: (feeId: string, installmentId: string, data: Partial<Fee["installments"][0]>) => {
    const feeIndex = mockData.fees.findIndex(f => f.id === feeId);
    if (feeIndex !== -1) {
      const installmentIndex = mockData.fees[feeIndex].installments.findIndex(i => i.id === installmentId);
      if (installmentIndex !== -1) {
        mockData.fees[feeIndex].installments[installmentIndex] = {
          ...mockData.fees[feeIndex].installments[installmentIndex],
          ...data,
        };
        return mockData.fees[feeIndex].installments[installmentIndex];
      }
    }
    return null;
  },
};
