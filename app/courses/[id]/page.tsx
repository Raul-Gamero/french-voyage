import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
export const dynamic = "force-dynamic"

async function getCourse(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching course:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getCourse:", error)
    return null
  }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  try {
    const id = typeof params.id === "string" ? params.id : ""
    const course = await getCourse(id)

    if (!course) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/courses" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Level {course.level}
            </span>
            <span className="text-gray-600 dark:text-gray-400">{course.duration_weeks} weeks</span>
          </div>
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
          <Image
            src={course.image_url || "/placeholder.svg?height=400&width=800"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this course</h2>
          <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">${course.price}</div>
          <Link href="/login">
            <Button className="w-full">Enroll Now</Button>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering course detail page:", error)
    notFound()
  }
}

