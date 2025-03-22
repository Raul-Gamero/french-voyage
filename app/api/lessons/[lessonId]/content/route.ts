import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { LESSON_CONTENT_BUCKET, generateUniqueFilename } from "@/utils/supabase/storage"

export async function POST(request: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin or instructor
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin" && profile?.role !== "instructor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if lesson exists
    const { data: lesson } = await supabase.from("lessons").select("id, course_id").eq("id", params.lessonId).single()

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const contentType = formData.get("contentType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name)
    const filePath = `${lesson.course_id}/${params.lessonId}/${filename}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(LESSON_CONTENT_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(LESSON_CONTENT_BUCKET).getPublicUrl(filePath)

    // Create a record in the lesson_content table
    const { data: content, error: insertError } = await supabase
      .from("lesson_content")
      .insert([
        {
          lesson_id: params.lessonId,
          content_type: contentType,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: session.user.id,
        },
      ])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the lesson to check the course_id
    const { data: lesson } = await supabase.from("lessons").select("course_id").eq("id", params.lessonId).single()

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Check if user is enrolled in the course or is admin/instructor
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    const isAdminOrInstructor = profile?.role === "admin" || profile?.role === "instructor"

    if (!isAdminOrInstructor) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("course_id", lesson.course_id)
        .eq("user_id", session.user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 })
      }
    }

    // Get all content for the lesson
    const { data: contents, error } = await supabase
      .from("lesson_content")
      .select(`
        *,
        profiles:uploaded_by (first_name, last_name)
      `)
      .eq("lesson_id", params.lessonId)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(contents)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

