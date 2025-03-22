"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Trash2, Edit, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminTabs({
  users,
  courses,
  contactMessages,
}: {
  users: any[]
  courses: any[]
  contactMessages: any[]
}) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Course form state
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseLevel, setCourseLevel] = useState("A1")
  const [coursePrice, setCoursePrice] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseImageUrl, setCourseImageUrl] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  const resetCourseForm = () => {
    setCourseTitle("")
    setCourseDescription("")
    setCourseLevel("A1")
    setCoursePrice("")
    setCourseDuration("")
    setCourseImageUrl("")
    setIsFeatured(false)
    setEditingCourseId(null)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const courseData = {
        title: courseTitle,
        description: courseDescription,
        level: courseLevel,
        price: Number.parseFloat(coursePrice),
        duration_weeks: Number.parseInt(courseDuration),
        image_url: courseImageUrl || null,
        is_featured: isFeatured,
      }

      let response

      if (editingCourseId) {
        response = await fetch(`/api/admin/courses/${editingCourseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        })
      } else {
        response = await fetch("/api/admin/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save course")
      }

      setSuccess(true)
      resetCourseForm()
      setIsAddCourseOpen(false)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleEditCourse = (course: any) => {
    setCourseTitle(course.title)
    setCourseDescription(course.description || "")
    setCourseLevel(course.level)
    setCoursePrice(course.price.toString())
    setCourseDuration(course.duration_weeks.toString())
    setCourseImageUrl(course.image_url || "")
    setIsFeatured(course.is_featured)
    setEditingCourseId(course.id)
    setIsAddCourseOpen(true)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete course")
      }

      setSuccess(true)
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="messages">Contact Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users registered on the platform</CardDescription>
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
                <AlertDescription>Operation completed successfully!</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="courses">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Create, edit, and manage courses</CardDescription>
            </div>
            <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetCourseForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingCourseId ? "Edit Course" : "Add New Course"}</DialogTitle>
                  <DialogDescription>
                    {editingCourseId
                      ? "Update the course details below."
                      : "Fill in the details to create a new course."}
                  </DialogDescription>
                </DialogHeader>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select value={courseLevel} onValueChange={setCourseLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1 - Beginner</SelectItem>
                          <SelectItem value="A2">A2 - Elementary</SelectItem>
                          <SelectItem value="B1">B1 - Intermediate</SelectItem>
                          <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                          <SelectItem value="C1">C1 - Advanced</SelectItem>
                          <SelectItem value="C2">C2 - Proficiency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (weeks)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input id="imageUrl" value={courseImageUrl} onChange={(e) => setCourseImageUrl(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="featured">Featured Course</Label>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : editingCourseId ? "Update Course" : "Add Course"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 mr-2" />
                <AlertDescription>Operation completed successfully!</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.level}</TableCell>
                        <TableCell>${course.price}</TableCell>
                        <TableCell>{course.duration_weeks} weeks</TableCell>
                        <TableCell>{course.is_featured ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course)} className="mr-2">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No courses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>View and manage messages from the contact form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessages.length > 0 ? (
                    contactMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              message.responded ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {message.responded ? "Responded" : "Pending"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No messages found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

