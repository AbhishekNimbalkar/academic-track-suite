
-- Create 'exams' table
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name TEXT NOT NULL,
  class TEXT NOT NULL,
  medium TEXT NOT NULL,
  passing_marks INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  exam_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can select
CREATE POLICY "Admins can select all exams"
  ON public.exams
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy: Only admins can insert
CREATE POLICY "Admins can insert exams"
  ON public.exams
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy: Only admins can update
CREATE POLICY "Admins can update exams"
  ON public.exams
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy: Only admins can delete
CREATE POLICY "Admins can delete exams"
  ON public.exams
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));
