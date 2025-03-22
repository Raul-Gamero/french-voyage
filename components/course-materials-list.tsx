"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { File, Download, FileText, FileImage, FileAudio, FileVideo } from "lucide-react"
import { CourseMaterialUpload } from "./course-material-upload"

interface CourseMaterial {
  id: string
  title: string
  description: string | null
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  created_at: string
  profiles: {
    first_name: string
    last_name: string
  }
}

interface CourseMaterialsListProps {
  courseId: string
  isInstructor: boolean
}

export function CourseMaterialsList({ courseId, isInstructor }: CourseMaterialsListProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterials = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/courses/${courseId}/materials`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch materials")
      }

      const data = await response.json()
      setMaterials(data)
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching materials")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [courseId])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="h-5 w-5" />
    } else if (fileType.startsWith("audio/")) {
      return <FileAudio className="h-5 w-5" />
    } else if (fileType.startsWith("video/")) {
      return <FileVideo className="h-5 w-5" />
    } else if (fileType.includes("pdf") || fileType.includes("document")) {
      return <FileText className="h-5 w-5" />
    } else {
      return <File className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Course Materials</h3>

        {isInstructor && <CourseMaterialUpload courseId={courseId} onMaterialAdded={fetchMaterials} />}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading materials...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No materials available for this course yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  {getFileIcon(material.file_type)}
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{material.title}</h4>

                  {material.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{material.description}</p>
                  )}

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span className="mr-4">{formatFileSize(material.file_size)}</span>
                    <span className="mr-4">Added {formatDate(material.created_at)}</span>
                    <span>
                      By {material.profiles.first_name} {material.profiles.last_name}
                    </span>
                  </div>
                </div>

                <a href={material.file_url} target="_blank" rel="noopener noreferrer" download={material.file_name}>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

