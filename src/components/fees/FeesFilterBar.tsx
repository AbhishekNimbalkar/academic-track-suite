
import React from "react";
import { SearchBar } from "../students/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const FeesFilterBar: React.FC<FeesFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <CardHeader>
      <CardTitle>Student Fee Records</CardTitle>
      <CardDescription>
        Manage and track fee payments and expenses
      </CardDescription>
      <div className="flex items-center space-x-2 mt-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student name or ID..."
        />
      </div>
      <Tabs
        defaultValue="all"
        className="mt-4"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="due">Due</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
  );
};
