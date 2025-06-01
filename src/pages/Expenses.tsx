
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalDashboard } from "@/components/dashboard/MedicalDashboard";
import { StationaryDashboard } from "@/components/dashboard/StationaryDashboard";
import { MedicalExpenseManager } from "@/components/expenses/MedicalExpenseManager";
import { StationaryExpenseManager } from "@/components/expenses/StationaryExpenseManager";
import { ExpenseAnalytics } from "@/components/expenses/ExpenseAnalytics";

const Expenses: React.FC = () => {
  const { hasPermission } = useAuth();
  
  // Check if user has permission to access this page
  if (!hasPermission("manage_expenses") && !hasPermission("view_all_records")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Expense Management</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="stationary">Stationary</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MedicalDashboard />
              <StationaryDashboard />
            </div>
          </TabsContent>
          
          <TabsContent value="medical">
            <MedicalExpenseManager />
          </TabsContent>
          
          <TabsContent value="stationary">
            <StationaryExpenseManager />
          </TabsContent>

          <TabsContent value="analytics">
            <ExpenseAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Expenses;
