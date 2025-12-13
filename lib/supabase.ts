import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

// Create a single supabase client for sharing throughout your application
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase