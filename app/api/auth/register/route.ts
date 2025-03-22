import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { email, password, firstName, lastName } = await request.json()

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create a profile record in the profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: "student",
        },
      ])

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ user: authData.user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

