
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  Clock,
  FileCheck,
  UserPlus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdmissionApplication {
  id: string;
  applicationDate: string;
  studentName: string;
  dateOfBirth: string;
  class: string;
  section?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool?: string;
  previousGrade?: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  documents: {
    name: string;
    submitted: boolean;
  }[];
}

const Admissions: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<AdmissionApplication | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  // Mock admission applications data
  const [applications, setApplications] = useState<AdmissionApplication[]>([
    {
      id: "APP001",
      applicationDate: "2023-08-15",
      studentName: "Raj Kumar",
      dateOfBirth: "2013-05-20",
      class: "6",
      parentName: "Suresh Kumar",
      parentEmail: "suresh.kumar@example.com",
      parentPhone: "+91 9876543210",
      address: "123 Main Street, City Name",
      previousSchool: "ABC Public School",
      previousGrade: "5",
      status: "pending",
      documents: [
        { name: "Birth Certificate", submitted: true },
        { name: "Previous School Report Card", submitted: true },
        { name: "Medical Records", submitted: false },
        { name: "Address Proof", submitted: true }
      ]
    },
    {
      id: "APP002",
      applicationDate: "2023-08-10",
      studentName: "Priya Singh",
      dateOfBirth: "2012-07-15",
      class: "7",
      parentName: "Amit Singh",
      parentEmail: "amit.singh@example.com",
      parentPhone: "+91 9876543211",
      address: "456 Park Avenue, City Name",
      previousSchool: "XYZ School",
      previousGrade: "6",
      status: "approved",
      notes: "Excellent academic record. Accepted with scholarship.",
      documents: [
        { name: "Birth Certificate", submitted: true },
        { name: "Previous School Report Card", submitted: true },
        { name: "Medical Records", submitted: true },
        { name: "Address Proof", submitted: true }
      ]
    },
    {
      id: "APP003",
      applicationDate: "2023-08-18",
      studentName: "Arjun Khanna",
      dateOfBirth: "2014-03-10",
      class: "5",
      parentName: "Rahul Khanna",
      parentEmail: "rahul.khanna@example.com",
      parentPhone: "+91 9876543212",
      address: "789 Lake Road, City Name",
      previousSchool: "New Horizon School",
      previousGrade: "4",
      status: "rejected",
      notes: "Rejected due to class strength already at maximum capacity.",
      documents: [
        { name: "Birth Certificate", submitted: true },
        { name: "Previous School Report Card", submitted: false },
        { name: "Medical Records", submitted: false },
        { name: "Address Proof", submitted: true }
      ]
    }
  ]);

  const [newApplication, setNewApplication] = useState<Omit<AdmissionApplication, "id" | "status" | "documents">>({
    applicationDate: new Date().toISOString().split('T')[0],
    studentName: "",
    dateOfBirth: "",
    class: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    previousSchool: "",
    previousGrade: "",
    notes: ""
  });

  // Filter applications based on search query and selected tab
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && app.status === selectedTab;
  });

  const handleAddApplication = () => {
    const newApp: AdmissionApplication = {
      id: `APP${applications.length + 1}`.padStart(6, '0'),
      status: "pending",
      documents: [
        { name: "Birth Certificate", submitted: false },
        { name: "Previous School Report Card", submitted: false },
        { name: "Medical Records", submitted: false },
        { name: "Address Proof", submitted: false }
      ],
      ...newApplication
    };
    
    setApplications([...applications, newApp]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewApplication({
      applicationDate: new Date().toISOString().split('T')[0],
      studentName: "",
      dateOfBirth: "",
      class: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      previousSchool: "",
      previousGrade: "",
      notes: ""
    });
    
    toast({
      title: "Application Added",
      description: `Admission application for ${newApp.studentName} has been created.`,
    });
  };

  const handleDeleteApplication = () => {
    if (applicationToDelete) {
      setApplications(applications.filter(app => app.id !== applicationToDelete.id));
      setIsDeleteDialogOpen(false);
      setApplicationToDelete(null);
      
      toast({
        title: "Application Deleted",
        description: "The admission application has been deleted.",
      });
    }
  };

  const handleUpdateStatus = (id: string, status: "pending" | "approved" | "rejected") => {
    setApplications(
      applications.map(app => 
        app.id === id ? { ...app, status } : app
      )
    );
    
    // Update selected application if it's currently being viewed
    if (selectedApplication?.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        status
      });
    }
    
    toast({
      title: `Application ${status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Updated"}`,
      description: `The application status has been updated to ${status}.`,
    });
  };

  const handleDocumentUpdate = (applicationId: string, documentName: string, submitted: boolean) => {
    setApplications(
      applications.map(app => {
        if (app.id === applicationId) {
          return {
            ...app,
            documents: app.documents.map(doc => 
              doc.name === documentName ? { ...doc, submitted } : doc
            )
          };
        }
        return app;
      })
    );
    
    // Update selected application if it's currently being viewed
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication({
        ...selectedApplication,
        documents: selectedApplication.documents.map(doc => 
          doc.name === documentName ? { ...doc, submitted } : doc
        )
      });
    }
    
    toast({
      title: "Document Status Updated",
      description: `${documentName} marked as ${submitted ? "submitted" : "not submitted"}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Admission Applications</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>New Admission Application</DialogTitle>
                <DialogDescription>
                  Add a new student admission application to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={newApplication.studentName}
                      onChange={(e) => setNewApplication({...newApplication, studentName: e.target.value})}
                      placeholder="Student's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newApplication.dateOfBirth}
                      onChange={(e) => setNewApplication({...newApplication, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="class">Applying for Class</Label>
                  <Select 
                    value={newApplication.class} 
                    onValueChange={(value) => setNewApplication({...newApplication, class: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 12}, (_, i) => i + 1).map(cls => (
                        <SelectItem key={cls} value={cls.toString()}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input
                      id="parentName"
                      value={newApplication.parentName}
                      onChange={(e) => setNewApplication({...newApplication, parentName: e.target.value})}
                      placeholder="Parent's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Parent Email</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={newApplication.parentEmail}
                      onChange={(e) => setNewApplication({...newApplication, parentEmail: e.target.value})}
                      placeholder="parent@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    value={newApplication.parentPhone}
                    onChange={(e) => setNewApplication({...newApplication, parentPhone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newApplication.address}
                    onChange={(e) => setNewApplication({...newApplication, address: e.target.value})}
                    placeholder="Full residential address"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="previousSchool">Previous School</Label>
                    <Input
                      id="previousSchool"
                      value={newApplication.previousSchool}
                      onChange={(e) => setNewApplication({...newApplication, previousSchool: e.target.value})}
                      placeholder="Name of previous school"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousGrade">Previous Grade/Class</Label>
                    <Input
                      id="previousGrade"
                      value={newApplication.previousGrade}
                      onChange={(e) => setNewApplication({...newApplication, previousGrade: e.target.value})}
                      placeholder="e.g. 5th"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                    placeholder="Any additional information or notes"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddApplication}>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admission Applications</CardTitle>
            <CardDescription>
              Manage and process student admission applications
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, parent name or application ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs
              defaultValue="all"
              className="mt-4"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>{application.id}</TableCell>
                        <TableCell>
                          {new Date(application.applicationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {application.studentName}
                        </TableCell>
                        <TableCell>{application.class}</TableCell>
                        <TableCell>{application.parentName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {application.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {application.status === "approved" && <Check className="h-3 w-3 mr-1" />}
                            {application.status === "rejected" && <X className="h-3 w-3 mr-1" />}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setIsViewDetailsOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Application
                              </DropdownMenuItem>
                              
                              {application.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(application.id, "approved")}
                                  >
                                    <Check className="h-4 w-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(application.id, "rejected")}
                                  >
                                    <X className="h-4 w-4 mr-2 text-red-600" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {application.status === "approved" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
                                    Convert to Student
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setApplicationToDelete(application);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No applications found. Try adjusting your search or create a new application.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed information for application {selectedApplication?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Student Name</Label>
                  <p className="text-sm font-medium">{selectedApplication.studentName}</p>
                </div>
                <div className="space-y-1">
                  <Label>Date of Birth</Label>
                  <p className="text-sm font-medium">{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <Label>Applying for Class</Label>
                  <p className="text-sm font-medium">{selectedApplication.class}</p>
                </div>
                <div className="space-y-1">
                  <Label>Application Date</Label>
                  <p className="text-sm font-medium">{new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <p className="text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedApplication.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedApplication.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedApplication.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {selectedApplication.status === "approved" && <Check className="h-3 w-3 mr-1" />}
                      {selectedApplication.status === "rejected" && <X className="h-3 w-3 mr-1" />}
                      {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Parent Name</Label>
                    <p className="text-sm font-medium">{selectedApplication.parentName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Parent Email</Label>
                    <p className="text-sm font-medium">{selectedApplication.parentEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Parent Phone</Label>
                    <p className="text-sm font-medium">{selectedApplication.parentPhone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Address</Label>
                  <p className="text-sm font-medium">{selectedApplication.address}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Previous School Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Previous School</Label>
                    <p className="text-sm font-medium">{selectedApplication.previousSchool || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Previous Grade/Class</Label>
                    <p className="text-sm font-medium">{selectedApplication.previousGrade || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Required Documents</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedApplication.documents.map((doc) => (
                        <TableRow key={doc.name}>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                doc.submitted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {doc.submitted ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Submitted
                                </>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  Not Submitted
                                </>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentUpdate(
                                selectedApplication.id,
                                doc.name,
                                !doc.submitted
                              )}
                            >
                              {doc.submitted ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Mark as Not Submitted
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark as Submitted
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedApplication.notes && (
                <div className="space-y-1">
                  <Label>Notes</Label>
                  <p className="text-sm">{selectedApplication.notes}</p>
                </div>
              )}
              
              {selectedApplication.status === "pending" && (
                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleUpdateStatus(selectedApplication.id, "rejected");
                      setIsViewDetailsOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      handleUpdateStatus(selectedApplication.id, "approved");
                      setIsViewDetailsOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                </div>
              )}
              
              {selectedApplication.status === "approved" && (
                <div className="flex justify-end">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convert to Student
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the application for{" "}
              <span className="font-semibold">
                {applicationToDelete?.studentName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteApplication}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Admissions;
