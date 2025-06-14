
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";

const classes = [
  "UKG", "LKG", ...Array.from({length: 12}, (_, i) => i === 10 ? "11th (Arts Premilitary College)" : `${i + 1}th`)
];

const mediums = ["Marathi", "Semi-English"];

const AddExamSchema = z.object({
  exam_name: z.string().min(2),
  class: z.string(),
  medium: z.enum(["Marathi", "Semi-English"]),
  passing_marks: z.coerce.number().min(0),
  total_marks: z.coerce.number().min(1),
  exam_date: z.date(),
});

type AddExamSchemaType = z.infer<typeof AddExamSchema>;

export const AddExamForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<AddExamSchemaType>({
    resolver: zodResolver(AddExamSchema),
    defaultValues: {
      exam_name: "",
      class: "",
      medium: "Marathi",
      passing_marks: 0,
      total_marks: 100,
      exam_date: undefined,
    },
  });

  async function onSubmit(values: AddExamSchemaType) {
    if (!user) return;
    const { error } = await supabase
      .from("exams")
      .insert({
        exam_name: values.exam_name,
        class: values.class,
        medium: values.medium,
        passing_marks: values.passing_marks,
        total_marks: values.total_marks,
        exam_date: values.exam_date,
        created_by: user.id,
      });
    if (error) {
      toast({ title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Exam added!" });
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 max-w-lg">
        <FormField
          control={form.control}
          name="exam_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Name</FormLabel>
              <FormControl>
                <Input placeholder="Eg: FA1, SA2, Unit Test..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded-md px-3 py-2 text-base">
                  <option value="">Select Class</option>
                  {classes.map((cl) => (
                    <option key={cl} value={cl}>{cl}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medium</FormLabel>
              <FormControl>
                <select {...field} className="w-full border rounded-md px-3 py-2 text-base">
                  {mediums.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="passing_marks"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Passing Marks</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_marks"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Total Marks</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="exam_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Exam Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Add Exam</Button>
      </form>
    </Form>
  );
};
