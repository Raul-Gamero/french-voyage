"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CourseMaterialUploadProps {
  courseId: string
  onMaterialAdded: () => void
}

export function CourseMaterialUpload({ courseId, onMaterialAdded }: CourseMaterialUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB")
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError("Please select a file")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", title)
      formData.append("description", description)

      const response = await fetch(`/api/courses/${courseId}/materials`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload material")
      }

      setSuccess(true)
      setTitle("")
      setDescription("")
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      onMaterialAdded()

      // Close dialog after successful upload
      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess(false)
      }, 2000)
    } catch (error: any) {
      setError(error.message || "An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Course Material</DialogTitle>
          <DialogDescription>
            Add documents, presentations, or other materials for students enrolled in this course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter material title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? "Change File" : "Select File"}
              </Button>
            </div>

            {selectedFile && (
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md mt-2">
                <File className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm truncate">{selectedFile.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <p className="text-xs text-gray-500 dark:text-gray-400">Max file size: 50MB</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>Material uploaded successfully!</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

