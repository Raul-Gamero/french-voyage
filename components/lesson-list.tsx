"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock, ChevronDown, ChevronUp, PlayCircle } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string | null
  duration_minutes: number | null
  order_number: number
}

export function LessonList({
  lessons,
  isEnrolled,
  courseId,
}: {
  lessons: Lesson[]
  isEnrolled: boolean
  courseId: string
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div
        className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Course Lessons</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{lessons.length} lessons</p>
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {expanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {isEnrolled ? (
                    <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {lesson.order_number}. {lesson.title}
                    </h4>
                    {lesson.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 ml-4 flex-shrink-0">
                  {lesson.duration_minutes} min
                </div>
              </div>

              {isEnrolled && (
                <div className="mt-3 ml-8">
                  <Link href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}>
                    <Button variant="outline" size="sm">
                      View Lesson
                    </Button>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

