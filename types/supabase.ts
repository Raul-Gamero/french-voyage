export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          avatar_url: string | null
          bio: string | null
          role: "student" | "admin" | "instructor"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          avatar_url?: string | null
          bio?: string | null
          role?: "student" | "admin" | "instructor"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          avatar_url?: string | null
          bio?: string | null
          role?: "student" | "admin" | "instructor"
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
          price: number
          duration_weeks: number
          image_url: string | null
          is_featured: boolean
          instructor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
          price: number
          duration_weeks: number
          image_url?: string | null
          is_featured?: boolean
          instructor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
          price?: number
          duration_weeks?: number
          image_url?: string | null
          is_featured?: boolean
          instructor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          content: string | null
          order_number: number
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          content?: string | null
          order_number: number
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          content?: string | null
          order_number?: number
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          status: "active" | "completed" | "dropped"
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          status?: "active" | "completed" | "dropped"
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          status?: "active" | "completed" | "dropped"
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          last_accessed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          last_accessed_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          last_accessed_at?: string
          notes?: string | null
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          responded: boolean
          responded_at: string | null
          responded_by: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          responded?: boolean
          responded_at?: string | null
          responded_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          responded?: boolean
          responded_at?: string | null
          responded_by?: string | null
        }
      }
    }
  }
}

