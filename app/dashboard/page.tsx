import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
//test
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
      redirect("/login")
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome, {user?.first_name} {user?.last_name || "Student"}!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Email: {user.email}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Email: {user.first_name}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Email: {user.last_name}</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
          This is your personal space at French Voyage Akademie, where you can access your courses, 
          track your progress, and continue your journey to French fluency. We're happy to have you here! 
          Explore, learn, and grow with us.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering dashboard page:", error)

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            We're experiencing some technical difficulties. Please try again later or contact support if the issue persists.
          </p>
        </div>
      </div>
    )
  }
}
