// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      accounts_payable: {
        Row: {
          amount: number
          category_id: string | null
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          description: string
          expected_date: string
          id: string
          notes: string | null
          paid_date: string | null
          status: Database['public']['Enums']['payable_status']
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          expected_date: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          status?: Database['public']['Enums']['payable_status']
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          expected_date?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          status?: Database['public']['Enums']['payable_status']
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_payable_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'financial_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_payable_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'v_expenses_by_category'
            referencedColumns: ['category_id']
          },
          {
            foreignKeyName: 'accounts_payable_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_payable_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_payable_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['id']
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          category_id: string | null
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          description: string
          expected_date: string
          id: string
          notes: string | null
          received_date: string | null
          status: Database['public']['Enums']['receivable_status']
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description: string
          expected_date: string
          id?: string
          notes?: string | null
          received_date?: string | null
          status?: Database['public']['Enums']['receivable_status']
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          description?: string
          expected_date?: string
          id?: string
          notes?: string | null
          received_date?: string | null
          status?: Database['public']['Enums']['receivable_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_receivable_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'financial_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_receivable_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'v_expenses_by_category'
            referencedColumns: ['category_id']
          },
          {
            foreignKeyName: 'accounts_receivable_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_receivable_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'accounts_receivable_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['id']
          },
        ]
      }
      activities: {
        Row: {
          activity_date: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          percentage: number
          responsible: string | null
          status: Database['public']['Enums']['activity_status']
          title: string
          updated_at: string
        }
        Insert: {
          activity_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          percentage?: number
          responsible?: string | null
          status: Database['public']['Enums']['activity_status']
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          percentage?: number
          responsible?: string | null
          status?: Database['public']['Enums']['activity_status']
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      cashflow_snapshots: {
        Row: {
          actual_balance: number
          created_at: string
          expected_inflows: number
          expected_outflows: number
          id: string
          notes: string | null
          opening_balance: number
          projected_balance: number
          realized_inflows: number
          realized_outflows: number
          reference_date: string
          updated_at: string
        }
        Insert: {
          actual_balance?: number
          created_at?: string
          expected_inflows?: number
          expected_outflows?: number
          id?: string
          notes?: string | null
          opening_balance?: number
          projected_balance?: number
          realized_inflows?: number
          realized_outflows?: number
          reference_date: string
          updated_at?: string
        }
        Update: {
          actual_balance?: number
          created_at?: string
          expected_inflows?: number
          expected_outflows?: number
          id?: string
          notes?: string | null
          opening_balance?: number
          projected_balance?: number
          realized_inflows?: number
          realized_outflows?: number
          reference_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      counterparties: {
        Row: {
          created_at: string
          document_number: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          type: Database['public']['Enums']['counterparty_type']
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          type: Database['public']['Enums']['counterparty_type']
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          type?: Database['public']['Enums']['counterparty_type']
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string
          dimension: string | null
          id: string
          metadata: Json
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          dimension?: string | null
          id?: string
          metadata?: Json
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          dimension?: string | null
          id?: string
          metadata?: Json
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      financial_alerts: {
        Row: {
          alert_date: string
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json
          reference_id: string | null
          reference_table: string | null
          severity: Database['public']['Enums']['alert_severity']
          status: Database['public']['Enums']['alert_status']
          title: string
          updated_at: string
        }
        Insert: {
          alert_date?: string
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json
          reference_id?: string | null
          reference_table?: string | null
          severity: Database['public']['Enums']['alert_severity']
          status?: Database['public']['Enums']['alert_status']
          title: string
          updated_at?: string
        }
        Update: {
          alert_date?: string
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json
          reference_id?: string | null
          reference_table?: string | null
          severity?: Database['public']['Enums']['alert_severity']
          status?: Database['public']['Enums']['alert_status']
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: Database['public']['Enums']['transaction_type'] | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type?: Database['public']['Enums']['transaction_type'] | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: Database['public']['Enums']['transaction_type'] | null
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category_id: string
          competency_date: string | null
          cost_center_id: string | null
          counterparty_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          nature: Database['public']['Enums']['transaction_nature']
          notes: string | null
          status_label: string | null
          transaction_date: string
          type: Database['public']['Enums']['transaction_type']
          updated_at: string
        }
        Insert: {
          amount: number
          category_id: string
          competency_date?: string | null
          cost_center_id?: string | null
          counterparty_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          nature: Database['public']['Enums']['transaction_nature']
          notes?: string | null
          status_label?: string | null
          transaction_date: string
          type: Database['public']['Enums']['transaction_type']
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string
          competency_date?: string | null
          cost_center_id?: string | null
          counterparty_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          nature?: Database['public']['Enums']['transaction_nature']
          notes?: string | null
          status_label?: string | null
          transaction_date?: string
          type?: Database['public']['Enums']['transaction_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'financial_transactions_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'financial_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'v_expenses_by_category'
            referencedColumns: ['category_id']
          },
          {
            foreignKeyName: 'financial_transactions_cost_center_id_fkey'
            columns: ['cost_center_id']
            isOneToOne: false
            referencedRelation: 'cost_centers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_counterparty_id_fkey'
            columns: ['counterparty_id']
            isOneToOne: false
            referencedRelation: 'counterparties'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financial_transactions_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          role: Database['public']['Enums']['app_role']
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database['public']['Enums']['app_role']
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database['public']['Enums']['app_role']
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_activity_summary: {
        Row: {
          atividades_aguardando: number | null
          atividades_andamento: number | null
          atividades_ok: number | null
          atividades_parado: number | null
          percentual_em_andamento: number | null
          percentual_ok: number | null
          percentual_parado: number | null
          reference_date: string | null
          total_atividades: number | null
        }
        Relationships: []
      }
      v_cash_breakpoint: {
        Row: {
          projected_balance: number | null
          risk_level: string | null
          rupture_date: string | null
        }
        Relationships: []
      }
      v_expenses_by_category: {
        Row: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          total_expense: number | null
        }
        Relationships: []
      }
      v_financial_summary: {
        Row: {
          entrada_prevista: number | null
          entrada_realizada: number | null
          reference_date: string | null
          saida_prevista: number | null
          saida_realizada: number | null
          saldo_transacoes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database['public']['Enums']['app_role']
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      activity_status: 'OK' | 'Andamento' | 'Aguardando' | 'Parado'
      alert_severity: 'baixa' | 'media' | 'alta' | 'critica'
      alert_status: 'ativo' | 'resolvido' | 'ignorado'
      app_role: 'admin' | 'financeiro' | 'diretoria'
      counterparty_type: 'cliente' | 'fornecedor' | 'outro'
      payable_status: 'previsto' | 'pago' | 'vencido' | 'cancelado'
      receivable_status: 'previsto' | 'recebido' | 'atrasado' | 'cancelado'
      transaction_nature: 'previsto' | 'realizado'
      transaction_type: 'entrada' | 'saida'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_status: ['OK', 'Andamento', 'Aguardando', 'Parado'],
      alert_severity: ['baixa', 'media', 'alta', 'critica'],
      alert_status: ['ativo', 'resolvido', 'ignorado'],
      app_role: ['admin', 'financeiro', 'diretoria'],
      counterparty_type: ['cliente', 'fornecedor', 'outro'],
      payable_status: ['previsto', 'pago', 'vencido', 'cancelado'],
      receivable_status: ['previsto', 'recebido', 'atrasado', 'cancelado'],
      transaction_nature: ['previsto', 'realizado'],
      transaction_type: ['entrada', 'saida'],
    },
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts_payable
//   id: uuid (not null, default: gen_random_uuid())
//   supplier_id: uuid (nullable)
//   category_id: uuid (nullable)
//   cost_center_id: uuid (nullable)
//   description: text (not null)
//   amount: numeric (not null)
//   expected_date: date (not null)
//   paid_date: date (nullable)
//   status: payable_status (not null, default: 'previsto'::payable_status)
//   notes: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: accounts_receivable
//   id: uuid (not null, default: gen_random_uuid())
//   customer_id: uuid (nullable)
//   category_id: uuid (nullable)
//   cost_center_id: uuid (nullable)
//   description: text (not null)
//   amount: numeric (not null)
//   expected_date: date (not null)
//   received_date: date (nullable)
//   status: receivable_status (not null, default: 'previsto'::receivable_status)
//   notes: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: activities
//   id: uuid (not null, default: gen_random_uuid())
//   activity_date: date (not null)
//   title: text (not null)
//   responsible: text (nullable)
//   status: activity_status (not null)
//   percentage: numeric (not null, default: 0)
//   notes: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: cashflow_snapshots
//   id: uuid (not null, default: gen_random_uuid())
//   reference_date: date (not null)
//   opening_balance: numeric (not null, default: 0)
//   expected_inflows: numeric (not null, default: 0)
//   realized_inflows: numeric (not null, default: 0)
//   expected_outflows: numeric (not null, default: 0)
//   realized_outflows: numeric (not null, default: 0)
//   projected_balance: numeric (not null, default: 0)
//   actual_balance: numeric (not null, default: 0)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: cost_centers
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: counterparties
//   id: uuid (not null, default: gen_random_uuid())
//   type: counterparty_type (not null)
//   name: text (not null)
//   document_number: text (nullable)
//   email: text (nullable)
//   phone: text (nullable)
//   notes: text (nullable)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: dashboard_metrics
//   id: uuid (not null, default: gen_random_uuid())
//   metric_date: date (not null)
//   metric_name: text (not null)
//   metric_value: numeric (not null)
//   dimension: text (nullable)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: financial_alerts
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   description: text (not null)
//   severity: alert_severity (not null)
//   status: alert_status (not null, default: 'ativo'::alert_status)
//   alert_type: text (not null)
//   reference_table: text (nullable)
//   reference_id: uuid (nullable)
//   alert_date: date (not null, default: CURRENT_DATE)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: financial_categories
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   type: transaction_type (nullable)
//   color: text (nullable)
//   description: text (nullable)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: financial_transactions
//   id: uuid (not null, default: gen_random_uuid())
//   transaction_date: date (not null)
//   competency_date: date (nullable)
//   type: transaction_type (not null)
//   nature: transaction_nature (not null)
//   amount: numeric (not null)
//   category_id: uuid (not null)
//   counterparty_id: uuid (nullable)
//   cost_center_id: uuid (nullable)
//   description: text (not null)
//   notes: text (nullable)
//   status_label: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   full_name: text (nullable)
//   email: text (nullable)
//   role: app_role (not null, default: 'financeiro'::app_role)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: v_activity_summary
//   reference_date: date (nullable)
//   atividades_ok: bigint (nullable)
//   atividades_andamento: bigint (nullable)
//   atividades_aguardando: bigint (nullable)
//   atividades_parado: bigint (nullable)
//   total_atividades: bigint (nullable)
//   percentual_ok: numeric (nullable)
//   percentual_em_andamento: numeric (nullable)
//   percentual_parado: numeric (nullable)
// Table: v_cash_breakpoint
//   rupture_date: date (nullable)
//   projected_balance: numeric (nullable)
//   risk_level: text (nullable)
// Table: v_expenses_by_category
//   category_id: uuid (nullable)
//   category_name: text (nullable)
//   category_color: text (nullable)
//   total_expense: numeric (nullable)
// Table: v_financial_summary
//   reference_date: date (nullable)
//   entrada_realizada: numeric (nullable)
//   entrada_prevista: numeric (nullable)
//   saida_realizada: numeric (nullable)
//   saida_prevista: numeric (nullable)
//   saldo_transacoes: numeric (nullable)

// --- CONSTRAINTS ---
// Table: accounts_payable
//   CHECK accounts_payable_amount_check: CHECK ((amount >= (0)::numeric))
//   FOREIGN KEY accounts_payable_category_id_fkey: FOREIGN KEY (category_id) REFERENCES financial_categories(id)
//   FOREIGN KEY accounts_payable_cost_center_id_fkey: FOREIGN KEY (cost_center_id) REFERENCES cost_centers(id)
//   FOREIGN KEY accounts_payable_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id)
//   PRIMARY KEY accounts_payable_pkey: PRIMARY KEY (id)
//   FOREIGN KEY accounts_payable_supplier_id_fkey: FOREIGN KEY (supplier_id) REFERENCES counterparties(id)
// Table: accounts_receivable
//   CHECK accounts_receivable_amount_check: CHECK ((amount >= (0)::numeric))
//   FOREIGN KEY accounts_receivable_category_id_fkey: FOREIGN KEY (category_id) REFERENCES financial_categories(id)
//   FOREIGN KEY accounts_receivable_cost_center_id_fkey: FOREIGN KEY (cost_center_id) REFERENCES cost_centers(id)
//   FOREIGN KEY accounts_receivable_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id)
//   FOREIGN KEY accounts_receivable_customer_id_fkey: FOREIGN KEY (customer_id) REFERENCES counterparties(id)
//   PRIMARY KEY accounts_receivable_pkey: PRIMARY KEY (id)
// Table: activities
//   FOREIGN KEY activities_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id)
//   CHECK activities_percentage_check: CHECK (((percentage >= (0)::numeric) AND (percentage <= (100)::numeric)))
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
// Table: cashflow_snapshots
//   PRIMARY KEY cashflow_snapshots_pkey: PRIMARY KEY (id)
//   UNIQUE uq_cashflow_snapshots_reference_date: UNIQUE (reference_date)
// Table: cost_centers
//   UNIQUE cost_centers_name_key: UNIQUE (name)
//   PRIMARY KEY cost_centers_pkey: PRIMARY KEY (id)
// Table: counterparties
//   PRIMARY KEY counterparties_pkey: PRIMARY KEY (id)
// Table: dashboard_metrics
//   PRIMARY KEY dashboard_metrics_pkey: PRIMARY KEY (id)
//   UNIQUE uq_dashboard_metrics: UNIQUE (metric_date, metric_name, dimension)
// Table: financial_alerts
//   PRIMARY KEY financial_alerts_pkey: PRIMARY KEY (id)
// Table: financial_categories
//   PRIMARY KEY financial_categories_pkey: PRIMARY KEY (id)
//   UNIQUE uq_financial_categories_name_type: UNIQUE (name, type)
// Table: financial_transactions
//   CHECK financial_transactions_amount_check: CHECK ((amount >= (0)::numeric))
//   FOREIGN KEY financial_transactions_category_id_fkey: FOREIGN KEY (category_id) REFERENCES financial_categories(id)
//   FOREIGN KEY financial_transactions_cost_center_id_fkey: FOREIGN KEY (cost_center_id) REFERENCES cost_centers(id)
//   FOREIGN KEY financial_transactions_counterparty_id_fkey: FOREIGN KEY (counterparty_id) REFERENCES counterparties(id)
//   FOREIGN KEY financial_transactions_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id)
//   PRIMARY KEY financial_transactions_pkey: PRIMARY KEY (id)
// Table: profiles
//   UNIQUE profiles_email_key: UNIQUE (email)
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts_payable
//   Policy "accounts_payable_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "accounts_payable_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: accounts_receivable
//   Policy "accounts_receivable_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "accounts_receivable_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: activities
//   Policy "activities_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "activities_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: cashflow_snapshots
//   Policy "cashflow_snapshots_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "cashflow_snapshots_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: cost_centers
//   Policy "cost_centers_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "cost_centers_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: counterparties
//   Policy "counterparties_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "counterparties_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: dashboard_metrics
//   Policy "dashboard_metrics_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "dashboard_metrics_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: financial_alerts
//   Policy "financial_alerts_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "financial_alerts_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: financial_categories
//   Policy "financial_categories_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "financial_categories_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: financial_transactions
//   Policy "financial_transactions_read_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role, 'diretoria'::app_role]))
//   Policy "financial_transactions_write_financeiro_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
//     WITH CHECK: (get_my_role() = ANY (ARRAY['admin'::app_role, 'financeiro'::app_role]))
// Table: profiles
//   Policy "profiles_insert_own_or_admin" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((auth.uid() = id) OR is_admin())
//   Policy "profiles_select_own_or_admin" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = id) OR is_admin())
//   Policy "profiles_update_own_or_admin" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((auth.uid() = id) OR is_admin())
//     WITH CHECK: ((auth.uid() = id) OR is_admin())

// --- DATABASE FUNCTIONS ---
// FUNCTION get_my_role()
//   CREATE OR REPLACE FUNCTION public.get_my_role()
//    RETURNS app_role
//    LANGUAGE sql
//    STABLE
//   AS $function$
//     select role
//     from public.profiles
//     where id = auth.uid()
//     limit 1;
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    STABLE
//   AS $function$
//     select coalesce(
//       (select role = 'admin' from public.profiles where id = auth.uid() limit 1),
//       false
//     );
//   $function$
//
// FUNCTION set_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   begin
//     new.updated_at = now();
//     return new;
//   end;
//   $function$
//

// --- TRIGGERS ---
// Table: accounts_payable
//   trg_accounts_payable_updated_at: CREATE TRIGGER trg_accounts_payable_updated_at BEFORE UPDATE ON public.accounts_payable FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: accounts_receivable
//   trg_accounts_receivable_updated_at: CREATE TRIGGER trg_accounts_receivable_updated_at BEFORE UPDATE ON public.accounts_receivable FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: activities
//   trg_activities_updated_at: CREATE TRIGGER trg_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: cashflow_snapshots
//   trg_cashflow_snapshots_updated_at: CREATE TRIGGER trg_cashflow_snapshots_updated_at BEFORE UPDATE ON public.cashflow_snapshots FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: cost_centers
//   trg_cost_centers_updated_at: CREATE TRIGGER trg_cost_centers_updated_at BEFORE UPDATE ON public.cost_centers FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: counterparties
//   trg_counterparties_updated_at: CREATE TRIGGER trg_counterparties_updated_at BEFORE UPDATE ON public.counterparties FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: financial_alerts
//   trg_financial_alerts_updated_at: CREATE TRIGGER trg_financial_alerts_updated_at BEFORE UPDATE ON public.financial_alerts FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: financial_categories
//   trg_financial_categories_updated_at: CREATE TRIGGER trg_financial_categories_updated_at BEFORE UPDATE ON public.financial_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: financial_transactions
//   trg_financial_transactions_updated_at: CREATE TRIGGER trg_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: profiles
//   trg_profiles_updated_at: CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at()

// --- INDEXES ---
// Table: accounts_payable
//   CREATE INDEX idx_accounts_payable_category ON public.accounts_payable USING btree (category_id)
//   CREATE INDEX idx_accounts_payable_expected_date ON public.accounts_payable USING btree (expected_date)
//   CREATE INDEX idx_accounts_payable_paid_date ON public.accounts_payable USING btree (paid_date)
//   CREATE INDEX idx_accounts_payable_status ON public.accounts_payable USING btree (status)
//   CREATE INDEX idx_accounts_payable_supplier ON public.accounts_payable USING btree (supplier_id)
// Table: accounts_receivable
//   CREATE INDEX idx_accounts_receivable_category ON public.accounts_receivable USING btree (category_id)
//   CREATE INDEX idx_accounts_receivable_customer ON public.accounts_receivable USING btree (customer_id)
//   CREATE INDEX idx_accounts_receivable_expected_date ON public.accounts_receivable USING btree (expected_date)
//   CREATE INDEX idx_accounts_receivable_received_date ON public.accounts_receivable USING btree (received_date)
//   CREATE INDEX idx_accounts_receivable_status ON public.accounts_receivable USING btree (status)
// Table: activities
//   CREATE INDEX idx_activities_date ON public.activities USING btree (activity_date)
//   CREATE INDEX idx_activities_status ON public.activities USING btree (status)
// Table: cashflow_snapshots
//   CREATE INDEX idx_cashflow_snapshots_reference_date ON public.cashflow_snapshots USING btree (reference_date)
//   CREATE UNIQUE INDEX uq_cashflow_snapshots_reference_date ON public.cashflow_snapshots USING btree (reference_date)
// Table: cost_centers
//   CREATE UNIQUE INDEX cost_centers_name_key ON public.cost_centers USING btree (name)
// Table: counterparties
//   CREATE INDEX idx_counterparties_name ON public.counterparties USING btree (name)
//   CREATE INDEX idx_counterparties_type ON public.counterparties USING btree (type)
// Table: dashboard_metrics
//   CREATE INDEX idx_dashboard_metrics_metric_date ON public.dashboard_metrics USING btree (metric_date)
//   CREATE INDEX idx_dashboard_metrics_metric_name ON public.dashboard_metrics USING btree (metric_name)
//   CREATE UNIQUE INDEX uq_dashboard_metrics ON public.dashboard_metrics USING btree (metric_date, metric_name, dimension)
// Table: financial_alerts
//   CREATE INDEX idx_financial_alerts_alert_date ON public.financial_alerts USING btree (alert_date)
//   CREATE INDEX idx_financial_alerts_severity ON public.financial_alerts USING btree (severity)
//   CREATE INDEX idx_financial_alerts_status ON public.financial_alerts USING btree (status)
// Table: financial_categories
//   CREATE INDEX idx_financial_categories_name ON public.financial_categories USING btree (name)
//   CREATE INDEX idx_financial_categories_type ON public.financial_categories USING btree (type)
//   CREATE UNIQUE INDEX uq_financial_categories_name_type ON public.financial_categories USING btree (name, type)
// Table: financial_transactions
//   CREATE INDEX idx_financial_transactions_category ON public.financial_transactions USING btree (category_id)
//   CREATE INDEX idx_financial_transactions_cost_center ON public.financial_transactions USING btree (cost_center_id)
//   CREATE INDEX idx_financial_transactions_counterparty ON public.financial_transactions USING btree (counterparty_id)
//   CREATE INDEX idx_financial_transactions_date ON public.financial_transactions USING btree (transaction_date)
//   CREATE INDEX idx_financial_transactions_nature ON public.financial_transactions USING btree (nature)
//   CREATE INDEX idx_financial_transactions_type ON public.financial_transactions USING btree (type)
// Table: profiles
//   CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)
