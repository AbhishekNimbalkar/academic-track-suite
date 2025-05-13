
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Search } from "lucide-react";
import { dataService } from "@/services/mockData";
import { Book, BookIssue, Student } from "@/types/models";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Library: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  // Check if user has permission
  if (!hasPermission("manage_books") && !hasPermission("track_book_issues")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // State for book and issue tracking
  const [books, setBooks] = useState<Book[]>([]);
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("books");
  
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      const allBooks = dataService.getBooks();
      setBooks(allBooks);
      
      const allIssues = dataService.getBookIssues();
      setBookIssues(allIssues);
      
      const allStudents = dataService.getStudents();
      setStudents(allStudents);
    };
    
    fetchData();
  }, []);
  
  // Filter based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredIssues = bookIssues.filter(issue =>
    issue.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find book and student helpers
  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };
  
  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };
  
  // Handle issuing a book
  const handleIssueBook = () => {
    if (!selectedBook || !selectedStudent || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const book = getBookById(selectedBook);
    const student = getStudentById(selectedStudent);
    
    if (!book || !student) {
      toast({
        title: "Invalid Selection",
        description: "Selected book or student was not found.",
        variant: "destructive",
      });
      return;
    }
    
    if (book.availability <= 0) {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if student already has this book
    const existingIssue = bookIssues.find(
      issue => issue.studentId === selectedStudent && 
              issue.bookId === selectedBook &&
              issue.status === "issued"
    );
    
    if (existingIssue) {
      toast({
        title: "Book Already Issued",
        description: `This book is already issued to ${student.fullName}.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create new book issue
    const newIssue: BookIssue = {
      id: `ISSUE${bookIssues.length + 1}`.padStart(7, '0'),
      bookId: selectedBook,
      bookTitle: book.title,
      studentId: selectedStudent,
      studentName: student.fullName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: "issued",
    };
    
    // Update lists
    setBookIssues([...bookIssues, newIssue]);
    
    // Update book availability
    const updatedBooks = books.map(b => {
      if (b.id === selectedBook) {
        return { ...b, availability: b.availability - 1 };
      }
      return b;
    });
    
    setBooks(updatedBooks);
    
    toast({
      title: "Book Issued",
      description: `${book.title} has been issued to ${student.fullName}.`,
    });
    
    // Reset form
    setSelectedBook("");
    setSelectedStudent("");
    setDueDate("");
    setIsIssueBookOpen(false);
  };
  
  // Handle returning a book
  const handleReturnBook = (issueId: string) => {
    const issueIndex = bookIssues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
      toast({
        title: "Issue Not Found",
        description: "The selected book issue was not found.",
        variant: "destructive",
      });
      return;
    }
    
    const issue = bookIssues[issueIndex];
    const bookId = issue.bookId;
    
    // Update issue status
    const updatedIssues = [...bookIssues];
    updatedIssues[issueIndex] = {
      ...issue,
      status: "returned",
      returnDate: new Date().toISOString().split('T')[0],
    };
    
    setBookIssues(updatedIssues);
    
    // Update book availability
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        return { ...book, availability: book.availability + 1 };
      }
      return book;
    });
    
    setBooks(updatedBooks);
    
    toast({
      title: "Book Returned",
      description: `${issue.bookTitle} has been returned successfully.`,
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Library Management</h1>
          {hasPermission("manage_books") && (
            <Button onClick={() => setIsIssueBookOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Issue Book
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="issues">Book Issues</TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab === "books" ? "books" : "issues"}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="books" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Book Inventory</CardTitle>
                <CardDescription>
                  Manage and view all books in the library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBooks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            No books found.
                          </td>
                        </tr>
                      ) : (
                        filteredBooks.map((book) => (
                          <tr key={book.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {book.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`inline-flex rounded-full px-2 ${book.availability > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {book.availability} copies
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Book Issues</CardTitle>
                <CardDescription>
                  Track all issued books and their return status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredIssues.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            No book issues found.
                          </td>
                        </tr>
                      ) : (
                        filteredIssues.map((issue) => (
                          <tr key={issue.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.bookTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.studentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.issueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.dueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex rounded-full px-2 ${
                                issue.status === "issued" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : issue.status === "returned" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.status === "issued" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReturnBook(issue.id)}
                                >
                                  Return
                                </Button>
                              )}
                              {issue.status === "returned" && (
                                <span className="text-sm text-gray-500">
                                  {issue.returnDate || 'N/A'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Issue Book Dialog */}
      <Dialog open={isIssueBookOpen} onOpenChange={setIsIssueBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="book">Book</Label>
              <Select
                value={selectedBook}
                onValueChange={setSelectedBook}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {books
                    .filter(book => book.availability > 0)
                    .map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} ({book.availability} available)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName} (Class {student.class}-{student.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIssueBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueBook}>
              Issue Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Library;
