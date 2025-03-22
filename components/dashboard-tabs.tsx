"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AvatarUpload } from "./avatar-upload"

export function DashboardTabs({ profile, enrollments }: { profile: any; enrollments: any[] }) {
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) {
        throw error
      }

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred while updating your profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url)
    router.refresh()
  }

  return (
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="courses">My Courses</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Enrolled Courses</h2>

        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <div className="h-40 relative">
                  <Image
                    src={enrollment.courses.image_url || "/placeholder.svg?height=160&width=400"}
                    alt={enrollment.courses.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{enrollment.courses.title}</CardTitle>
                  <CardDescription>Level: {enrollment.courses.level}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Status: <span className="font-medium capitalize">{enrollment.status}</span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {enrollment.progress.completed} / {enrollment.progress.total} lessons
                    </span>
                  </div>
                  <div className="mb-4">
                    <Progress value={enrollment.progress.percentage} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/courses/${enrollment.courses.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Continue Learning
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't enrolled in any courses yet. Browse our courses to get started.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        )}
      </TabsContent>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>Your profile has been updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              <AvatarUpload currentAvatarUrl={avatarUrl} userId={profile.id} onAvatarUpdate={handleAvatarUpdate} />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <Label htmlFor="emailNotifications">
                  Receive email notifications about course updates and new content
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Language Preferences</h3>
              <div className="flex items-center space-x-2">
                <select
                  id="language"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  defaultValue="english"
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                  <option value="spanish">Spanish</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

