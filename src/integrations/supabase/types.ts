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
      birthday_email_queue: {
        Row: {
          created_at: string
          id: string
          processed_at: string | null
          wish_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          processed_at?: string | null
          wish_id: string
        }
        Update: {
          created_at?: string
          id?: string
          processed_at?: string | null
          wish_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birthday_email_queue_wish_id_fkey"
            columns: ["wish_id"]
            isOneToOne: true
            referencedRelation: "birthday_wishes"
            referencedColumns: ["id"]
          },
        ]
      }
      birthday_wishes: {
        Row: {
          birthday_date: string
          created_at: string
          id: string
          message: string | null
          recipient_email: string
          recipient_name: string
          recipient_timezone: string
          sender_name: string
          sender_timezone: string
          sent: boolean | null
          sent_at: string | null
        }
        Insert: {
          birthday_date: string
          created_at?: string
          id?: string
          message?: string | null
          recipient_email: string
          recipient_name: string
          recipient_timezone?: string
          sender_name?: string
          sender_timezone?: string
          sent?: boolean | null
          sent_at?: string | null
        }
        Update: {
          birthday_date?: string
          created_at?: string
          id?: string
          message?: string | null
          recipient_email?: string
          recipient_name?: string
          recipient_timezone?: string
          sender_name?: string
          sender_timezone?: string
          sent?: boolean | null
          sent_at?: string | null
        }
        Relationships: []
      }
      debug_timezone_logs: {
        Row: {
          birthday_date: string | null
          check_time: string | null
          converted_birthday_date: string | null
          converted_current_time: string | null
          id: string
          recipient_timezone: string | null
          should_send: boolean | null
          wish_id: string | null
        }
        Insert: {
          birthday_date?: string | null
          check_time?: string | null
          converted_birthday_date?: string | null
          converted_current_time?: string | null
          id?: string
          recipient_timezone?: string | null
          should_send?: boolean | null
          wish_id?: string | null
        }
        Update: {
          birthday_date?: string | null
          check_time?: string | null
          converted_birthday_date?: string | null
          converted_current_time?: string | null
          id?: string
          recipient_timezone?: string | null
          should_send?: boolean | null
          wish_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_timezone_logs_wish_id_fkey"
            columns: ["wish_id"]
            isOneToOne: false
            referencedRelation: "birthday_wishes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_trigger_birthday_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
