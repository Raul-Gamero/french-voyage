import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { COURSE_MATERIALS_BUCKET, generateUniqueFilename } from "@/utils/supabase/storage"

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
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

    // Check if course exists
    const { data: course } = await supabase.from("courses").select("id").eq("id", params.courseId).single()

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name)
    const filePath = `${params.courseId}/${filename}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(COURSE_MATERIALS_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(COURSE_MATERIALS_BUCKET).getPublicUrl(filePath)

    // Create a record in the course_materials table
    const { data: material, error: insertError } = await supabase
      .from("course_materials")
      .insert([
        {
          course_id: params.courseId,
          title,
          description,
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
      material,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is enrolled in the course or is admin/instructor
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    const isAdminOrInstructor = profile?.role === "admin" || profile?.role === "instructor"

    if (!isAdminOrInstructor) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("course_id", params.courseId)
        .eq("user_id", session.user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 })
      }
    }

    // Get all materials for the course
    const { data: materials, error } = await supabase
      .from("course_materials")
      .select(`
        *,
        profiles:uploaded_by (first_name, last_name)
      `)
      .eq("course_id", params.courseId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(materials)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

