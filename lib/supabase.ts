import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/utils/supabase/env'

// Create a single supabase client for sharing throughout your application
const supabase = createClient<Database>(
  getSupabaseUrl(),
  getSupabaseAnonKey()
)

export default supabase
