"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UpdateProfile() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      const { data, error: userError } = await supabase.auth.getUser()

      if (userError || !data?.user) {
        setError("Unable to fetch user data. Please log in.")
        return
      }

      const userId = data.user.id

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, avatar_url, bio")
        .eq("id", userId)
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: userError } = await supabase.auth.getUser()

      if (userError || !data?.user) {
        throw new Error("Unable to fetch user data. Please log in.")
      }

      const userId = data.user.id

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (profileError) {
        throw profileError
      }

      setSuccess(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Profile update error:", error)
      setError(error.message || "An error occurred while updating your profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Update your profile</CardTitle>
          <CardDescription>Modify your information to keep your profile up to date</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Profile updated successfully! Redirecting...</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Want to log out?{" "}
            <a href="/logout" className="font-medium text-blue-600 hover:text-blue-500">
              Logout
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
