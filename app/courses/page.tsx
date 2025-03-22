import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

async function getCourses(level?: string) {
  try {
    const supabase = await createClient()

    let query =  supabase.from("courses").select("*")

    if (level) {
      query = query.eq("level", level)
    }

    const { data, error } = await query.order("level")

    if (error) {
      console.error("Error fetching courses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCourses:", error)
    return []
  }
}

export default async function CoursesPage({ searchParams }: { searchParams: { level?: string } }) {
  let courses: any[] = []

  try {
    const level = searchParams.level
    courses = await getCourses(level)
  } catch (error) {
    console.error("Error rendering courses page:", error)
    // Continue with empty courses array
  }

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our French Courses</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore our comprehensive French language courses designed for all proficiency levels.
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Link href="/courses">
          <Button variant={!searchParams.level ? "default" : "outline"}>All Levels</Button>
        </Link>
        {levels.map((l) => (
          <Link key={l} href={`/courses?level=${l}`}>
            <Button variant={searchParams.level === l ? "default" : "outline"}>{l}</Button>
          </Link>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={
                    course.image_url || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.title)}`
                  }
                  alt={course.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // If the image fails to load, replace with a default placeholder
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(course.title)}`
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{course.duration_weeks} weeks</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                  <Link href={`/courses/${course.id}`}>
                    <Button>View Course</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {searchParams.level
                ? `No courses available for level ${searchParams.level} at the moment.`
                : "No courses available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

