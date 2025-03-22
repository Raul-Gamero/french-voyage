"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only run Supabase code in the browser
    if (typeof window !== "undefined") {
      const supabase = createClient()

      async function getUser() {
        setIsLoading(true)
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          setUser(session?.user || null)

          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
          })

          return () => {
            authListener.subscription.unsubscribe()
          }
        } catch (error) {
          console.error("Error getting user session:", error)
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }

      getUser()
    } else {
      // If we're on the server, just set loading to false
      setIsLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">French Voyage Akademie</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                About
              </Link>
              <Link
                href="/courses"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Courses
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact
              </Link>

              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                      </Link>
                      <Button variant="ghost" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link href="/login">
                        <Button variant="outline">Login</Button>
                      </Link>
                      <Link href="/register">
                        <Button>Register</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              About
            </Link>
            <Link
              href="/courses"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Courses
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className="space-y-2 pt-2">
                    <Link href="/dashboard" className="block w-full">
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleLogout} className="w-full">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link href="/login" className="block w-full">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="block w-full">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

