import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { LessonNavigation } from "@/components/lesson-navigation"
import { LessonProgress } from "@/components/lesson-progress"

export const dynamic = "force-dynamic"

async function getLesson(lessonId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("lessons")
    .select(`
      *,
      courses:course_id (title)
    `)
    .eq("id", lessonId)
    .single()

  if (error) {
    console.error("Error fetching lesson:", error)
    return null
  }

  return data
}

async function getCourseLessons(courseId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, order_number")
    .eq("course_id", courseId)
    .order("order_number")

  if (error) {
    console.error("Error fetching course lessons:", error)
    return []
  }

  return data
}

async function checkEnrollment(courseId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error checking enrollment:", error)
  }

  return !!data
}

async function getLessonProgress(lessonId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching lesson progress:", error)
    return null
  }

  return data
}

async function updateLessonProgress(lessonId: string, userId: string) {
  const supabase = createClient()

  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("lesson_id", lessonId)
    .eq("user_id", userId)
    .single()

  if (existingProgress) {
    // Update existing record
    await supabase
      .from("lesson_progress")
      .update({
        last_accessed_at: new Date().toISOString(),
      })
      .eq("id", existingProgress.id)
  } else {
    // Create new record
    await supabase.from("lesson_progress").insert([
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: false,
        last_accessed_at: new Date().toISOString(),
      },
    ])
  }
}

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const isEnrolled = await checkEnrollment(params.courseId, session.user.id)

  if (!isEnrolled) {
    redirect(`/courses/${params.courseId}`)
  }

  const lesson = await getLesson(params.lessonId)

  if (!lesson) {
    notFound()
  }

  const courseLessons = await getCourseLessons(params.courseId)
  const lessonProgress = await getLessonProgress(params.lessonId, session.user.id)

  // Update lesson progress
  await updateLessonProgress(params.lessonId, session.user.id)

  // Find current lesson index and determine next/previous lessons
  const currentIndex = courseLessons.findIndex((l) => l.id === params.lessonId)
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/courses/${params.courseId}`}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Course
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {lesson.courses.title} • Lesson {lesson.order_number}
          </p>
        </div>

        <LessonProgress lessonId={params.lessonId} userId={session.user.id} initialProgress={lessonProgress} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {lesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            ) : (
              <div>
                <h2>Lesson Content</h2>
                <p>
                  This is a placeholder for the lesson content. In a real application, this would contain rich text
                  content, videos, interactive exercises, and more.
                </p>
                <p>For this lesson, we'll cover the following topics:</p>
                <ul>
                  <li>Key vocabulary related to this lesson</li>
                  <li>Grammar concepts and practice exercises</li>
                  <li>Cultural insights and context</li>
                  <li>Practical conversation examples</li>
                </ul>
                <p>
                  After completing this lesson, you should be able to understand and use the concepts covered in
                  real-world situations.
                </p>
              </div>
            )}
          </div>
        </div>

        <LessonNavigation previousLesson={previousLesson} nextLesson={nextLesson} courseId={params.courseId} />
      </div>
    </div>
  )
}

