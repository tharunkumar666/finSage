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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_history: {
        Row: {
          action: string
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_number_last_four: string
          account_type: string
          bank_name: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number_last_four: string
          account_type: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number_last_four?: string
          account_type?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          balance: number
          created_at: string | null
          due_date: string | null
          id: string
          interest_rate: number
          minimum_payment: number | null
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          interest_rate: number
          minimum_payment?: number | null
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number
          minimum_payment?: number | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          category: string | null
          created_at: string | null
          current_amount: number | null
          id: string
          name: string
          target_amount: number
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          name: string
          target_amount: number
          target_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          name?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          created_at: string | null
          current_price: number
          id: string
          name: string
          purchase_date: string | null
          purchase_price: number | null
          shares: number
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_price: number
          id?: string
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          shares: number
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_price?: number
          id?: string
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          shares?: number
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      login_sessions: {
        Row: {
          created_at: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          is_current: boolean | null
          last_active: string | null
          location: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string | null
          location?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string | null
          location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          debt_reminders: boolean | null
          email_frequency: string | null
          id: string
          investment_changes: boolean | null
          market_updates: boolean | null
          newsletters: boolean | null
          push_frequency: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          debt_reminders?: boolean | null
          email_frequency?: string | null
          id?: string
          investment_changes?: boolean | null
          market_updates?: boolean | null
          newsletters?: boolean | null
          push_frequency?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          debt_reminders?: boolean | null
          email_frequency?: string | null
          id?: string
          investment_changes?: boolean | null
          market_updates?: boolean | null
          newsletters?: boolean | null
          push_frequency?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          name: string | null
          risk_profile: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name?: string | null
          risk_profile?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          name?: string | null
          risk_profile?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          currency: string | null
          dashboard_show_calculator: boolean | null
          dashboard_show_debt: boolean | null
          dashboard_show_investment: boolean | null
          dashboard_show_news: boolean | null
          id: string
          language: string | null
          privacy_allow_data_collection: boolean | null
          privacy_allow_marketing: boolean | null
          privacy_show_activity_history: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          dashboard_show_calculator?: boolean | null
          dashboard_show_debt?: boolean | null
          dashboard_show_investment?: boolean | null
          dashboard_show_news?: boolean | null
          id?: string
          language?: string | null
          privacy_allow_data_collection?: boolean | null
          privacy_allow_marketing?: boolean | null
          privacy_show_activity_history?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          dashboard_show_calculator?: boolean | null
          dashboard_show_debt?: boolean | null
          dashboard_show_investment?: boolean | null
          dashboard_show_news?: boolean | null
          id?: string
          language?: string | null
          privacy_allow_data_collection?: boolean | null
          privacy_allow_marketing?: boolean | null
          privacy_show_activity_history?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_activity: {
        Args: {
          p_action: string
          p_category: string
          p_description: string
          p_metadata?: Json
          p_user_id: string
        }
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
