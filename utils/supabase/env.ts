const MISSING_MSG = (names: string) =>
    `Missing Supabase environment variables: ${names}. ` +
    'Set them in your deployment platform (Vercel/Netlify dashboard), your server environment, or a .env.local file.'

export function getSupabaseUrl(): string {
    const value =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL

    if (!value) {
        throw new Error(MISSING_MSG('NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)'))
    }

    return value
}

export function getSupabaseAnonKey(): string {
    const value =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY

    if (!value) {
        throw new Error(
            MISSING_MSG('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
        )
    }

    return value
}

export function getSupabaseServiceRoleKey(): string | undefined {
    // Server-only secret. NEVER expose this to the client.
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
    return value || undefined
}
