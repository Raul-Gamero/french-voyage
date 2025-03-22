import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { AVATARS_BUCKET, generateUniqueFilename } from "@/utils/supabase/storage"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("avatar") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name)
    const filePath = `${session.user.id}/${filename}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(AVATARS_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(filePath)

    // Update the user's profile with the avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

