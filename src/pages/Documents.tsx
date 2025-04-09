
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Search,
  Download,
  Printer,
  Plus,
  File
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
  id: string;
  studentId: string;
  studentName: string;
  type: "bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt";
  generatedDate: string;
  academicYear: string;
  class: string;
  section: string;
  status: "generated" | "downloaded" | "printed";
}

const Documents: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [documentType, setDocumentType] = useState<"bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt">("bonafide");
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("2023-2024");

  // Mock documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "DOC001",
      studentId: "STU001",
      studentName: "John Doe",
      type: "bonafide",
      generatedDate: "2023-05-15",
      academicYear: "2023-2024",
      class: "10",
      section: "A",
      status: "generated"
    },
    {
      id: "DOC002",
      studentId: "STU002",
      studentName: "Jane Smith",
      type: "marksheet",
      generatedDate: "2023-06-20",
      academicYear: "2023-2024",
      class: "9",
      section: "B",
      status: "downloaded"
    },
    {
      id: "DOC003",
      studentId: "STU003",
      studentName: "Bob Johnson",
      type: "fee_receipt",
      generatedDate: "2023-07-10",
      academicYear: "2023-2024",
      class: "11",
      section: "A",
      status: "printed"
    }
  ]);

  // Filter documents based on search query and selected tab
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && doc.type === selectedTab;
  });

  const handleGenerateDocument = () => {
    // In a real app, this would call an API to generate the document
    const newDocument: Document = {
      id: `DOC${documents.length + 1}`.padStart(6, '0'),
      studentId,
      studentName: "Generated Student", // In a real app, fetch from database
      type: documentType,
      generatedDate: new Date().toISOString().split('T')[0],
      academicYear,
      class: "10", // In a real app, fetch from database
      section: "A", // In a real app, fetch from database
      status: "generated"
    };
    
    setDocuments([...documents, newDocument]);
    setIsGenerateDialogOpen(false);
    
    toast({
      title: "Document Generated",
      description: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} has been generated successfully.`,
    });
  };

  const handleDownload = (document: Document) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download Started",
      description: `Downloading ${document.type} for ${document.studentName}.`,
    });
    
    // Update document status
    setDocuments(
      documents.map(doc => 
        doc.id === document.id ? { ...doc, status: "downloaded" } : doc
      )
    );
  };

  const handlePrint = (document: Document) => {
    // In a real app, this would open a print dialog
    toast({
      title: "Print Dialog",
      description: `Preparing to print ${document.type} for ${document.studentName}.`,
    });
    
    // Update document status
    setDocuments(
      documents.map(doc => 
        doc.id === document.id ? { ...doc, status: "printed" } : doc
      )
    );
  };

  const documentTypeDisplay = (type: string) => {
    switch(type) {
      case "bonafide": return "Bonafide Certificate";
      case "marksheet": return "Mark Sheet";
      case "transfer": return "Transfer Certificate";
      case "character": return "Character Certificate";
      case "fee_receipt": return "Fee Receipt";
      default: return type;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          {isAdmin && (
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Generate New Document</DialogTitle>
                  <DialogDescription>
                    Select the document type and student details to generate a new document.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select 
                      value={documentType} 
                      onValueChange={(value) => setDocumentType(value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bonafide">Bonafide Certificate</SelectItem>
                        <SelectItem value="marksheet">Mark Sheet</SelectItem>
                        <SelectItem value="transfer">Transfer Certificate</SelectItem>
                        <SelectItem value="character">Character Certificate</SelectItem>
                        <SelectItem value="fee_receipt">Fee Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Enter student ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select 
                      value={academicYear} 
                      onValueChange={setAcademicYear}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2022-2023">2022-2023</SelectItem>
                        <SelectItem value="2021-2022">2021-2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateDocument}>Generate Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              Generate, view, and download various documents for students
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, ID or document ID..."
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
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="bonafide">Bonafide</TabsTrigger>
                <TabsTrigger value="marksheet">Mark Sheets</TabsTrigger>
                <TabsTrigger value="fee_receipt">Fee Receipts</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                <TabsTrigger value="character">Character</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated Date</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>{document.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{document.studentName}</p>
                            <p className="text-xs text-muted-foreground">{document.studentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            {documentTypeDisplay(document.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(document.generatedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{document.academicYear}</TableCell>
                        <TableCell>{document.class} {document.section}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              document.status === "generated"
                                ? "bg-blue-100 text-blue-800"
                                : document.status === "downloaded"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(document)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrint(document)}
                            >
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No documents found. Try adjusting your search or generate a new document.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
