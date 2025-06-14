
-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE id = user_id;
$$;

-- Drop existing problematic policies on exams table
DROP POLICY IF EXISTS "Users can view exams" ON public.exams;
DROP POLICY IF EXISTS "Admins and teachers can insert exams" ON public.exams;
DROP POLICY IF EXISTS "Admins and teachers can update exams" ON public.exams;
DROP POLICY IF EXISTS "Admins and teachers can delete exams" ON public.exams;

-- Create new policies using the security definer function
CREATE POLICY "Users can view exams" 
  ON public.exams 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins and teachers can insert exams" 
  ON public.exams 
  FOR INSERT 
  WITH CHECK (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can update exams" 
  ON public.exams 
  FOR UPDATE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can delete exams" 
  ON public.exams 
  FOR DELETE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

-- Fix exam_marks policies as well
DROP POLICY IF EXISTS "Admins and teachers can insert exam marks" ON public.exam_marks;
DROP POLICY IF EXISTS "Admins and teachers can update exam marks" ON public.exam_marks;
DROP POLICY IF EXISTS "Admins and teachers can delete exam marks" ON public.exam_marks;

CREATE POLICY "Admins and teachers can insert exam marks" 
  ON public.exam_marks 
  FOR INSERT 
  WITH CHECK (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can update exam marks" 
  ON public.exam_marks 
  FOR UPDATE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );

CREATE POLICY "Admins and teachers can delete exam marks" 
  ON public.exam_marks 
  FOR DELETE 
  USING (
    public.get_user_role() IN ('admin', 'teacher') OR 
    created_by = auth.uid()
  );
