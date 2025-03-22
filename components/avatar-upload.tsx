"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle } from "lucide-react"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  userId: string
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, userId, onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setSuccess(false)

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("avatar", fileInputRef.current.files[0])

      const response = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar")
      }

      setSuccess(true)
      onAvatarUpdate(data.avatarUrl)
    } catch (error: any) {
      setError(error.message || "An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancelPreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {(previewUrl || currentAvatarUrl) && (
            <Image
              src={previewUrl || currentAvatarUrl || "/placeholder.svg?height=96&width=96"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>

            {previewUrl && (
              <>
                <Button type="button" size="sm" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>

                <Button type="button" variant="ghost" size="sm" onClick={handleCancelPreview} disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">Supported formats: JPG, PNG, GIF. Max size: 2MB</p>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Avatar updated successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

