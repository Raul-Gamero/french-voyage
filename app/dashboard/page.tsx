import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"


export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user || userError) {
      redirect("/login")
    }

    // Fetch the profile data, including the role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, role") // Include the role field
      .select("first_name, last_name, role") // ✅ Traer el campo "role"
      .eq("id", user.id)
      .single()

    if (profileError) {
      throw new Error("Unable to fetch profile data.")
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome, {profile?.first_name} {profile?.last_name || "Student"}!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Email: {user.email}</p>

        {profile?.role === "admin" && ( // ✅ Mostrar el botón solo si es admin
          <a
            href="/admin"
            className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Admin Dashboard
          </a>
        )}
        <p className="text-gray-600 dark:text-gray-400 mb-6">Role: {profile.role}</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            This is your personal space at French Voyage Akademie, where you can access your courses, 
            track your progress, and continue your journey to French fluency. We're happy to have you here! 
            Explore, learn, and grow with us.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select one of the options below to manage your account:
          </p>
          <div className="flex flex-col space-y-4">
            <a
              href="/confirmation"
              className="w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Confirm Profile
            </a>
            <a
              href="/profileupdate"
              className="w-full text-center bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Update Profile
            </a>
            <a
              href="/profiledelete"
              className="w-full text-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Delete Profile
            </a>
            <a
              href="/profileread"
              className="w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              See Profile
            </a>
          </div>
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
