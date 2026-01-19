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
      application_comments: {
        Row: {
          application_id: string
          attachments: Json | null
          content: string
          created_at: string
          edited_at: string | null
          id: string
          is_internal: boolean | null
          mentions: string[] | null
          parent_id: string | null
          user_id: string
        }
        Insert: {
          application_id: string
          attachments?: Json | null
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_internal?: boolean | null
          mentions?: string[] | null
          parent_id?: string | null
          user_id: string
        }
        Update: {
          application_id?: string
          attachments?: Json | null
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_internal?: boolean | null
          mentions?: string[] | null
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_comments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "application_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string
          id: string
          label_valid_until: string | null
          notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          startup_id: string
          status: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label_valid_until?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          startup_id: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label_valid_until?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          startup_id?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          replied: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          replied?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          replied?: boolean | null
          subject?: string | null
        }
        Relationships: []
      }
      document_access_logs: {
        Row: {
          access_result: string | null
          access_type: string
          application_id: string | null
          created_at: string
          document_path: string
          document_type: string | null
          error_message: string | null
          id: string
          ip_address: string | null
          startup_id: string | null
          user_agent: string | null
          user_id: string
          user_role: string | null
        }
        Insert: {
          access_result?: string | null
          access_type: string
          application_id?: string | null
          created_at?: string
          document_path: string
          document_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          startup_id?: string | null
          user_agent?: string | null
          user_id: string
          user_role?: string | null
        }
        Update: {
          access_result?: string | null
          access_type?: string
          application_id?: string | null
          created_at?: string
          document_path?: string
          document_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: string | null
          startup_id?: string | null
          user_agent?: string | null
          user_id?: string
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_access_logs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          application_id: string
          created_at: string | null
          document_type: string
          fulfilled_at: string | null
          id: string
          message: string | null
          requested_at: string | null
          requested_by: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_type: string
          fulfilled_at?: string | null
          id?: string
          message?: string | null
          requested_at?: string | null
          requested_by: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_type?: string
          fulfilled_at?: string | null
          id?: string
          message?: string | null
          requested_at?: string | null
          requested_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          application_id: string
          business_model_comment: string | null
          business_model_score: number | null
          created_at: string
          evaluator_id: string
          general_comment: string | null
          id: string
          impact_comment: string | null
          impact_score: number | null
          innovation_comment: string | null
          innovation_score: number | null
          is_submitted: boolean | null
          recommendation: string | null
          submitted_at: string | null
          team_comment: string | null
          team_score: number | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          application_id: string
          business_model_comment?: string | null
          business_model_score?: number | null
          created_at?: string
          evaluator_id: string
          general_comment?: string | null
          id?: string
          impact_comment?: string | null
          impact_score?: number | null
          innovation_comment?: string | null
          innovation_score?: number | null
          is_submitted?: boolean | null
          recommendation?: string | null
          submitted_at?: string | null
          team_comment?: string | null
          team_score?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          business_model_comment?: string | null
          business_model_score?: number | null
          created_at?: string
          evaluator_id?: string
          general_comment?: string | null
          id?: string
          impact_comment?: string | null
          impact_score?: number | null
          innovation_comment?: string | null
          innovation_score?: number | null
          is_submitted?: boolean | null
          recommendation?: string | null
          submitted_at?: string | null
          team_comment?: string | null
          team_score?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      label_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          is_virtual: boolean | null
          location: string | null
          max_participants: number | null
          registration_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_url?: string | null
          title?: string
        }
        Relationships: []
      }
      label_opportunities: {
        Row: {
          contact_info: string | null
          created_at: string | null
          deadline: string | null
          description: string
          eligibility_criteria: string | null
          external_url: string | null
          id: string
          is_active: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          eligibility_criteria?: string | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          eligibility_criteria?: string | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      label_renewals: {
        Row: {
          application_id: string | null
          expires_at: string | null
          id: string
          notes: string | null
          requested_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          startup_id: string
          status: string | null
        }
        Insert: {
          application_id?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_id: string
          status?: string | null
        }
        Update: {
          application_id?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "label_renewals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "label_renewals_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      label_resources: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          external_url: string | null
          file_url: string | null
          id: string
          is_premium: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_calculated: boolean | null
          is_visible: boolean | null
          key: string
          label: string
          unit: string | null
          updated_at: string | null
          updated_by: string | null
          value: number
        }
        Insert: {
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_calculated?: boolean | null
          is_visible?: boolean | null
          key: string
          label: string
          unit?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number
        }
        Update: {
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_calculated?: boolean | null
          is_visible?: boolean | null
          key?: string
          label?: string
          unit?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      renewal_reminders_sent: {
        Row: {
          email_sent: boolean | null
          expiration_date: string
          id: string
          notification_sent: boolean | null
          reminder_type: string
          sent_at: string
          startup_id: string
        }
        Insert: {
          email_sent?: boolean | null
          expiration_date: string
          id?: string
          notification_sent?: boolean | null
          reminder_type: string
          sent_at?: string
          startup_id: string
        }
        Update: {
          email_sent?: boolean | null
          expiration_date?: string
          id?: string
          notification_sent?: boolean | null
          reminder_type?: string
          sent_at?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewal_reminders_sent_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          address: string | null
          business_model: string | null
          created_at: string
          description: string | null
          doc_business_plan: string | null
          doc_cv: string | null
          doc_other: string[] | null
          doc_pitch: string | null
          doc_rccm: string | null
          doc_statutes: string | null
          doc_tax: string | null
          founded_date: string | null
          founder_info: string | null
          growth_potential: string | null
          id: string
          innovation: string | null
          is_visible_in_directory: boolean | null
          label_expires_at: string | null
          label_granted_at: string | null
          legal_status: string | null
          logo_url: string | null
          name: string
          rccm: string | null
          sector: string | null
          stage: string | null
          status: string | null
          tax_id: string | null
          team_size: number | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_model?: string | null
          created_at?: string
          description?: string | null
          doc_business_plan?: string | null
          doc_cv?: string | null
          doc_other?: string[] | null
          doc_pitch?: string | null
          doc_rccm?: string | null
          doc_statutes?: string | null
          doc_tax?: string | null
          founded_date?: string | null
          founder_info?: string | null
          growth_potential?: string | null
          id?: string
          innovation?: string | null
          is_visible_in_directory?: boolean | null
          label_expires_at?: string | null
          label_granted_at?: string | null
          legal_status?: string | null
          logo_url?: string | null
          name: string
          rccm?: string | null
          sector?: string | null
          stage?: string | null
          status?: string | null
          tax_id?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_model?: string | null
          created_at?: string
          description?: string | null
          doc_business_plan?: string | null
          doc_cv?: string | null
          doc_other?: string[] | null
          doc_pitch?: string | null
          doc_rccm?: string | null
          doc_statutes?: string | null
          doc_tax?: string | null
          founded_date?: string | null
          founder_info?: string | null
          growth_potential?: string | null
          id?: string
          innovation?: string | null
          is_visible_in_directory?: boolean | null
          label_expires_at?: string | null
          label_granted_at?: string | null
          legal_status?: string | null
          logo_url?: string | null
          name?: string
          rccm?: string | null
          sector?: string | null
          stage?: string | null
          status?: string | null
          tax_id?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voting_decisions: {
        Row: {
          application_id: string
          approve_count: number | null
          average_score: number | null
          calculated_decision: string | null
          created_at: string | null
          decided_at: string | null
          decided_by: string | null
          decision_confidence: number | null
          decision_notes: string | null
          decision_source: string | null
          final_decision: string | null
          id: string
          pending_count: number | null
          quorum_reached: boolean | null
          quorum_required: number
          reject_count: number | null
          total_votes: number | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          approve_count?: number | null
          average_score?: number | null
          calculated_decision?: string | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_confidence?: number | null
          decision_notes?: string | null
          decision_source?: string | null
          final_decision?: string | null
          id?: string
          pending_count?: number | null
          quorum_reached?: boolean | null
          quorum_required?: number
          reject_count?: number | null
          total_votes?: number | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          approve_count?: number | null
          average_score?: number | null
          calculated_decision?: string | null
          created_at?: string | null
          decided_at?: string | null
          decided_by?: string | null
          decision_confidence?: number | null
          decision_notes?: string | null
          decision_source?: string | null
          final_decision?: string | null
          id?: string
          pending_count?: number | null
          quorum_reached?: boolean | null
          quorum_required?: number
          reject_count?: number | null
          total_votes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voting_decisions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "startup" | "evaluator"
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
    Enums: {
      app_role: ["admin", "startup", "evaluator"],
    },
  },
} as const
