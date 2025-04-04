import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const { id, first_name, last_name, role } = await req.json()

    const supabase = await createClient()

    const { error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, role })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
