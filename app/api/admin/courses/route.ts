import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const courseData = await request.json()

    const { data, error } = await supabase.from("courses").insert([courseData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

