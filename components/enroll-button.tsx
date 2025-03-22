"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push(`/login?redirect=/courses/${courseId}`)
        return
      }

      const { error } = await supabase.from("enrollments").insert([
        {
          user_id: session.user.id,
          course_id: courseId,
          status: "active",
        },
      ])

      if (error) {
        if (error.code === "23505") {
          // This is a unique constraint violation - user is already enrolled
          setError("You are already enrolled in this course")
        } else {
          throw error
        }
      } else {
        // Enrollment successful
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "Failed to enroll in course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button className="w-full" onClick={handleEnroll} disabled={loading}>
        {loading ? "Enrolling..." : "Enroll Now"}
      </Button>
    </div>
  )
}

