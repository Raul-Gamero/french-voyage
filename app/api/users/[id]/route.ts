import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to access their own data or admins to access any data
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (session.user.id !== params.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to update their own data or admins to update any data
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (session.user.id !== params.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updates = await request.json()

    // Don't allow changing the role unless the user is an admin
    if (updates.role && profile?.role !== "admin") {
      delete updates.role
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow users to delete their own account or admins to delete any account
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (session.user.id !== params.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the user's profile
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", params.id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // Delete the user's auth account if it's the user deleting their own account
    if (session.user.id === params.id) {
      const { error: authError } = await supabase.auth.admin.deleteUser(params.id)

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

