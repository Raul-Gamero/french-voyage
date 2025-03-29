"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ViewProfile() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      const { data: user, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("Unable to fetch user data. Please log in.")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, avatar_url, bio")
        .eq("id", user.id)
        .single()

      if (profileError) {
        setError("Unable to fetch profile data.")
        return
      }

      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setEmail(profile.email || "")
      setAvatarUrl(profile.avatar_url || "")
      setBio(profile.bio || "")
    }

    fetchUserData()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
          <CardDescription>View your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!error && (
            <div className="space-y-4">
              <div>
                <strong>First Name:</strong> {firstName}
              </div>
              <div>
                <strong>Last Name:</strong> {lastName}
              </div>
              <div>
                <strong>Email:</strong> {email}
              </div>
              <div>
                <strong>Avatar URL:</strong> {avatarUrl ? (
                  <a href={avatarUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Avatar
                  </a>
                ) : (
                  "Not provided"
                )}
              </div>
              <div>
                <strong>Bio:</strong> {bio || "Not provided"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
