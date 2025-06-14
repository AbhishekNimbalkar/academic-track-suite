export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          id: string
          present: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          id?: string
          present: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          id?: string
          present?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          academic_year: string
          class_name: string
          created_at: string | null
          created_by: string | null
          id: string
          medium: string
        }
        Insert: {
          academic_year?: string
          class_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          medium?: string
        }
        Update: {
          academic_year?: string
          class_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          medium?: string
        }
        Relationships: []
      }
      exam_marks: {
        Row: {
          created_at: string
          created_by: string
          exam_id: string
          id: string
          marks_obtained: number
          student_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          exam_id: string
          id?: string
          marks_obtained: number
          student_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          exam_id?: string
          id?: string
          marks_obtained?: number
          student_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_marks_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          class: string
          created_at: string
          created_by: string
          exam_date: string
          exam_name: string
          id: string
          medium: string
          passing_marks: number
          total_marks: number
        }
        Insert: {
          class: string
          created_at?: string
          created_by: string
          exam_date: string
          exam_name: string
          id?: string
          medium: string
          passing_marks: number
          total_marks: number
        }
        Update: {
          class?: string
          created_at?: string
          created_by?: string
          exam_date?: string
          exam_name?: string
          id?: string
          medium?: string
          passing_marks?: number
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          academic_year: string
          created_at: string | null
          created_by: string | null
          id: string
          installment_1_amount: number
          installment_1_due_date: string
          installment_1_paid: boolean | null
          installment_1_paid_date: string | null
          installment_2_amount: number
          installment_2_due_date: string
          installment_2_paid: boolean | null
          installment_2_paid_date: string | null
          medical_stationary_amount: number
          student_id: string | null
          total_amount: number
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          installment_1_amount: number
          installment_1_due_date: string
          installment_1_paid?: boolean | null
          installment_1_paid_date?: string | null
          installment_2_amount: number
          installment_2_due_date: string
          installment_2_paid?: boolean | null
          installment_2_paid_date?: string | null
          medical_stationary_amount: number
          student_id?: string | null
          total_amount: number
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          installment_1_amount?: number
          installment_1_due_date?: string
          installment_1_paid?: boolean | null
          installment_1_paid_date?: string | null
          installment_2_amount?: number
          installment_2_due_date?: string
          installment_2_paid?: boolean | null
          installment_2_paid_date?: string | null
          medical_stationary_amount?: number
          student_id?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          academic_year: string
          created_at: string | null
          created_by: string | null
          exam_type: string
          id: string
          marks: number
          student_id: string | null
          subject: string
          total_marks: number
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          created_by?: string | null
          exam_type: string
          id?: string
          marks: number
          student_id?: string | null
          subject: string
          total_marks: number
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          created_by?: string | null
          exam_type?: string
          id?: string
          marks?: number
          student_id?: string | null
          subject?: string
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      stationary_common_expenses: {
        Row: {
          academic_year: string
          added_by: string | null
          amount_per_student: number
          class: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          section: string | null
          students_affected: string[]
          total_amount: number
        }
        Insert: {
          academic_year: string
          added_by?: string | null
          amount_per_student: number
          class?: string | null
          created_at?: string | null
          date?: string
          description: string
          id?: string
          section?: string | null
          students_affected: string[]
          total_amount: number
        }
        Update: {
          academic_year?: string
          added_by?: string | null
          amount_per_student?: number
          class?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          section?: string | null
          students_affected?: string[]
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "stationary_common_expenses_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stationary_expense_funds: {
        Row: {
          academic_year: string
          created_at: string | null
          id: string
          initial_amount: number
          remaining_balance: number
          section: string
          student_id: string
          total_expenses: number
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          id?: string
          initial_amount: number
          remaining_balance: number
          section?: string
          student_id: string
          total_expenses?: number
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          id?: string
          initial_amount?: number
          remaining_balance?: number
          section?: string
          student_id?: string
          total_expenses?: number
        }
        Relationships: [
          {
            foreignKeyName: "stationary_expense_funds_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      stationary_expenses: {
        Row: {
          academic_year: string
          amount: number
          class: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          fund_id: string
          id: string
          section: string
          student_id: string
        }
        Insert: {
          academic_year: string
          amount: number
          class: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description: string
          fund_id: string
          id?: string
          section: string
          student_id: string
        }
        Update: {
          academic_year?: string
          amount?: number
          class?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          fund_id?: string
          id?: string
          section?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stationary_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stationary_expenses_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "stationary_expense_funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stationary_expenses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string
          created_at: string | null
          created_by: string | null
          current_class: string
          date_of_birth: string
          first_name: string
          id: string
          last_name: string
          medical_details: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          residential_type: string | null
          stream: string | null
          student_id: string
        }
        Insert: {
          admission_date: string
          created_at?: string | null
          created_by?: string | null
          current_class: string
          date_of_birth: string
          first_name: string
          id?: string
          last_name: string
          medical_details?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          residential_type?: string | null
          stream?: string | null
          student_id: string
        }
        Update: {
          admission_date?: string
          created_at?: string | null
          created_by?: string | null
          current_class?: string
          date_of_birth?: string
          first_name?: string
          id?: string
          last_name?: string
          medical_details?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          residential_type?: string | null
          stream?: string | null
          student_id?: string
        }
        Relationships: []
      }
      students_attendance: {
        Row: {
          class: string
          comment: string | null
          created_at: string
          created_by: string
          date: string
          id: string
          medium: string
          status: string
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          class: string
          comment?: string | null
          created_at?: string
          created_by: string
          date: string
          id?: string
          medium: string
          status: string
          student_id: string
          student_name: string
          updated_at?: string
        }
        Update: {
          class?: string
          comment?: string | null
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          medium?: string
          status?: string
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      teacher_class_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          class_id: string
          id: string
          subject: string | null
          teacher_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          class_id: string
          id?: string
          subject?: string | null
          teacher_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          class_id?: string
          id?: string
          subject?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teachers: {
        Row: {
          address: string | null
          auth_user_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          joining_date: string
          last_name: string
          phone: string | null
          qualification: string | null
          subjects: string[] | null
          teacher_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          joining_date: string
          last_name: string
          phone?: string | null
          qualification?: string | null
          subjects?: string[] | null
          teacher_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          joining_date?: string
          last_name?: string
          phone?: string | null
          qualification?: string | null
          subjects?: string[] | null
          teacher_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id?: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
