
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResidentialStudent {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  current_class: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
}

const ResidentialStudents: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Check if user has permission
  if (!hasPermission("view_residential_students") && !hasPermission("manage_students")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [students, setStudents] = useState<ResidentialStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch residential students from Supabase
  useEffect(() => {
    const fetchResidentialStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('residential_type', 'residential');
        
        if (error) {
          console.error('Error fetching residential students:', error);
          toast({
            title: "Error",
            description: "Failed to fetch residential students",
            variant: "destructive",
          });
          return;
        }

        setStudents(data || []);
      } catch (error) {
        console.error('Error fetching residential students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch residential students",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResidentialStudents();
  }, [toast]);
  
  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.current_class.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Residential Students</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading residential students...</div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Residential Students</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Residential Student Records</CardTitle>
            <CardDescription>
              View all students staying in the residential facility ({students.length} total)
            </CardDescription>
            <div className="flex items-center mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search residential students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery ? "No residential students found matching your search." : "No residential students found."}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.student_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Class {student.current_class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.parent_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.parent_phone}
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
    </MainLayout>
  );
};

export default ResidentialStudents;
