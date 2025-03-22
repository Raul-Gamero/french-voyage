import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LessonLink {
  id: string
  title: string
  order_number: number
}

export function LessonNavigation({
  previousLesson,
  nextLesson,
  courseId,
}: {
  previousLesson: LessonLink | null
  nextLesson: LessonLink | null
  courseId: string
}) {
  return (
    <div className="flex justify-between">
      {previousLesson ? (
        <Link href={`/dashboard/courses/${courseId}/lessons/${previousLesson.id}`}>
          <Button variant="outline" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
        </Link>
      ) : (
        <div></div>
      )}

      {nextLesson ? (
        <Link href={`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`}>
          <Button className="flex items-center">
            Next Lesson
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      ) : (
        <Link href={`/dashboard`}>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      )}
    </div>
  )
}

