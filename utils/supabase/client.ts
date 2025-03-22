import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Only create a new client if we don't already have one
  if (client) return client

  // Check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  // Create the client
  try {
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    return client
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a mock client during SSR to prevent errors
    if (typeof window === "undefined") {
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
          signUp: () => Promise.resolve({ data: {}, error: null }),
          signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              limit: () => Promise.resolve({ data: [], error: null }),
              order: () => Promise.resolve({ data: [], error: null }),
            }),
            order: () => Promise.resolve({ data: [], error: null }),
            in: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
            }),
            insert: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      } as any
    }
    throw error
  }
}

