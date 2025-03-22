import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await request.json()

    // Check if the user is already enrolled in this course
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 })
    }

    // Create a new enrollment
    const { data, error } = await supabase
      .from("enrollments")
      .insert([
        {
          user_id: session.user.id,
          course_id: courseId,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

