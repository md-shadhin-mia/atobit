import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types/supabase'

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Function to get the current user session
export const getCurrentUser = async () => {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

// Function to sign up a new user
export const signUp = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// Function to sign in an existing user
export const signIn = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Function to sign out the current user
export const signOut = async () => {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Function to reset user password
export const resetPassword = async (email: string) => {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { error }
}