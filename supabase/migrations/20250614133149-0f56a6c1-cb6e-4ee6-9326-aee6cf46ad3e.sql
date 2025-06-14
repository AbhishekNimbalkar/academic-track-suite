
-- 1. Funds/balances per student
CREATE TABLE public.stationary_expense_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  initial_amount NUMERIC NOT NULL,
  total_expenses NUMERIC NOT NULL DEFAULT 0,
  remaining_balance NUMERIC NOT NULL,
  academic_year TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Individual stationary expenses
CREATE TABLE public.stationary_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES public.stationary_expense_funds(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT (CURRENT_DATE),
  academic_year TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Common (shared) stationary expenses, e.g. "chart paper for all students"
CREATE TABLE public.stationary_common_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  amount_per_student NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT (CURRENT_DATE),
  academic_year TEXT NOT NULL,
  class TEXT, -- optional: for a class or all
  section TEXT,
  students_affected UUID[] NOT NULL,
  added_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on the new tables
ALTER TABLE public.stationary_expense_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stationary_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stationary_common_expenses ENABLE ROW LEVEL SECURITY;

-- Admin, stationary, and medical roles (from user_profiles) can view and manage all stationary data.

-- Allow SELECT for users with allowed roles
CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_expense_funds
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_expenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_common_expenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

-- Allow INSERT for users with allowed roles
CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_expense_funds
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_expenses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_common_expenses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

-- Allow UPDATE/DELETE for same roles
CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_expense_funds
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_expenses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_common_expenses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_expense_funds
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_expenses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_common_expenses
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'stationary' OR role = 'medical')
    )
  );
