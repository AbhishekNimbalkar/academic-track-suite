
-- Create students_attendance table to store daily attendance records
CREATE TABLE IF NOT EXISTS public.students_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  medium TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  comment TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.students_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for students_attendance
CREATE POLICY "Users can view attendance records" 
  ON public.students_attendance 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins and teachers can insert attendance" 
  ON public.students_attendance 
  FOR INSERT 
  WITH CHECK (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can update attendance" 
  ON public.students_attendance 
  FOR UPDATE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can delete attendance" 
  ON public.students_attendance 
  FOR DELETE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

-- Create updated_at trigger for students_attendance
CREATE TRIGGER update_students_attendance_updated_at
  BEFORE UPDATE ON public.students_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
