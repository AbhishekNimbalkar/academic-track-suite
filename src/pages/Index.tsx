
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, BookOpen, Calculator, Calendar } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">School Management System</h1>
          </div>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Streamline Your School Operations
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive school management solution for administrators and teachers. 
            Manage students, fees, attendance, academics, and more in one place.
          </p>
          <Button asChild size="lg">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive student records, admissions, and profile management
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track fees, installments, expenses, and financial records
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Attendance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Digital attendance management with detailed reporting
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Academic Records</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Marks management, report cards, and academic performance tracking
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Demo Access</CardTitle>
              <CardDescription className="text-center">
                Try the system with these demo credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Administrator</h4>
                  <p className="text-sm text-muted-foreground mb-2">Full system access</p>
                  <p className="font-mono text-sm">admin@school.com</p>
                  <p className="font-mono text-sm">admin123</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Teacher</h4>
                  <p className="text-sm text-muted-foreground mb-2">Teacher portal access</p>
                  <p className="font-mono text-sm">teacher@school.com</p>
                  <p className="font-mono text-sm">teacher123</p>
                </div>
              </div>
              <div className="text-center">
                <Button asChild>
                  <Link to="/login">Login Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 School Management System. Built for educational institutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
