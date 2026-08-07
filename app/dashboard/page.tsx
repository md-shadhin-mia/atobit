import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import QuickCheckInButton from '@/components/QuickCheckInButton';
import { computeStreaks, isCompletedToday, type HabitEntry } from '@/lib/analytics';
import { HabitIcon } from '@/lib/habit-ui';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  // Fetch habits
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true });

  // Fetch all of the user's entries (used for streaks + today check)
  const { data: allEntries } = await supabase
    .from('habit_entries')
    .select('id, habit_id, created_at')
    .eq('user_id', user.id);

  const entriesByHabit = new Map<string, HabitEntry[]>();
  for (const entry of (allEntries || []) as HabitEntry[]) {
    const list = entriesByHabit.get(entry.habit_id) || [];
    list.push(entry);
    entriesByHabit.set(entry.habit_id, list);
  }

  type EnrichedHabit = {
    id: string;
    name: string;
    color: string;
    icon?: string | null;
    entries: HabitEntry[];
    streaks: ReturnType<typeof computeStreaks>;
    doneToday: boolean;
  };

  const enrich = (habit: { id: string; name: string; color?: string | null; icon?: string | null }): EnrichedHabit => {
    const entries = entriesByHabit.get(habit.id) || [];
    return {
      ...habit,
      color: habit.color || '#6366f1',
      entries,
      streaks: computeStreaks(entries),
      doneToday: isCompletedToday(entries),
    };
  };

  const enriched = (habits || []).map(enrich);

  return (
    <PageWrapper>

      <main>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <p className="mt-1 text-sm text-gray-500">Tap + to check in instantly. Select a habit for details or photo logging.</p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-700">Error loading habits: {error.message}</p>
          </div>
        )}

        {/* Today section */}
        {enriched.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Today</h3>
              <span className="text-xs text-gray-400">
                {enriched.filter((h) => h.doneToday).length}/{enriched.length} done
              </span>
            </div>
            <div className="space-y-2">
              {enriched.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center min-w-0">
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${habit.color}1A`, color: habit.color }}
                    >
                      <HabitIcon name={habit.icon} size={20} />
                    </div>
                    <div className="ml-3 min-w-0">
                      <Link
                        href={`/habit/${habit.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
                      >
                        {habit.name}
                      </Link>
                      {habit.streaks.current > 0 && (
                        <span className="text-xs text-orange-500">
                          🔥 {habit.streaks.current} day streak
                        </span>
                      )}
                    </div>
                  </div>
                  <QuickCheckInButton
                    habitId={habit.id}
                    habitName={habit.name}
                    initiallyDone={habit.doneToday}
                    color={habit.color}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All habits grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((habit) => (
            <Link
              key={habit.id}
              href={`/habit/${habit.id}`}
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 border border-transparent hover:border-indigo-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 rounded-md p-3"
                    style={{ backgroundColor: `${habit.color}1A` }}
                  >
                    <div
                      className="h-6 w-6 flex items-center justify-center"
                      style={{ color: habit.color }}
                    >
                      <HabitIcon name={habit.icon} size={24} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      {habit.name}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      {habit.doneToday ? (
                        <span className="text-green-600 font-medium">Completed today ✓</span>
                      ) : (
                        'Click to track'
                      )}
                    </dd>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center text-orange-600 bg-orange-50 rounded-full px-2.5 py-1">
                    🔥 {habit.streaks.current} day
                  </span>
                  <span className="inline-flex items-center text-gray-500 bg-gray-50 rounded-full px-2.5 py-1">
                    Best: {habit.streaks.longest} days
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Habit Card */}
          <Link
            href="/dashboard/add-habit"
            className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 border-2 border-dashed border-gray-300 hover:border-indigo-400 group"
          >
            <div className="px-4 py-5 sm:p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 text-gray-400 group-hover:text-indigo-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-600 group-hover:text-indigo-600">Create New Habit</span>
            </div>
          </Link>

          {enriched.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
              <p className="text-gray-500">No habits found. Create your first habit!</p>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
}
