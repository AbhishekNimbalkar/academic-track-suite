
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TeacherSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TeacherSearchBar: React.FC<TeacherSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search teachers by name, ID, subjects or classes..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
