export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'COMERCIAL' | 'FINANCEIRO' | 'OPERADOR' | 'VISUALIZADOR'
export type ClientStatus = 'LEAD' | 'NEGOCIACAO' | 'CLIENTE' | 'INATIVO'
export type DestinationType = 'google' | 'whatsapp' | 'instagram' | 'site' | 'cardapio' | 'catalogo' | 'localizacao' | 'formulario' | 'outro'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: AppRole
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: AppRole
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          role?: AppRole
          is_active?: boolean
          last_login_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          company: string | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          instagram: string | null
          city: string | null
          state: string | null
          document: string | null
          notes: string | null
          status: ClientStatus
          created_by: string
          updated_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          instagram?: string | null
          city?: string | null
          state?: string | null
          document?: string | null
          notes?: string | null
          status?: ClientStatus
          created_by?: string
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          company?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          instagram?: string | null
          city?: string | null
          state?: string | null
          document?: string | null
          notes?: string | null
          status?: ClientStatus
          updated_by?: string
          updated_at?: string
        }
        Relationships: []
      }
      dynamic_links: {
        Row: {
          id: string
          internal_code: string
          public_code: string
          client_id: string
          destination_type: DestinationType
          destination_url: string
          active: boolean
          access_count: number
          last_access_at: string | null
          notes: string | null
          created_by: string
          updated_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          internal_code?: string
          public_code?: string
          client_id: string
          destination_type: DestinationType
          destination_url: string
          active?: boolean
          access_count?: number
          last_access_at?: string | null
          notes?: string | null
          created_by?: string
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          destination_type?: DestinationType
          destination_url?: string
          active?: boolean
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dynamic_links_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      dynamic_link_history: {
        Row: {
          id: number
          link_id: string
          previous_type: DestinationType
          new_type: DestinationType
          previous_url: string
          new_url: string
          changed_by: string | null
          changed_at: string
        }
        Insert: {
          id?: number
          link_id: string
          previous_type: DestinationType
          new_type: DestinationType
          previous_url: string
          new_url: string
          changed_by?: string | null
          changed_at?: string
        }
        Update: {
          previous_type?: DestinationType
          new_type?: DestinationType
          previous_url?: string
          new_url?: string
          changed_by?: string | null
          changed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dynamic_link_history_link_id_fkey'
            columns: ['link_id']
            isOneToOne: false
            referencedRelation: 'dynamic_links'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          id: number
          actor_id: string | null
          action: string
          resource: string
          resource_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: number
          actor_id?: string | null
          action: string
          resource: string
          resource_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          actor_id?: string | null
          action?: string
          resource?: string
          resource_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      resolve_dynamic_link: {
        Args: { p_code: string }
        Returns: { destination_url: string; destination_type: DestinationType }[]
      }
      mark_my_login: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      log_my_logout: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: AppRole
      client_status: ClientStatus
      destination_type: DestinationType
    }
    CompositeTypes: { [_ in never]: never }
  }
}
