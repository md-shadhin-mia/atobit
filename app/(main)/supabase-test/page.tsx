'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/auth-client'

export default function SupabaseTestPage() {
  const [supabase, setSupabase] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Supabase client
    const client = createSupabaseClient()
    setSupabase(client)

    // Get current user session
    const getUser = async () => {
      if (client) {
        const userData = await client.auth.getUser()
        setUser(userData.data?.user || null)
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const handleSignIn = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'your-test-password'
      })
      if (error) console.error('Sign in error:', error.message)
    }
  }

  const handleSignOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('Sign out error:', error.message)
      else setUser(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Supabase Test Page</h1>
      
      {user ? (
        <div className="mb-4 p-4 bg-green-100 rounded">
          <p>Signed in as: {user.email}</p>
          <button 
            onClick={handleSignOut}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p>Not signed in</p>
          <button 
            onClick={handleSignIn}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In (Test)
          </button>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Supabase Status</h2>
        <p>Client initialized: {supabase ? 'Yes' : 'No'}</p>
        <p>User: {user ? 'Available' : 'Not available'}</p>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Note: To fully test this page:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Add your actual Supabase URL and ANON key to .env.local</li>
          <li>Create a test user account in your Supabase dashboard</li>
          <li>Update the email and password in the sign-in function</li>
        </ul>
      </div>
    </div>
  )
}