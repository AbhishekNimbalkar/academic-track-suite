
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Class } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ClassListProps {
  classes: Class[];
  onDeleteClass: (cls: Class) => void;
}

export const ClassList: React.FC<ClassListProps> = ({ classes, onDeleteClass }) => {
  return (
    <div className="space-y-4">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No classes found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">
                  {cls.className === "UKG" || cls.className === "LKG" ? cls.className : `Class ${cls.className}`}
                </TableCell>
                <TableCell>
                  <Badge variant={cls.medium === "English" ? "default" : "secondary"}>
                    {cls.medium}
                  </Badge>
                </TableCell>
                <TableCell>{cls.academicYear}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteClass(cls)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
