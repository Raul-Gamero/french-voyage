import { createClient } from "@/utils/supabase/server"
import { useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    redirect("/login")
  }

  // Fetch the admin's profile to validate their role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all user profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, role")

  if (profilesError) {
    throw new Error("Unable to fetch profiles data.")
  }

  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  // Function to delete a user profile
  const handleDeleteProfile = async (profileId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile?")
    if (!confirmDelete) return

    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId)

      if (deleteError) {
        throw deleteError
      }

      // Refresh the page after deletion
      window.location.reload()
    } catch (error) {
      console.error("Error deleting profile:", error)
      alert("An error occurred while deleting the profile. Please try again.")
    }
  }

  // Function to handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: selectedProfile.first_name,
          last_name: selectedProfile.last_name,
          email: selectedProfile.email,
          role: selectedProfile.role,
        })
        .eq("id", selectedProfile.id)

      if (updateError) {
        throw updateError
      }

      alert("Profile updated successfully!")
      setShowUpdateForm(false)
      window.location.reload()
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating the profile. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Admin Panel</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">You are logged in as Admin</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No profiles found.</p>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> {profile.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Role:</strong> {profile.role}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    setSelectedProfile(profile)
                    setShowUpdateForm(true)
                  }}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showUpdateForm && selectedProfile && (
        <div className="mt-8 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                value={selectedProfile.first_name}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, first_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                value={selectedProfile.last_name}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, last_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={selectedProfile.email}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Role</label>
              <input
                type="text"
                value={selectedProfile.role}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <Link
        href="/dashboard"
        className="w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-6 block"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
