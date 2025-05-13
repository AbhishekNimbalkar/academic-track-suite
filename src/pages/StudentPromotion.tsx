
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { dataService } from "@/services/mockData";
import { Student } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const StudentPromotion: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Only admin can access promotion module
  if (!hasPermission("promote_students")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [promotionClass, setPromotionClass] = useState("");
  const [promotionSection, setPromotionSection] = useState("");
  
  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = () => {
      const allStudents = dataService.getStudents();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
    };
    
    fetchStudents();
  }, []);
  
  // Filter students based on search and filters
  useEffect(() => {
    let result = students;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        student =>
          student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by class
    if (selectedClass) {
      result = result.filter(student => student.class === selectedClass);
    }
    
    // Filter by section
    if (selectedSection) {
      result = result.filter(student => student.section === selectedSection);
    }
    
    setFilteredStudents(result);
  }, [searchQuery, selectedClass, selectedSection, students]);
  
  // Get unique classes and sections for filters
  const classes = Array.from(new Set(students.map(s => s.class))).sort((a, b) => parseInt(a) - parseInt(b));
  const sections = Array.from(new Set(students.map(s => s.section))).sort();
  
  // Handle opening promotion dialog
  const handlePromoteClick = (student: Student) => {
    setSelectedStudent(student);
    // Default promotion class is next class
    const nextClass = (parseInt(student.class) + 1).toString();
    setPromotionClass(nextClass);
    setPromotionSection(student.section);
    setIsPromotionDialogOpen(true);
  };
  
  // Handle promotion confirmation
  const handlePromoteStudent = () => {
    if (!selectedStudent || !promotionClass || !promotionSection) {
      toast({
        title: "Missing Information",
        description: "Please select a class and section for promotion.",
        variant: "destructive"
      });
      return;
    }
    
    // Promote the student using data service
    const promotedStudent = dataService.promoteStudent(
      selectedStudent.id,
      promotionClass,
      promotionSection
    );
    
    if (promotedStudent) {
      // Update student list
      setStudents(prevStudents => 
        prevStudents.map(s => s.id === promotedStudent.id ? promotedStudent : s)
      );
      
      toast({
        title: "Student Promoted",
        description: `${promotedStudent.fullName} has been promoted to Class ${promotionClass}-${promotionSection}`,
      });
      
      // Close dialog and reset
      setIsPromotionDialogOpen(false);
      setSelectedStudent(null);
      setPromotionClass("");
      setPromotionSection("");
    } else {
      toast({
        title: "Promotion Failed",
        description: "Failed to promote student. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Promotion</h1>
          <p className="text-muted-foreground">
            Promote students to the next class with history tracking
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Search and Filter Students</CardTitle>
            <CardDescription>
              Find students by name, class or section
            </CardDescription>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sections</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        Section {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Initial Admission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Residential Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.class}-{student.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Class {student.admissionClass} ({student.admissionDate})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.residentialType === "residential" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {student.residentialType === "residential" ? "Residential" : "Non-Residential"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Button onClick={() => handlePromoteClick(student)} size="sm">
                            Promote
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Promotion Dialog */}
      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote Student</DialogTitle>
            <DialogDescription>
              Confirm details for student promotion. This will archive current academic records and create new entries for the next academic year.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Student Name:</p>
                  <p className="font-semibold">{selectedStudent.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Current Class:</p>
                  <p>{selectedStudent.class}-{selectedStudent.section}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="promotionClass">Promote to Class</Label>
                    <Select value={promotionClass} onValueChange={setPromotionClass}>
                      <SelectTrigger id="promotionClass">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="promotionSection">Section</Label>
                    <Select value={promotionSection} onValueChange={setPromotionSection}>
                      <SelectTrigger id="promotionSection">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePromoteStudent}>
              Confirm Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default StudentPromotion;
