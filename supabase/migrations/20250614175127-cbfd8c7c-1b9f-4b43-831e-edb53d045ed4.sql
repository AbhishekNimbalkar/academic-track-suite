
-- Create exams table if it doesn't exist (checking current structure)
-- The exams table already exists, so we'll create the marks table for exam results

-- Create exam_marks table to store student marks for specific exams
CREATE TABLE IF NOT EXISTS public.exam_marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  subject TEXT NOT NULL,
  marks_obtained NUMERIC NOT NULL CHECK (marks_obtained >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(exam_id, student_id, subject)
);

-- Add Row Level Security (RLS) to ensure proper access control
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_marks table
CREATE POLICY "Users can view exam marks" 
  ON public.exam_marks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins and teachers can insert exam marks" 
  ON public.exam_marks 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins and teachers can update exam marks" 
  ON public.exam_marks 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Admins and teachers can delete exam marks" 
  ON public.exam_marks 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Add RLS policies for the existing exams table
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view exams" 
  ON public.exams 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins and teachers can insert exams" 
  ON public.exams 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins and teachers can update exams" 
  ON public.exams 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Admins and teachers can delete exams" 
  ON public.exams 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Create an updated_at trigger for exam_marks
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exam_marks_updated_at
  BEFORE UPDATE ON public.exam_marks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
