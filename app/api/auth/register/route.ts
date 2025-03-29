import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { email, password } = await request.json()

    // Sign in the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    if (profileError || !profileData) {
      // If profile doesn't exist → create it
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          first_name: authData.user.user_metadata.first_name,
          last_name: authData.user.user_metadata.last_name,
          role: "student",
        },
      ])

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ user: authData.user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
