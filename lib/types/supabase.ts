// This file will contain the types for your Supabase database
// You can generate these types by running:
// npx supabase gen types typescript --project-id [your-project-ref] --schema public > lib/types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your table definitions here after creating them in Supabase
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     email?: string
      //     created_at?: string
      //   }
      // }
    }
    Views: {
      // Define views here if you have any
    }
    Functions: {
      // Define functions here if you have any
    }
    Enums: {
      // Define enums here if you have any
    }
    CompositeTypes: {
      // Define composite types here if you have any
    }
  }
}