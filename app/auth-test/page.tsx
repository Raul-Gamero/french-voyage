"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthTest() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/auth/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      setResult({
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        data,
      })
    } catch (error: any) {
      setResult({
        status: "error",
        message: error.message,
        error,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test your login credentials directly against the API</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={testAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email</Label>
              <Input id="test-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-password">Password</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Testing..." : "Test Authentication"}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Result:</h3>
              <Alert variant={result.status === "success" ? "default" : "destructive"}>
                <AlertDescription>
                  Status: {result.status} ({result.statusCode})
                </AlertDescription>
              </Alert>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

