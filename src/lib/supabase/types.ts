// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alertas: {
        Row: {
          created_at: string | null
          enviado: boolean | null
          equipamento_id: string | null
          id: string
          manutencao_id: string | null
          mensagem: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          enviado?: boolean | null
          equipamento_id?: string | null
          id?: string
          manutencao_id?: string | null
          mensagem?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          enviado?: boolean | null
          equipamento_id?: string | null
          id?: string
          manutencao_id?: string | null
          mensagem?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_manutencao_id_fkey"
            columns: ["manutencao_id"]
            isOneToOne: false
            referencedRelation: "manutencoes"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: number
          message: string | null
          payload: Json | null
          severity: string | null
          status: string | null
          tenant_id: string
          workflow_name: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          message?: string | null
          payload?: Json | null
          severity?: string | null
          status?: string | null
          tenant_id: string
          workflow_name: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          message?: string | null
          payload?: Json | null
          severity?: string | null
          status?: string | null
          tenant_id?: string
          workflow_name?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      equipamentos: {
        Row: {
          aceita_levantamento: boolean | null
          cliente_id: string | null
          created_at: string | null
          horas_trabalhadas_dia: number
          horimetro_atual: number
          id: string
          intervalo_horas: number | null
          marca: string
          modelo: string
          nome: string
          tipo_cadastro: string
          url_manual: string | null
        }
        Insert: {
          aceita_levantamento?: boolean | null
          cliente_id?: string | null
          created_at?: string | null
          horas_trabalhadas_dia: number
          horimetro_atual: number
          id?: string
          intervalo_horas?: number | null
          marca: string
          modelo: string
          nome: string
          tipo_cadastro: string
          url_manual?: string | null
        }
        Update: {
          aceita_levantamento?: boolean | null
          cliente_id?: string | null
          created_at?: string | null
          horas_trabalhadas_dia?: number
          horimetro_atual?: number
          id?: string
          intervalo_horas?: number | null
          marca?: string
          modelo?: string
          nome?: string
          tipo_cadastro?: string
          url_manual?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_sistema: {
        Row: {
          acao: string | null
          created_at: string | null
          detalhes: Json | null
          entidade: string | null
          entidade_id: string | null
          id: string
        }
        Insert: {
          acao?: string | null
          created_at?: string | null
          detalhes?: Json | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
        }
        Update: {
          acao?: string | null
          created_at?: string | null
          detalhes?: Json | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
        }
        Relationships: []
      }
      manutencoes: {
        Row: {
          created_at: string | null
          data_prevista: string | null
          equipamento_id: string
          horimetro_base: number | null
          horimetro_previsto: number | null
          id: string
          status: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          data_prevista?: string | null
          equipamento_id: string
          horimetro_base?: number | null
          horimetro_previsto?: number | null
          id?: string
          status?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          data_prevista?: string | null
          equipamento_id?: string
          horimetro_base?: number | null
          horimetro_previsto?: number | null
          id?: string
          status?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "manutencoes_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads_manuais: {
        Row: {
          created_at: string | null
          equipamento_id: string | null
          id: string
          nome_arquivo: string | null
          url_arquivo: string | null
        }
        Insert: {
          created_at?: string | null
          equipamento_id?: string | null
          id?: string
          nome_arquivo?: string | null
          url_arquivo?: string | null
        }
        Update: {
          created_at?: string | null
          equipamento_id?: string | null
          id?: string
          nome_arquivo?: string | null
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploads_manuais_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
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
// Table: alertas
//   id: uuid (not null, default: gen_random_uuid())
//   manutencao_id: uuid (nullable)
//   equipamento_id: uuid (nullable)
//   tipo: text (not null)
//   mensagem: text (nullable)
//   enviado: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: automation_logs
//   id: bigint (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   tenant_id: uuid (not null)
//   workflow_name: text (not null)
//   entity_type: text (nullable)
//   entity_id: text (nullable)
//   status: text (nullable)
//   severity: text (nullable)
//   message: text (nullable)
//   payload: jsonb (nullable)
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (nullable)
//   telefone: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: equipamentos
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (nullable)
//   nome: text (not null)
//   marca: text (not null)
//   modelo: text (not null)
//   horimetro_atual: numeric (not null)
//   horas_trabalhadas_dia: numeric (not null)
//   tipo_cadastro: text (not null)
//   intervalo_horas: numeric (nullable)
//   aceita_levantamento: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   url_manual: text (nullable)
// Table: logs_sistema
//   id: uuid (not null, default: gen_random_uuid())
//   entidade: text (nullable)
//   entidade_id: uuid (nullable)
//   acao: text (nullable)
//   detalhes: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: manutencoes
//   id: uuid (not null, default: gen_random_uuid())
//   equipamento_id: uuid (not null)
//   tipo: text (not null)
//   horimetro_base: numeric (nullable)
//   horimetro_previsto: numeric (nullable)
//   data_prevista: date (nullable)
//   status: text (nullable, default: 'pendente'::text)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: uploads_manuais
//   id: uuid (not null, default: gen_random_uuid())
//   equipamento_id: uuid (nullable)
//   nome_arquivo: text (nullable)
//   url_arquivo: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: alertas
//   FOREIGN KEY alertas_equipamento_id_fkey: FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
//   FOREIGN KEY alertas_manutencao_id_fkey: FOREIGN KEY (manutencao_id) REFERENCES manutencoes(id) ON DELETE CASCADE
//   PRIMARY KEY alertas_pkey: PRIMARY KEY (id)
//   CHECK alertas_tipo_check: CHECK ((tipo = ANY (ARRAY['preventiva_proxima'::text, 'preventiva_atrasada'::text, 'corretiva'::text])))
// Table: automation_logs
//   PRIMARY KEY automation_logs_pkey: PRIMARY KEY (id)
//   CHECK automation_logs_severity_check: CHECK ((severity = ANY (ARRAY['info'::text, 'warning'::text, 'error'::text, 'critical'::text])))
//   CHECK automation_logs_status_check: CHECK ((status = ANY (ARRAY['success'::text, 'error'::text, 'warning'::text])))
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
// Table: equipamentos
//   FOREIGN KEY equipamentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY equipamentos_pkey: PRIMARY KEY (id)
//   CHECK equipamentos_tipo_cadastro_check: CHECK ((tipo_cadastro = ANY (ARRAY['manual'::text, 'intervalo'::text, 'manual_horas'::text, 'intervalo_horas'::text, 'consultoria'::text, 'Nao_Sei_Informar'::text, 'extracao_pdf'::text])))
// Table: logs_sistema
//   PRIMARY KEY logs_sistema_pkey: PRIMARY KEY (id)
// Table: manutencoes
//   FOREIGN KEY manutencoes_equipamento_id_fkey: FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
//   PRIMARY KEY manutencoes_pkey: PRIMARY KEY (id)
//   CHECK manutencoes_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'realizada'::text, 'atrasada'::text])))
//   CHECK manutencoes_tipo_check: CHECK ((tipo = ANY (ARRAY['preventiva'::text, 'corretiva'::text])))
// Table: uploads_manuais
//   FOREIGN KEY uploads_manuais_equipamento_id_fkey: FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
//   PRIMARY KEY uploads_manuais_pkey: PRIMARY KEY (id)

// --- INDEXES ---
// Table: alertas
//   CREATE INDEX idx_alertas_enviado ON public.alertas USING btree (enviado)
//   CREATE INDEX idx_alertas_equipamento ON public.alertas USING btree (equipamento_id)
// Table: equipamentos
//   CREATE INDEX idx_equipamentos_cliente ON public.equipamentos USING btree (cliente_id)
// Table: manutencoes
//   CREATE INDEX idx_manutencoes_equipamento ON public.manutencoes USING btree (equipamento_id)
//   CREATE INDEX idx_manutencoes_status ON public.manutencoes USING btree (status)

