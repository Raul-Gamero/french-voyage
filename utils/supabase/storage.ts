import { createClient } from "@/utils/supabase/server"

// Storage bucket names
export const AVATARS_BUCKET = "avatars"
export const COURSE_MATERIALS_BUCKET = "course-materials"
export const LESSON_CONTENT_BUCKET = "lesson-content"

// Initialize storage buckets
export async function initializeStorage() {
  const supabase = createClient()

  // Create buckets if they don't exist
  const buckets = [AVATARS_BUCKET, COURSE_MATERIALS_BUCKET, LESSON_CONTENT_BUCKET]

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (error && error.message.includes("The resource was not found")) {
      await supabase.storage.createBucket(bucket, {
        public: bucket === COURSE_MATERIALS_BUCKET || bucket === LESSON_CONTENT_BUCKET,
        fileSizeLimit: bucket === AVATARS_BUCKET ? 1024 * 1024 * 2 : 1024 * 1024 * 50, // 2MB for avatars, 50MB for others
      })
    }
  }
}

// Generate a unique filename
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = originalFilename.split(".").pop()

  return `${timestamp}-${randomString}.${extension}`
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

