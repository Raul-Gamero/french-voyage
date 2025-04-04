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

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, role") // ✅ Traer el campo "role"
      .eq("id", user.id)
      .single()

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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard is being simplified while we resolve some technical issues. Please check back soon for full functionality.
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
