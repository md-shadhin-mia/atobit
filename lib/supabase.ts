import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

// Create a single supabase client for sharing throughout your application
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default supabase