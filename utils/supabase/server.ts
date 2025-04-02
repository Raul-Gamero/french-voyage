import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export async function createClient() {
  try {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return createMockClient()
    }

    return createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            console.error(`Error getting cookie ${name}:`, error)
            return undefined
          }
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Error creating server client:", error)
    return createMockClient()
  }
}

function createMockClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        in: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  } as any
}

export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase Service Role Key")
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey)
}
