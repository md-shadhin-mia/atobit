import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { processWeeklyData, processMonthlyData, processYearlyData, ChartData } from '@/lib/analytics';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';

// Special client to fetch shared data even if unauthenticated
// Normally we'd use service role key in a real private environment,
// but for this MVP, RLS prevents standard public access. 
// If the user hasn't set SUPABASE_SERVICE_ROLE_KEY, this might fail unless RLS is open.
// To make this robust, we assume the user adds the Service Role Key env var.
// If they don't, we can try using the anon key but that would require public RLS policies.
// Given the prompt, I'll attempt to use the service role if available, or fall back to standard but it might hit RLS.

async function createAdminClient() {
    const cookieStore = await cookies()
    // Use Service Role Key if available to bypass RLS for sharing
    // CAUTION: Only use for specific, safe queries like this one.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { }
            },
        }
    )
}

// Client component wrapper for charts since Recharts is client-side only
import ShareChart from './share-chart';

export default async function SharePage({ params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const supabase = await createAdminClient();

    // 1. Resolve Share Key
    const { data: share, error } = await supabase
        .from('habit_shares')
        .select('*')
        .eq('id', key)
        .single();

    if (error || !share) {
        notFound();
    }

    // 2. Fetch Habit Details
    const { data: habit } = await supabase
        .from('habits')
        .select('name')
        .eq('id', share.habit_id)
        .single();

    // 3. Fetch Entries
    const { data: entries } = await supabase
        .from('habit_entries')
        .select('created_at')
        .eq('user_id', share.user_id)
        .eq('habit_id', share.habit_id);

    const safeEntries = entries || [];
    const totalCount = safeEntries.length;

    // Process data for the view (Default to Weekly or show all?)
    // Let's show Weekly for simplicity or all 3 charts? 
    // Let's just pass data to client component

    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">{habit?.name || 'Habit'} Progress</h1>
                        <p className="text-indigo-100">Shared via Atbits Tracker</p>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-center mb-8">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <span className="block text-3xl font-bold text-gray-800">{totalCount}</span>
                                <span className="text-sm text-gray-500 uppercase tracking-tighter">Total Completed Days</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Weekly Consistency</h3>
                            <div className="h-64 w-full">
                                <ShareChart entries={safeEntries} />
                            </div>
                        </div>

                        <div className="text-center border-t pt-6">
                            <p className="text-gray-600 mb-4">Inspired? Start tracking your own habits today.</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Get Atbits Free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
