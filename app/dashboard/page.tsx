import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

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

  return (
    <PageWrapper>

      <main>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <p className="mt-1 text-sm text-gray-500">Select a habit to log activity or view progress.</p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-700">Error loading habits: {error.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {habits?.map((habit) => (
            <Link
              key={habit.id}
              href={`/habit/${habit.id}`}
              className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 border border-transparent hover:border-indigo-100"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    {/* Placeholder Icon based on name? */}
                    <div className="h-6 w-6 text-indigo-600 flex items-center justify-center font-bold">
                      {habit.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      {habit.name}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      Click to track
                    </dd>
                  </div>
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

          {habits?.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
              <p className="text-gray-500">No habits found. Run the seed script!</p>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
}