import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Try to sign in with the provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Auth test error:", error)
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          status: "error",
        },
        { status: 400 },
      )
    }

    // Return success with user info (but not sensitive data)
    return NextResponse.json({
      status: "success",
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      },
    })
  } catch (error: any) {
    console.error("Auth test route error:", error)
    return NextResponse.json(
      {
        error: error.message,
        status: "error",
      },
      { status: 500 },
    )
  }
}

