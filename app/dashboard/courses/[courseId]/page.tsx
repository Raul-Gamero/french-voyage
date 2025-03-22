import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { Progress } from "@/components/ui/progress"
import { CourseMaterialsList } from "@/components/course-materials-list"

export const dynamic = "force-dynamic"

async function getCourse(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching course:", error)
    return null
  }

  return data
}

async function getLessons(courseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order_number")

  if (error) {
    console.error("Error fetching lessons:", error)
    return []
  }

  return data
}

async function checkEnrollment(courseId: string, userId: string) {
  const supabase = await createClient()
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

async function getLessonProgress(courseId: string, userId: string) {
  const supabase = await createClient()
  const { data: lessons } = await supabase.from("lessons").select("id").eq("course_id", courseId)

  if (!lessons || lessons.length === 0) {
    return { completed: 0, total: 0 }
  }

  const lessonIds = lessons.map((lesson) => lesson.id)

  const { data: progress, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("completed", true)

  if (error) {
    console.error("Error fetching lesson progress:", error)
    return { completed: 0, total: lessons.length }
  }

  return { completed: progress.length, total: lessons.length }
}

async function isInstructor(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

  if (error) {
    console.error("Error checking instructor status:", error)
    return false
  }

  return data.role === "admin" || data.role === "instructor"
}

export default async function CourseDashboardPage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const isEnrolled = await checkEnrollment(params.courseId, user.id)

  if (!isEnrolled) {
    redirect(`/courses/${params.courseId}`)
  }

  const course = await getCourse(params.courseId)

  if (!course) {
    notFound()
  }

  const lessons = await getLessons(params.courseId)
  const progress = await getLessonProgress(params.courseId, user.id)
  const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0
  const userIsInstructor = await isInstructor(user.id)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Level {course.level} • {course.duration_weeks} weeks
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {progress.completed} of {progress.total} lessons completed
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {progressPercentage === 100 && (
            <div className="mt-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm">
              Congratulations! You have completed this course.
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <CourseMaterialsList courseId={params.courseId} isInstructor={userIsInstructor} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Content</h2>
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {lesson.order_number}. {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link href={`/dashboard/courses/${params.courseId}/lessons/${lesson.id}`}>
                      <Button variant="outline" size="sm">
                        View Lesson
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
