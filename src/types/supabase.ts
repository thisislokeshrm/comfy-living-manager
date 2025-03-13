
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apartments: {
        Row: {
          id: string
          number: string
          floor: number
          bedrooms: number
          bathrooms: number
          rent: number
          status: 'empty' | 'booked'
          tenant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          number: string
          floor: number
          bedrooms: number
          bathrooms: number
          rent: number
          status?: 'empty' | 'booked'
          tenant_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          number?: string
          floor?: number
          bedrooms?: number
          bathrooms?: number
          rent?: number
          status?: 'empty' | 'booked'
          tenant_id?: string | null
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          apartment_id: string
          tenant_id: string
          type: 'cleaning' | 'maintenance' | 'plumbing' | 'electrical' | 'other'
          description: string
          status: 'pending' | 'in-progress' | 'completed'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          apartment_id: string
          tenant_id: string
          type: 'cleaning' | 'maintenance' | 'plumbing' | 'electrical' | 'other'
          description: string
          status?: 'pending' | 'in-progress' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          apartment_id?: string
          tenant_id?: string
          type?: 'cleaning' | 'maintenance' | 'plumbing' | 'electrical' | 'other'
          description?: string
          status?: 'pending' | 'in-progress' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          tenant_id: string
          apartment_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          date: string
          description: string
        }
        Insert: {
          id?: string
          tenant_id: string
          apartment_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          date?: string
          description: string
        }
        Update: {
          id?: string
          tenant_id?: string
          apartment_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          date?: string
          description?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          type: 'temple' | 'park' | 'gym' | 'pool' | 'store' | 'restaurant' | 'parking'
          description: string
          coordinates_x: number
          coordinates_y: number
        }
        Insert: {
          id?: string
          name: string
          type: 'temple' | 'park' | 'gym' | 'pool' | 'store' | 'restaurant' | 'parking'
          description: string
          coordinates_x: number
          coordinates_y: number
        }
        Update: {
          id?: string
          name?: string
          type?: 'temple' | 'park' | 'gym' | 'pool' | 'store' | 'restaurant' | 'parking'
          description?: string
          coordinates_x?: number
          coordinates_y?: number
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'tenant' | 'manager'
          apartment_id: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'tenant' | 'manager'
          apartment_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'tenant' | 'manager'
          apartment_id?: string | null
        }
      }
    }
  }
}
