
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, BookOpen, BarChart, LogIn, UserPlus, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">SchoolMS</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/create-admin">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Create Admin
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-8">
            <School className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            School Management System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your school operations with our comprehensive management platform. 
            Handle students, teachers, academics, and administration all in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Comprehensive student records, admissions, and academic tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Student registration and profiles</li>
                <li>• Academic history tracking</li>
                <li>• Parent communication</li>
                <li>• Attendance monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Academic Excellence</CardTitle>
              <CardDescription>
                Manage curriculum, exams, and student performance effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Grade and marks management</li>
                <li>• Exam scheduling</li>
                <li>• Report card generation</li>
                <li>• Performance analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Administrative Tools</CardTitle>
              <CardDescription>
                Powerful admin features for efficient school operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Fee management</li>
                <li>• Teacher administration</li>
                <li>• Library management</li>
                <li>• Document generation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            <Link to="/create-admin">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Create Admin</h3>
                  <p className="text-sm text-gray-600">Set up first admin account</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/signup">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <UserPlus className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Sign Up</h3>
                  <p className="text-sm text-gray-600">Create a new account</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <LogIn className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Login</h3>
                  <p className="text-sm text-gray-600">Access your account</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Admin Credentials Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Default Admin Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> admin@school.com</p>
                <p><strong>Password:</strong> admin123</p>
                <p className="text-blue-700 mt-3">
                  Use these credentials to login as administrator, or create a new admin account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <School className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">SchoolMS</span>
            </div>
            <p className="text-gray-600">
              Comprehensive school management made simple
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
