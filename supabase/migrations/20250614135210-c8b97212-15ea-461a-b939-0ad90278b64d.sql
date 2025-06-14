
-- For all stationary tables, replace any direct subquery to user_profiles with this function call:
-- Example for stationary_common_expenses (do the same for the other two stationary tables)

-- Drop potentially faulty existing policies
DROP POLICY IF EXISTS "Allow select for stationary roles" ON public.stationary_common_expenses;
DROP POLICY IF EXISTS "Allow insert for stationary roles" ON public.stationary_common_expenses;
DROP POLICY IF EXISTS "Allow update for stationary roles" ON public.stationary_common_expenses;
DROP POLICY IF EXISTS "Allow delete for stationary roles" ON public.stationary_common_expenses;

-- Recreate policies using get_user_role so there is no recursion:
CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_common_expenses
  FOR SELECT
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_common_expenses
  FOR INSERT
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_common_expenses
  FOR UPDATE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_common_expenses
  FOR DELETE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

-- Repeat the above DROP/CREATE for the other two tables:
DROP POLICY IF EXISTS "Allow select for stationary roles" ON public.stationary_expense_funds;
DROP POLICY IF EXISTS "Allow insert for stationary roles" ON public.stationary_expense_funds;
DROP POLICY IF EXISTS "Allow update for stationary roles" ON public.stationary_expense_funds;
DROP POLICY IF EXISTS "Allow delete for stationary roles" ON public.stationary_expense_funds;

CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_expense_funds
  FOR SELECT
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_expense_funds
  FOR INSERT
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_expense_funds
  FOR UPDATE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_expense_funds
  FOR DELETE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

DROP POLICY IF EXISTS "Allow select for stationary roles" ON public.stationary_expenses;
DROP POLICY IF EXISTS "Allow insert for stationary roles" ON public.stationary_expenses;
DROP POLICY IF EXISTS "Allow update for stationary roles" ON public.stationary_expenses;
DROP POLICY IF EXISTS "Allow delete for stationary roles" ON public.stationary_expenses;

CREATE POLICY "Allow select for stationary roles"
  ON public.stationary_expenses
  FOR SELECT
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow insert for stationary roles"
  ON public.stationary_expenses
  FOR INSERT
  WITH CHECK (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow update for stationary roles"
  ON public.stationary_expenses
  FOR UPDATE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );

CREATE POLICY "Allow delete for stationary roles"
  ON public.stationary_expenses
  FOR DELETE
  USING (
    public.get_user_role(auth.uid()) IN ('admin', 'stationary', 'medical')
  );
