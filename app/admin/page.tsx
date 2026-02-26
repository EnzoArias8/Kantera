import { LoginForm } from "./login-form"
import { AdminDashboard } from "./dashboard"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Simple server-side authentication check
async function checkAuth() {
  // For now, we'll use a simple cookie-based auth
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')
  const authCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('admin_auth='))?.split('=')[1]
  
  // If no cookie, not authenticated
  if (!authCookie) {
    return false
  }
  
  // Decode cookie to get credentials
  try {
    const [email, password] = atob(authCookie).split(':')
    
    // Verify credentials with Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })
    
    return !error && data.user ? true : false
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

export default async function AdminPage() {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return <LoginForm />
  }
  
  return <AdminDashboard />
}
