
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateAdmin from "./pages/CreateAdmin";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Academics from "./pages/Academics";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Settings from "./pages/Settings";
import StudentAdmission from "./pages/StudentAdmission";
import Notifications from "./pages/Notifications";
import Documents from "./pages/Documents";
import Library from "./pages/Library";
import Books from "./pages/Books";
import BookIssues from "./pages/BookIssues";
import Stationary from "./pages/Stationary";
import Expenses from "./pages/Expenses";
import StudentPromotion from "./pages/StudentPromotion";
import MyClasses from "./pages/MyClasses";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/create-admin" 
                element={
                  <PublicRoute>
                    <CreateAdmin />
                  </PublicRoute>
                } 
              />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students" 
                element={
                  <ProtectedRoute>
                    <Students />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teachers" 
                element={
                  <ProtectedRoute>
                    <Teachers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/academics" 
                element={
                  <ProtectedRoute>
                    <Academics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fees" 
                element={
                  <ProtectedRoute>
                    <Fees />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-admission" 
                element={
                  <ProtectedRoute>
                    <StudentAdmission />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/library" 
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books" 
                element={
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/book-issues" 
                element={
                  <ProtectedRoute>
                    <BookIssues />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/stationary" 
                element={
                  <ProtectedRoute>
                    <Stationary />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/expenses" 
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-promotion" 
                element={
                  <ProtectedRoute>
                    <StudentPromotion />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-classes" 
                element={
                  <ProtectedRoute>
                    <MyClasses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/applications" 
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
