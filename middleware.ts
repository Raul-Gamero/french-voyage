import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Check if Supabase environment variables are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables in middleware")
      return response
    }

    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          try {
            return request.cookies.get(name)?.value
          } catch (error) {
            console.error(`Error getting cookie ${name}:`, error)
            return undefined
          }
        },
        set(name: string, value: string, options: any) {
          try {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error)
          }
        },
        remove(name: string, options: any) {
          try {
            request.cookies.set({
              name,
              value: "",
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error)
          }
        },
      },
    })

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Protected routes that require authentication
      const protectedRoutes = ["/dashboard"]

      // Admin-only routes
      const adminRoutes = ["/admin"]

      const path = request.nextUrl.pathname

      // Check if the route is protected and user is not authenticated
      if (protectedRoutes.some((route) => path.startsWith(route)) && !session) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Check if the route is admin-only and user is not an admin
      if (adminRoutes.some((route) => path.startsWith(route)) && session) {
        try {
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

          if (profile?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
          }
        } catch (error) {
          console.error("Error checking admin role:", error)
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    } catch (error) {
      console.error("Error in middleware auth check:", error)
      // Continue with the request even if there's an auth error
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // Return a basic response if middleware fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}

