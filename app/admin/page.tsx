import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
      redirect("/login")
    }

    // Obtener perfil para validar si es admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      redirect("/dashboard")
    }

    // Obtener todos los perfiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role")

    if (profilesError) {
      throw new Error("Unable to fetch profiles data.")
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You are logged in as Admin</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All User Profiles</h2>

          {profiles.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No profiles found.</p>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile: { id: string; first_name: string; last_name: string; email: string; role: string }) => (
                <div key={profile.id} className="border-b pb-4">
                  <p className="text-gray-800 dark:text-white font-medium">
                    {profile.first_name} {profile.last_name} ({profile.email}) - Role: {profile.role}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <Link
                      href={`/profileupdate?id=${profile.id}`}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                    >
                      Update Profile
                    </Link>
                    <Link
                      href={`/profiledelete?id=${profile.id}`}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Delete Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/dashboard"
          className="w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Come back to Dashboard
        </Link>
      </div>
    )
  } catch (error) {
    console.error("Error rendering admin page:", error)

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            We're experiencing some technical difficulties. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
