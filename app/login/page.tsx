"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "true"
  const [justRegistered, setJustRegistered] = useState(registered)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (justRegistered) {
      setTimeout(() => {
        setJustRegistered(false)
      }, 5000)
    }
  }, [justRegistered])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      const supabase = createClient()

      // Log the email for debugging
      console.log("Attempting login with email:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        setDebugInfo({ error: error.message, code: error.code })
        throw error
      }

      if (!data.user || !data.session) {
        throw new Error("No user or session returned")
      }

      // Show success message briefly
      setSuccess(true)

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("Login error:", error)

      // Provide more specific error messages based on the error
      if (error.message?.includes("Invalid login credentials")) {
        setError("The email or password you entered is incorrect. Please try again.")
      } else if (error.message?.includes("Email not confirmed")) {
        setError("Please confirm your email address before logging in. Check your inbox for a confirmation email.")
      } else {
        setError(error.message || "An error occurred during login. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Login successful! Redirecting to dashboard...</AlertDescription>
            </Alert>
          )}

          {justRegistered && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Registration successful! Please log in with your new account.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Debug information toggle */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs text-gray-500 flex items-center"
            >
              <InfoIcon className="h-3 w-3 mr-1" />
              {showDebugInfo ? "Hide debug info" : "Show debug info"}
            </button>

            {showDebugInfo && debugInfo && (
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

