import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@kantera.com'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    // Create admin user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Administrator'
      }
    })

    if (error) {
      // If user already exists, that's okay
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { 
            message: 'Admin user already exists',
            email: adminEmail 
          },
          { status: 200 }
        )
      }
      
      return NextResponse.json(
        { error: 'Error creating admin user', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        email: adminEmail,
        userId: data.user?.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@kantera.com'
    
    return NextResponse.json(
      { 
        message: 'Admin creation endpoint',
        adminEmail: adminEmail,
        instructions: 'POST to this endpoint to create admin user'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
