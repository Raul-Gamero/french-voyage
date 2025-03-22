import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { initializeStorage } from "@/utils/supabase/storage"

export async function GET() {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Initialize storage buckets
    await initializeStorage()

    return NextResponse.json({ success: true, message: "Storage buckets initialized successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

