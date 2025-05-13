import { Student, Marks, Attendance, Fee, AttendanceRecord, AcademicRecord, FeeRecord, BookIssue } from "@/types/models";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate mock students
export const generateMockStudents = (count: number): Student[] => {
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C"];
  const residentialTypes: ("residential" | "non-residential")[] = ["residential", "non-residential"];
  
  return Array.from({ length: count }).map((_, index) => {
    const studentClass = classes[Math.floor(Math.random() * classes.length)];
    const studentSection = sections[Math.floor(Math.random() * sections.length)];
    const residentialType = residentialTypes[Math.floor(Math.random() * residentialTypes.length)];
    
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
      admissionClass: studentClass, // Set admission class to current class for mock data
      parentName: `Parent of Student ${index + 1}`,
      parentEmail: `parent${index + 1}@example.com`,
      parentPhone: `+91${Math.floor(Math.random() * 10000000000).toString().padStart(10, "0")}`,
      address: `Address of Student ${index + 1}`,
      medicalInfo: Math.random() > 0.7 ? "No medical issues" : "Allergic to peanuts",
      residentialType: residentialType,
      caste: Math.random() > 0.5 ? "General" : "OBC",
      aadhaarNumber: `${Math.floor(Math.random() * 10000000000).toString().padStart(12, "0")}`,
      panCardNumber: `ABCDE${Math.floor(Math.random() * 10000)}F`,
    };
  });
};

