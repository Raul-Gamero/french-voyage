import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import AdminPageClient from "@/components/AdminPageClient"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
      redirect("/login")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      redirect("/dashboard")
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, bio")

    if (profilesError) {
      console.error(profilesError)
      return (
        <div className="p-12">
          <h1 className="text-2xl font-bold">Error loading profiles</h1>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You are logged in as Admin</p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Invite A New User</h2>
        <form action="/api/admin/invite-user" method="POST" className="flex gap-4">
          <input
          type="email"
          name="email"
          placeholder="Enter email"
          required
          className="border rounded px-3 py-2 w-full"
           />
          <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
          Send Invitation
          </button>
        </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">All User Profiles</h2>
          {profiles?.length ? (
            <AdminPageClient profiles={profiles} />
          ) : (
            <p>No profiles found.</p>
          )}
        </div>

        <Link href="/dashboard" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
          Come back to Dashboard
        </Link>
      </div>
    )
  } catch (error) {
    console.error("Error rendering admin page:", error)
    return (
      <div className="p-12">
        <h1 className="text-2xl font-bold">We're experiencing technical difficulties</h1>
      </div>
    )
  }
}
