"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We apologize for the inconvenience. An error occurred while loading this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}

