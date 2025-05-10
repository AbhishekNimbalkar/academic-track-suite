
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Academics from "./pages/Academics";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Teachers from "./pages/Teachers";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Admissions from "./pages/Admissions";
import MyClasses from "./pages/MyClasses";
import NotFound from "./pages/NotFound";
import ResidentialFees from "./pages/ResidentialFees";
import NonResidentialFees from "./pages/NonResidentialFees";
import Expenses from "./pages/Expenses";
import ResidentialStudents from "./pages/ResidentialStudents";
import Books from "./pages/Books";
import BookIssues from "./pages/BookIssues";
import Applications from "./pages/Applications";
import Library from "./pages/Library";
import Stationary from "./pages/Stationary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/my-classes" element={<MyClasses />} />
            <Route path="/residential-fees" element={<ResidentialFees />} />
            <Route path="/non-residential-fees" element={<NonResidentialFees />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/residential-students" element={<ResidentialStudents />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book-issues" element={<BookIssues />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/library" element={<Library />} />
            <Route path="/stationary" element={<Stationary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
