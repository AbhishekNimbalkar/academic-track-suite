import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { dataService } from "@/services/mockData";
import { Student } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const StudentPromotion: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Check if user has permission to access this page
  if (!hasPermission("promote_students")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [promotionClass, setPromotionClass] = useState<string>("");
  const [promotionSection, setPromotionSection] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  
  // Fetch students
  useEffect(() => {
    const fetchStudents = () => {
      const allStudents = dataService.getStudents();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
    };
    
    fetchStudents();
  }, []);
  
  // Filter students based on class, section and search
  useEffect(() => {
    let filtered = students;
    
    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }
    
    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredStudents(filtered);
  }, [selectedClass, selectedSection, searchQuery, students]);
  
  const handleToggleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    
    setSelectedStudents(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      // If all are selected, deselect all
      setSelectedStudents(new Set());
    } else {
      // Otherwise select all filtered students
      const allIds = filteredStudents.map(student => student.id);
      setSelectedStudents(new Set(allIds));
    }
  };
  
  const handlePromoteStudents = () => {
    if (!promotionClass || !promotionSection) {
      toast({
        title: "Missing Information",
        description: "Please select the target class and section.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedStudents.size === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to promote.",
        variant: "destructive",
      });
      return;
    }
    
    // Process each selected student
    let promotedCount = 0;
    selectedStudents.forEach(studentId => {
      const result = dataService.promoteStudent(studentId, promotionClass, promotionSection);
      if (result) promotedCount++;
    });
    
    if (promotedCount > 0) {
      toast({
        title: "Students Promoted",
        description: `Successfully promoted ${promotedCount} students to Class ${promotionClass}-${promotionSection}.`,
      });
      
      // Refresh the student list
      const updatedStudents = dataService.getStudents();
      setStudents(updatedStudents);
      
      // Clear selections
      setSelectedStudents(new Set());
    } else {
      toast({
        title: "Promotion Failed",
        description: "Failed to promote students. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Student Promotion</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Students to Promote</CardTitle>
              <CardDescription>
                Filter and select students to promote to the next class
              </CardDescription>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="classFilter">Filter by Class</Label>
                  <Select 
                    onValueChange={setSelectedClass}
                    value={selectedClass}
                  >
                    <SelectTrigger id="classFilter">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
                        <SelectItem key={classNum} value={String(classNum)}>
                          Class {classNum}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sectionFilter">Filter by Section</Label>
                  <Select 
                    onValueChange={setSelectedSection}
                    value={selectedSection}
                  >
                    <SelectTrigger id="sectionFilter">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sections</SelectItem>
                      {['A', 'B', 'C', 'D'].map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="search">Search Students</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={
                              filteredStudents.length > 0 &&
                              selectedStudents.size === filteredStudents.length
                            }
                            onChange={handleSelectAll}
                          />
                          <span className="ml-2">Select All</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Class
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No students found matching the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className={selectedStudents.has(student.id) ? "bg-blue-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={selectedStudents.has(student.id)}
                              onChange={() => handleToggleSelectStudent(student.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Class {student.class}-{student.section}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Promotion Details</CardTitle>
              <CardDescription>
                Specify the target class and section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promotionClass">Promote to Class</Label>
                <Select 
                  onValueChange={setPromotionClass}
                  value={promotionClass}
                >
                  <SelectTrigger id="promotionClass">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
                      <SelectItem key={classNum} value={String(classNum)}>
                        Class {classNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="promotionSection">Assign Section</Label>
                <Select 
                  onValueChange={setPromotionSection}
                  value={promotionSection}
                >
                  <SelectTrigger id="promotionSection">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A', 'B', 'C', 'D'].map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handlePromoteStudents} 
                  className="w-full"
                  disabled={selectedStudents.size === 0 || !promotionClass || !promotionSection}
                >
                  Promote {selectedStudents.size} Student{selectedStudents.size !== 1 && 's'}
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 mt-4">
                <p>
                  <strong>Note:</strong> Promoting students will:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Update student class and section</li>
                  <li>Preserve academic history</li>
                  <li>Create new fee records</li>
                  <li>Reset attendance for new academic year</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentPromotion;
