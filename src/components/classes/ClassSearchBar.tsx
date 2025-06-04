
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClassSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ClassSearchBar: React.FC<ClassSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search classes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
