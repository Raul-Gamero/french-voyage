"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export function LessonProgress({
  lessonId,
  userId,
  initialProgress,
}: {
  lessonId: string
  userId: string
  initialProgress: any
}) {
  const [completed, setCompleted] = useState(initialProgress?.completed || false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleMarkComplete = async () => {
    setLoading(true)

    try {
      if (initialProgress) {
        // Update existing record
        await supabase
          .from("lesson_progress")
          .update({
            completed: true,
            last_accessed_at: new Date().toISOString(),
          })
          .eq("id", initialProgress.id)
      } else {
        // Create new record
        await supabase.from("lesson_progress").insert([
          {
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            last_accessed_at: new Date().toISOString(),
          },
        ])
      }

      setCompleted(true)
      router.refresh()
    } catch (error) {
      console.error("Error updating lesson progress:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 flex justify-end">
      {completed ? (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Lesson Completed</span>
        </div>
      ) : (
        <Button variant="outline" onClick={handleMarkComplete} disabled={loading}>
          {loading ? "Updating..." : "Mark as Complete"}
        </Button>
      )}
    </div>
  )
}

