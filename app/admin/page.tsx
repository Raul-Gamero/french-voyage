import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { AdminTabs } from "@/components/admin-tabs"

// Mark this route as dynamic
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  try {
    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      redirect("/dashboard")
    }

    const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    const { data: courses } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    const { data: contactMessages } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

        <AdminTabs users={users || []} courses={courses || []} contactMessages={contactMessages || []} />
      </div>
    )
  } catch (error) {
    console.error("Error rendering admin page:", error)
    redirect("/login")
  }
}