// Generate mock marks
export const generateMockMarks = (students: Student[]): Marks[] => {
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Hindi"];
  const academicYears = ["2022-2023", "2023-2024"];
  const examTypes = ["midterm", "final", "quarterly", "halfYearly"] as const;
  
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
          examType: examTypes[Math.floor(Math.random() * examTypes.length)],
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

// Data service with enhanced features for role sharing
export const dataService = {
  // Students
  getStudents: () => mockData.students,
  getStudentById: (id: string) => mockData.students.find(s => s.id === id),
  getResidentialStudents: () => mockData.students.filter(s => s.residentialType === "residential"),
  getNonResidentialStudents: () => mockData.students.filter(s => s.residentialType === "non-residential"),
  addStudent: (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: `STU${(mockData.students.length + 1).toString().padStart(4, "0")}`,
      admissionClass: student.class || "1", // Set admission class to current class if not provided
    };
    mockData.students.push(newStudent);
    
    // If this is a new student, automatically create fee records
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    const totalAmount = 59000;
    const medicalAndStationaryPool = newStudent.residentialType === "residential" ? 9000 : 5000;
    
    const newFee = {
      id: generateId(),
      studentId: newStudent.id,
      studentName: newStudent.fullName,
      academicYear,
      totalAmount,
      medicalAndStationaryPool,
      installments: [
        {
          id: generateId(),
          dueDate: `${currentYear}-06-15`,
          amount: (totalAmount - medicalAndStationaryPool) / 2,
          status: "due" as const,
        },
        {
          id: generateId(),
          dueDate: `${currentYear}-11-15`,
          amount: (totalAmount - medicalAndStationaryPool) / 2,
          status: "due" as const,
        },
      ],
      expenses: [],
    };
    
    mockData.fees.push(newFee);
    
    return newStudent;
  },
  updateStudent: (id: string, data: Partial<Student>) => {
    const index = mockData.students.findIndex(s => s.id === id);
    if (index !== -1) {
      mockData.students[index] = { ...mockData.students[index], ...data };
      
      // Update related records (fees, marks, attendance) if name changed
      if (data.fullName) {
        // Update fee records
        mockData.fees.forEach(fee => {
          if (fee.studentId === id) {
            fee.studentName = data.fullName!;
          }
        });
        
        // Update marks records
        mockData.marks.forEach(mark => {
          if (mark.studentId === id) {
            mark.studentName = data.fullName!;
          }
        });
        
        // Update attendance records
        mockData.attendance.forEach(record => {
          if (record.studentId === id) {
            record.studentName = data.fullName!;
          }
        });
      }
      
      return mockData.students[index];
    }
    return null;
  },
  deleteStudent: (id: string) => {
    // Delete student
    mockData.students = mockData.students.filter(s => s.id !== id);
    
    // Delete related records
    mockData.fees = mockData.fees.filter(f => f.studentId !== id);
    mockData.marks = mockData.marks.filter(m => m.studentId !== id);
    mockData.attendance = mockData.attendance.filter(a => a.studentId !== id);
    
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
  
  // Fees with enhanced role access
  getFees: () => mockData.fees,
  getResidentialFees: () => {
    const residentialStudentIds = mockData.students
      .filter(s => s.residentialType === "residential")
      .map(s => s.id);
    
    return mockData.fees.filter(fee => 
      residentialStudentIds.includes(fee.studentId)
    );
  },
  getNonResidentialFees: () => {
    const nonResidentialStudentIds = mockData.students
      .filter(s => s.residentialType === "non-residential" || !s.residentialType)
      .map(s => s.id);
    
    return mockData.fees.filter(fee => 
      nonResidentialStudentIds.includes(fee.studentId)
    );
  },
  getFeeByStudentId: (studentId: string) => mockData.fees.find(f => f.studentId === studentId),
  
  // Fees with enhanced role access
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
  
  // Student promotion
  promoteStudent: (studentId: string, newClass: string, newSection: string) => {
    const index = mockData.students.findIndex(s => s.id === studentId);
    if (index !== -1) {
      const student = mockData.students[index];
      
      // Archive current academic year data before promotion
      const academicHistory = student.academicHistory || [];
      const currentYear = new Date().getFullYear();
      const currentAcademicYear = `${currentYear-1}-${currentYear}`;
      
      // Get marks, attendance and fees for current academic year
      const studentMarks = mockData.marks.filter(m => 
        m.studentId === studentId && m.academicYear === currentAcademicYear
      );
      
      const studentAttendance = mockData.attendance.filter(a => 
        a.studentId === studentId
      );
      
      // Group attendance by month
      const attendanceByMonth: {[key: string]: AttendanceRecord} = {};
      studentAttendance.forEach(record => {
        const date = new Date(record.date);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month}`;
        
        if (!attendanceByMonth[key]) {
          attendanceByMonth[key] = {
            month: (month + 1).toString(),
            year: year.toString(),
            daysPresent: 0,
            daysAbsent: 0,
            daysLate: 0,
            totalDays: 0
          };
        }
        
        attendanceByMonth[key].totalDays++;
        if (record.status === "present") attendanceByMonth[key].daysPresent++;
        if (record.status === "absent") attendanceByMonth[key].daysAbsent++;
        if (record.status === "late") attendanceByMonth[key].daysLate++;
      });
      
      const studentFees = mockData.fees.find(f => 
        f.studentId === studentId && f.academicYear === currentAcademicYear
      );
      
      // Create academic record for the current year
      const academicRecord: AcademicRecord = {
        id: generateId(),
        studentId,
        academicYear: currentAcademicYear,
        class: student.class,
        section: student.section,
        marks: studentMarks,
        attendance: Object.values(attendanceByMonth),
        fees: studentFees ? {
          academicYear: studentFees.academicYear,
          totalFee: studentFees.totalAmount,
          medicalStationaryPool: studentFees.medicalAndStationaryPool,
          paidAmount: studentFees.installments
            .filter(i => i.status === "paid")
            .reduce((sum, i) => sum + i.amount, 0),
          dueAmount: studentFees.installments
            .filter(i => i.status !== "paid")
            .reduce((sum, i) => sum + i.amount, 0),
          installments: studentFees.installments
        } : {
          academicYear: currentAcademicYear,
          totalFee: 0,
          medicalStationaryPool: 0,
          paidAmount: 0,
          dueAmount: 0,
          installments: []
        }
      };
      
      academicHistory.push(academicRecord);
      
      // Update student record with promotion
      mockData.students[index] = {
        ...student,
        class: newClass,
        section: newSection,
        academicHistory
      };
      
      // Create new fee record for the next academic year
      const nextAcademicYear = `${currentYear}-${currentYear+1}`;
      const totalAmount = 59000;
      const medicalAndStationaryPool = student.residentialType === "residential" ? 9000 : 5000;
      
      const newFee = {
        id: generateId(),
        studentId,
        studentName: student.fullName,
        academicYear: nextAcademicYear,
        totalAmount,
        medicalAndStationaryPool,
        installments: [
          {
            id: generateId(),
            dueDate: `${currentYear}-06-15`,
            amount: (totalAmount - medicalAndStationaryPool) / 2,
            status: "due" as const,
          },
          {
            id: generateId(),
            dueDate: `${currentYear}-11-15`,
            amount: (totalAmount - medicalAndStationaryPool) / 2,
            status: "due" as const,
          },
        ],
        expenses: [],
      };
      
      mockData.fees.push(newFee);
      
      return mockData.students[index];
    }
    return null;
  },
  
  // Library functionality
  getBooks: () => [
    { id: "BOOK001", title: "Mathematics Fundamentals", author: "Sharma, R.D.", subject: "Mathematics", availability: 5 },
    { id: "BOOK002", title: "English Grammar", author: "Wren & Martin", subject: "English", availability: 3 },
    { id: "BOOK003", title: "Science for Grade 8", author: "NCERT", subject: "Science", availability: 7 },
    { id: "BOOK004", title: "History of India", author: "Thapar, Romila", subject: "History", availability: 2 },
    { id: "BOOK005", title: "Computer Science Basics", author: "Kanetkar, Y.P.", subject: "Computer Science", availability: 4 },
  ],
  
  getBookIssues: () => [
    { id: "ISSUE001", bookId: "BOOK001", bookTitle: "Mathematics Fundamentals", studentId: "STU0001", studentName: "Student 1", issueDate: "2023-05-10", dueDate: "2023-06-10", returnDate: "2023-06-05", status: "returned" as const },
    { id: "ISSUE002", bookId: "BOOK002", bookTitle: "English Grammar", studentId: "STU0002", studentName: "Student 2", issueDate: "2023-05-15", dueDate: "2023-06-15", status: "issued" as const },
    { id: "ISSUE003", bookId: "BOOK003", bookTitle: "Science for Grade 8", studentId: "STU0003", studentName: "Student 3", issueDate: "2023-06-01", dueDate: "2023-07-01", status: "issued" as const }
  ] as BookIssue[],
  
  // Stationary functionality
  getStationaryExpenses: () => [
    { id: "EXP001", studentId: "STU0001", studentName: "Student 1", date: "2023-04-15", amount: 1200, description: "Notebooks and textbooks", academic_year: "2023-2024" },
    { id: "EXP002", studentId: "STU0002", studentName: "Student 2", date: "2023-04-18", amount: 950, description: "Stationery items and uniform", academic_year: "2023-2024" },
    { id: "EXP003", studentId: "STU0003", studentName: "Student 3", date: "2023-05-02", amount: 1500, description: "Science lab equipment", academic_year: "2023-2024" }
  ],
  
  // Student promotion module
  getPromotionHistory: () => [
    { id: "PROM001", studentId: "STU0001", studentName: "Student 1", fromClass: "5", toClass: "6", fromSection: "A", toSection: "B", promotionDate: "2023-04-01", academicYear: "2023-2024" },
    { id: "PROM002", studentId: "STU0002", studentName: "Student 2", fromClass: "8", toClass: "9", fromSection: "C", toSection: "A", promotionDate: "2023-04-01", academicYear: "2023-2024" }
  ],
};
