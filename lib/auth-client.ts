import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types/supabase'

export const createSupabaseClient = () =>
  typeof window !== 'undefined'
    ? createBrowserClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )
    : null

// Client-side function to get the current user session
export const getCurrentUserClient = async () => {
  const supabase = createSupabaseClient()
  if (!supabase) return null
  
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

// Client-side function to sign up a new user
export const signUpClient = async (email: string, password: string) => {
  const supabase = createSupabaseClient()
  if (!supabase) return { data: null, error: { message: 'Supabase client not available' } }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// Client-side function to sign in an existing user
export const signInClient = async (email: string, password: string) => {
  const supabase = createSupabaseClient()
  if (!supabase) return { data: null, error: { message: 'Supabase client not available' } }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Client-side function to sign out the current user
export const signOutClient = async () => {
  const supabase = createSupabaseClient()
  if (!supabase) return { error: { message: 'Supabase client not available' } }
  
  const { error } = await supabase.auth.signOut()
  return { error }
}