import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const email = formData.get("email") as string

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/admin`)
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
