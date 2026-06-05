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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_access: {
        Row: {
          active: boolean
          app_name: string
          app_route: string
          app_slug: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          active?: boolean
          app_name: string
          app_route: string
          app_slug: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          active?: boolean
          app_name?: string
          app_route?: string
          app_slug?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_items: {
        Row: {
          bundle_product_id: string
          created_at: string
          id: string
          included_product_id: string
        }
        Insert: {
          bundle_product_id: string
          created_at?: string
          id?: string
          included_product_id: string
        }
        Update: {
          bundle_product_id?: string
          created_at?: string
          id?: string
          included_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_product_id_fkey"
            columns: ["bundle_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_included_product_id_fkey"
            columns: ["included_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          access_type: string
          active: boolean
          created_at: string
          expires_at: string | null
          id: string
          product_id: string
          source_purchase_id: string | null
          user_id: string
        }
        Insert: {
          access_type?: string
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          product_id: string
          source_purchase_id?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          product_id?: string
          source_purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_source_purchase_id_fkey"
            columns: ["source_purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          active: boolean
          created_at: string
          file_name: string
          file_type: string
          id: string
          product_id: string
          storage_path: string
          version: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          file_name: string
          file_type: string
          id?: string
          product_id: string
          storage_path: string
          version?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          file_name?: string
          file_type?: string
          id?: string
          product_id?: string
          storage_path?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          cross_sell_text: string | null
          currency: string | null
          default_region: string | null
          description: string | null
          display_currency: string | null
          id: string
          name: string
          paddle_price_id: string | null
          paddle_tax_category: string | null
          payment_provider_eu: string | null
          payment_provider_intl: string | null
          payment_provider_latam: string | null
          price: number | null
          price_eur: number | null
          price_usd: number | null
          product_type: string
          regular_price_eur: number | null
          regular_price_usd: number | null
          sale_active: boolean
          sale_discount_percent: number | null
          sale_ends_at: string | null
          sale_price_eur: number | null
          sale_price_usd: number | null
          short_value_text: string | null
          slug: string
          stripe_price_id: string | null
          stripe_tax_code: string | null
          tax_behavior: string | null
          tax_category: string | null
          tax_rate_hint: number | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          cross_sell_text?: string | null
          currency?: string | null
          default_region?: string | null
          description?: string | null
          display_currency?: string | null
          id?: string
          name: string
          paddle_price_id?: string | null
          paddle_tax_category?: string | null
          payment_provider_eu?: string | null
          payment_provider_intl?: string | null
          payment_provider_latam?: string | null
          price?: number | null
          price_eur?: number | null
          price_usd?: number | null
          product_type: string
          regular_price_eur?: number | null
          regular_price_usd?: number | null
          sale_active?: boolean
          sale_discount_percent?: number | null
          sale_ends_at?: string | null
          sale_price_eur?: number | null
          sale_price_usd?: number | null
          short_value_text?: string | null
          slug: string
          stripe_price_id?: string | null
          stripe_tax_code?: string | null
          tax_behavior?: string | null
          tax_category?: string | null
          tax_rate_hint?: number | null
        }
        Update: {
          active?: boolean
          created_at?: string
          cross_sell_text?: string | null
          currency?: string | null
          default_region?: string | null
          description?: string | null
          display_currency?: string | null
          id?: string
          name?: string
          paddle_price_id?: string | null
          paddle_tax_category?: string | null
          payment_provider_eu?: string | null
          payment_provider_intl?: string | null
          payment_provider_latam?: string | null
          price?: number | null
          price_eur?: number | null
          price_usd?: number | null
          product_type?: string
          regular_price_eur?: number | null
          regular_price_usd?: number | null
          sale_active?: boolean
          sale_discount_percent?: number | null
          sale_ends_at?: string | null
          sale_price_eur?: number | null
          sale_price_usd?: number | null
          short_value_text?: string | null
          slug?: string
          stripe_price_id?: string | null
          stripe_tax_code?: string | null
          tax_behavior?: string | null
          tax_category?: string | null
          tax_rate_hint?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number | null
          buyer_country: string | null
          buyer_currency: string | null
          buyer_region: string | null
          currency: string | null
          id: string
          product_id: string
          provider: string | null
          provider_payment_id: string | null
          purchased_at: string
          status: string
          subtotal_amount: number | null
          tax_amount: number | null
          tax_country: string | null
          tax_provider: string | null
          tax_rate: number | null
          tax_status: string | null
          total_amount: number | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          buyer_country?: string | null
          buyer_currency?: string | null
          buyer_region?: string | null
          currency?: string | null
          id?: string
          product_id: string
          provider?: string | null
          provider_payment_id?: string | null
          purchased_at?: string
          status?: string
          subtotal_amount?: number | null
          tax_amount?: number | null
          tax_country?: string | null
          tax_provider?: string | null
          tax_rate?: number | null
          tax_status?: string | null
          total_amount?: number | null
          user_id: string
        }
        Update: {
          amount?: number | null
          buyer_country?: string | null
          buyer_currency?: string | null
          buyer_region?: string | null
          currency?: string | null
          id?: string
          product_id?: string
          provider?: string | null
          provider_payment_id?: string | null
          purchased_at?: string
          status?: string
          subtotal_amount?: number | null
          tax_amount?: number | null
          tax_country?: string | null
          tax_provider?: string | null
          tax_rate?: number | null
          tax_status?: string | null
          total_amount?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_entitlement: {
        Args: { _product_id: string; _user_id: string }
        Returns: boolean
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
