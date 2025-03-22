import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    // Simplified version - just fetch the profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {profile?.first_name || "Student"}!
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard is being simplified while we resolve some technical issues. Please check back soon for full
            functionality.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error rendering dashboard page:", error)

    // Return a simple fallback UI instead of redirecting
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            We're experiencing some technical difficulties. Please try again later or contact support if the issue
            persists.
          </p>
        </div>
      </div>
    )
  }
}

