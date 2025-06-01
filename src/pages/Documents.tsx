
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/types/models";
import { Plus } from "lucide-react";
import { DocumentTemplateManager } from "@/components/documents/DocumentTemplateManager";
import { DocumentGenerator } from "@/components/documents/DocumentGenerator";
import { DocumentHistory } from "@/components/documents/DocumentHistory";

const Documents: React.FC = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  
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

  const handleDocumentGenerated = (document: Document) => {
    setDocuments([document, ...documents]);
    setIsGenerateDialogOpen(false);
  };

  const handleDownload = (document: Document) => {
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

  const handleView = (document: Document) => {
    toast({
      title: "Document Viewer",
      description: `Opening ${document.type} for ${document.studentName}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Document Management</h1>
          {isAdmin && (
            <Button onClick={() => setIsGenerateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Document
            </Button>
          )}
        </div>

        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <DocumentHistory
              documents={documents}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onView={handleView}
            />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            {isAdmin ? (
              <DocumentTemplateManager />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Only administrators can manage document templates.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DocumentGenerator
          isOpen={isGenerateDialogOpen}
          onOpenChange={setIsGenerateDialogOpen}
          onDocumentGenerated={handleDocumentGenerated}
        />
      </div>
    </MainLayout>
  );
};

export default Documents;
