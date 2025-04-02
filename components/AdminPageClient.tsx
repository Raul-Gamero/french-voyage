"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AdminPageClient({ profiles }: { profiles: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [allProfiles, setAllProfiles] = useState(profiles)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleEdit = (profile: any) => {
    setEditingId(profile.id)
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
      })
      .eq("id", id)

    if (error) {
      alert("❌ Error updating profile: " + error.message)
      setLoading(false)
      return
    }

    const updatedProfiles = allProfiles.map((p) =>
      p.id === id ? { ...p, ...formData } : p
    )
    setAllProfiles(updatedProfiles)
    setEditingId(null)
    setLoading(false)
    alert("✅ Changes saved successfully!")
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("⚠️ Are you sure you want to delete this profile?")
    if (!confirmDelete) return

    setLoading(true)
    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) {
      alert("❌ Error deleting profile: " + error.message)
      setLoading(false)
      return
    }

    const filteredProfiles = allProfiles.filter((p) => p.id !== id)
    setAllProfiles(filteredProfiles)
    setLoading(false)
    alert("✅ Profile deleted successfully!")
  }

  return (
    <div className="space-y-4">
      {allProfiles.map((profile) => (
        <div key={profile.id} className="border-b pb-4">
          {editingId === profile.id ? (
            <div className="flex flex-col gap-2">
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(profile.id)}
                  disabled={loading}
                  className="bg-green-600 text-white py-1 px-3 rounded"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  disabled={loading}
                  className="bg-gray-500 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 dark:text-white font-medium">
                {profile.first_name} {profile.last_name} ({profile.email}) - Role: {profile.role}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(profile)}
                  disabled={loading}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  disabled={loading}
                  className="bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
