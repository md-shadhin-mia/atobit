#!/usr/bin/env node
// Runs supabase/setup.sql against your Supabase project via the Management API.
//
// Requires env vars:
//   SUPABASE_ACCESS_TOKEN   - Personal Access Token (Supabase dashboard > Account > Access Tokens)
//   NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PROJECT_REF - your project URL (e.g. https://abc123.supabase.co)
//
// Usage: npm run db:setup

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function projectRef() {
    const fromUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    if (fromUrl) {
        const match = fromUrl.match(/https:\/\/([a-z0-9-]+)\.supabase\./)
        if (match) return match[1]
    }
    if (process.env.SUPABASE_PROJECT_REF) return process.env.SUPABASE_PROJECT_REF
    throw new Error(
        'Cannot determine project ref. Set NEXT_PUBLIC_SUPABASE_URL (e.g. https://abc123.supabase.co) or SUPABASE_PROJECT_REF.'
    )
}

async function main() {
    const accessToken = process.env.SUPABASE_ACCESS_TOKEN
    if (!accessToken) {
        throw new Error(
            'Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens and add it to your environment.'
        )
    }

    const ref = projectRef()
    const sqlPath = join(__dirname, '..', 'supabase', 'setup.sql')
    const query = readFileSync(sqlPath, 'utf8')

    console.log(`Running setup.sql against project: ${ref} ...`)

    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })

    const text = await res.text()

    if (!res.ok) {
        console.error(`Request failed (${res.status}): ${text}`)
        process.exit(1)
    }

    console.log('Done. Tables, RLS policies, seed data and storage bucket are set up.')
}

main().catch((err) => {
    console.error(err.message || err)
    process.exit(1)
})
