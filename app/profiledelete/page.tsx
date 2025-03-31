"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function DeleteProfile() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDeleteProfile = async () => {
    const confirm = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")

    if (!confirm) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: userError } = await supabase.auth.getUser()

      if (userError || !data?.user) {
        throw new Error("Unable to fetch user data. Please log in.")
      }

      const userId = data.user.id

      // Delete profile from table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)

      if (profileError) {
        throw profileError
      }

      // Sign out user
      await supabase.auth.signOut()

      setSuccess(true)

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      console.error("Profile delete error:", error)
      setError(error.message || "An error occurred while deleting your profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Delete your profile</CardTitle>
          <CardDescription>This action is irreversible</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Profile deleted successfully! Redirecting...</AlertDescription>
            </Alert>
          )}
          {!success && (
            <Button
              onClick={handleDeleteProfile}
              variant="destructive"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Profile"}
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            Changed your mind?{" "}
            <a href="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">
              Go back
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
