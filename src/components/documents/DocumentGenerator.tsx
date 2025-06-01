
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Document, DocumentTemplateData } from "@/types/models";
import { FileText, Download, Printer } from "lucide-react";

interface DocumentGeneratorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentGenerated: (document: Document) => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  isOpen,
  onOpenChange,
  onDocumentGenerated
}) => {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<"bonafide" | "marksheet" | "transfer" | "character" | "fee_receipt">("bonafide");
  const [studentId, setStudentId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [academicYear, setAcademicYear] = useState("2023-2024");
  const [generatedDocument, setGeneratedDocument] = useState<Document | null>(null);
  const [previewContent, setPreviewContent] = useState("");

  // Mock student data
  const mockStudentData = {
    fullName: "John Doe",
    fatherName: "Robert Doe",
    motherName: "Mary Doe",
    dateOfBirth: "2005-03-15",
    class: "10",
    section: "A",
    rollNumber: "101",
    admissionDate: "2020-04-01",
    academicYear: "2023-2024"
  };

  const generateDocument = () => {
    if (!studentId) {
      toast({
        title: "Error",
        description: "Please enter a student ID.",
        variant: "destructive",
      });
      return;
    }

    const templateData: DocumentTemplateData = {
      studentDetails: mockStudentData,
      schoolDetails: {
        name: "ABC School",
        address: "123 School Street, City, State",
        principal: "Dr. Principal Name",
        affiliationNumber: "SCH123456"
      },
      purpose: purpose
    };

    let content = "";
    switch (documentType) {
      case "bonafide":
        content = `BONAFIDE CERTIFICATE

This is to certify that ${templateData.studentDetails.fullName}, son/daughter of ${templateData.studentDetails.fatherName}, is a bonafide student of class ${templateData.studentDetails.class} section ${templateData.studentDetails.section} of our school for the academic year ${templateData.studentDetails.academicYear}.

This certificate is issued for ${purpose || "official purposes"}.

Date: ${new Date().toLocaleDateString()}
Principal
${templateData.schoolDetails.name}`;
        break;
      case "character":
        content = `CHARACTER CERTIFICATE

This is to certify that ${templateData.studentDetails.fullName}, son/daughter of ${templateData.studentDetails.fatherName}, was a student of class ${templateData.studentDetails.class} section ${templateData.studentDetails.section} of our school.

During his/her stay in the institution, his/her conduct and character was found to be good and satisfactory.

Date: ${new Date().toLocaleDateString()}
Principal
${templateData.schoolDetails.name}`;
        break;
      case "transfer":
        content = `TRANSFER CERTIFICATE

This is to certify that ${templateData.studentDetails.fullName}, son/daughter of ${templateData.studentDetails.fatherName}, was a student of class ${templateData.studentDetails.class} section ${templateData.studentDetails.section} of our school.

Admission Date: ${templateData.studentDetails.admissionDate}
Date of Birth: ${templateData.studentDetails.dateOfBirth}
Academic Year: ${templateData.studentDetails.academicYear}

He/She has been granted transfer certificate as requested.

Date: ${new Date().toLocaleDateString()}
Principal
${templateData.schoolDetails.name}`;
        break;
      default:
        content = "Document content will be generated here.";
    }

    const document: Document = {
      id: `DOC${Date.now()}`,
      studentId,
      studentName: templateData.studentDetails.fullName,
      type: documentType,
      generatedDate: new Date().toISOString().split('T')[0],
      academicYear,
      class: templateData.studentDetails.class,
      section: templateData.studentDetails.section,
      status: "generated",
      templateData
    };

    setGeneratedDocument(document);
    setPreviewContent(content);
    onDocumentGenerated(document);

    toast({
      title: "Document Generated",
      description: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} certificate has been generated successfully.`,
    });
  };

  const handleDownload = () => {
    if (!generatedDocument) return;
    
    // Create a blob with the document content
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${generatedDocument.type}_${generatedDocument.studentName}_${generatedDocument.generatedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Download Started",
      description: "Document download has started.",
    });
  };

  const handlePrint = () => {
    if (!previewContent) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Print</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${previewContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Document</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonafide">Bonafide Certificate</SelectItem>
                  <SelectItem value="character">Character Certificate</SelectItem>
                  <SelectItem value="transfer">Transfer Certificate</SelectItem>
                  <SelectItem value="marksheet">Mark Sheet</SelectItem>
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
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2021-2022">2021-2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(documentType === "bonafide") && (
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Enter purpose for certificate"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={generateDocument} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </div>

            {generatedDocument && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Preview</Label>
            <Card>
              <CardContent className="p-4">
                {previewContent ? (
                  <pre className="whitespace-pre-wrap text-sm">{previewContent}</pre>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Generate a document to see preview
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
