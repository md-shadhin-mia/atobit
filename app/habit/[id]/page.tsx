import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HabitEntriesList from '@/components/HabitEntriesList';

export default async function HabitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/signin');
    }

    // Fetch Habit Details
    const { data: habit, error: habitError } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();

    if (habitError || !habit) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 text-center text-red-600">
                Error loading habit: {habitError?.message || 'Not found'}
            </div>
        );
    }

    // Fetch Entries
    const { data: entries, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_id', id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                            &larr; Back
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{habit.name}</h1>
                    </div>
                    <Link
                        href={`/habit/${id}/analytics`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View Analytics
                    </Link>
                </div>
            </header>
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Entries</h2>
                    <Link
                        href={`/habit/${id}/log`}
                        className="bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        + Log Entry
                    </Link>
                </div>

                {entriesError && (
                    <p className="text-red-500 mb-4">Failed to load entries.</p>
                )}

                <HabitEntriesList entries={entries || []} habitId={id} />
            </main>
        </div>
    );
}
