import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

async function getFeaturedCourses() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("courses").select("*").eq("is_featured", true).limit(3)

    if (error) {
      console.error("Error fetching featured courses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedCourses:", error)
    return []
  }
}

export default async function Home() {
  let featuredCourses: any[] = []

  try {
    featuredCourses = await getFeaturedCourses()
  } catch (error) {
    console.error("Error rendering home page:", error)
    // Continue with empty featuredCourses array
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Begin Your French Journey Today</h1>
              <p className="text-xl mb-8">
                Learn French with our comprehensive online courses designed for all levels, from beginners to advanced
                learners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1000"
                alt="Paris Eiffel Tower"
                width={500}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our most popular French language courses and start your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 relative">
                    <Image
                      src={course.image_url || "/placeholder.svg?height=200&width=400"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {course.duration_weeks} weeks
                      </span>
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
                <p className="text-gray-600 dark:text-gray-400">No featured courses available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose French Voyage Akademie</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a unique approach to learning French that combines effective teaching methods with cultural
              immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Comprehensive Curriculum</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our courses cover all aspects of language learning: speaking, listening, reading, and writing, with a
                focus on practical communication skills.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Expert Instructors</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn from native French speakers and experienced language teachers who are passionate about sharing
                their knowledge and culture.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interactive Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Engage with interactive exercises, real-life dialogues, and cultural insights that make learning French
                enjoyable and effective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from our students about their experience learning French with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-gray-600 dark:text-gray-400">A1 to B1 Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "I started as a complete beginner and now I can confidently have conversations in French. The teachers
                are amazing and the course structure made learning easy and enjoyable."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000"
                    alt="Michael Chen"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Michael Chen</h4>
                  <p className="text-gray-600 dark:text-gray-400">B2 Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "The cultural aspects integrated into the lessons really helped me understand not just the language but
                also the French way of life. Highly recommended!"
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1000"
                    alt="Emma Rodriguez"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Emma Rodriguez</h4>
                  <p className="text-gray-600 dark:text-gray-400">A2 Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "The flexibility of the online platform allowed me to learn at my own pace. The interactive exercises
                and feedback from instructors have been invaluable."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

