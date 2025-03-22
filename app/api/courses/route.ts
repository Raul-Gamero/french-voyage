import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const url = new URL(request.url)
    const level = url.searchParams.get("level")

    let query = supabase.from("courses").select("*")

    if (level) {
      query = query.eq("level", level)
    }

    const { data, error } = await query.order("level")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

