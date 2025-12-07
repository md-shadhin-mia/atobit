'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart2, Share2, Check, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { processWeeklyData, processMonthlyData, processYearlyData, ChartData } from '@/lib/analytics';
import { createShareLink } from '@/app/actions';
import PageWrapper from '@/components/PageWrapper';

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [habit, setHabit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [sharing, setSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/signin');
                return;
            }

            // Fetch Habit
            const { data: habitData } = await supabase
                .from('habits')
                .select('*')
                .eq('id', id)
                .single();

            setHabit(habitData);

            // Fetch All Entries (could limit based on range, but for MVP fetching all is fine)
            const { data: entriesData } = await supabase
                .from('habit_entries')
                .select('created_at')
                .eq('user_id', user.id)
                .eq('habit_id', id);

            if (entriesData) {
                setEntries(entriesData);
            }
            setLoading(false);
        };

        fetchData();
    }, [id, router]); // supabase is stable

    const handleShare = async () => {
        setSharing(true);
        try {
            const shareId = await createShareLink(id);
            const url = `${window.location.origin}/share/${shareId}`;
            setShareUrl(url);
        } catch (error) {
            console.error('Failed to share', error);
            alert('Failed to generate share link');
        } finally {
            setSharing(false);
        }
    };

    const copyToClipboard = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading analytics...</div>;
    }

    if (!habit) return <div className="p-8 text-center">Habit not found</div>;

    let chartData: ChartData[] = [];
    let title = '';

    if (timeRange === 'week') {
        chartData = processWeeklyData(entries);
        title = 'Last 7 Days';
    } else if (timeRange === 'month') {
        chartData = processMonthlyData(entries);
        title = 'Last 4 Weeks';
    } else {
        chartData = processYearlyData(entries);
        title = 'Last 12 Months';
    }

    const totalCount = entries.length;

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link href={`/habit/${id}`} className="mr-4 text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{habit.name} Analytics</h1>
                            <p className="text-sm text-gray-500">Total Entries: {totalCount}</p>
                        </div>
                    </div>

                    <div className="relative">
                        {!shareUrl ? (
                            <button
                                onClick={handleShare}
                                disabled={sharing}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {sharing ? 'Generating...' : (
                                    <>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Share Progress
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    readOnly
                                    value={shareUrl}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48 sm:w-64 bg-gray-50 text-gray-500"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-2 rounded-lg ${copied ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                            {['week', 'month', 'year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range as any)}
                                    className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === range
                                        ? 'bg-white text-indigo-600 shadow-sm font-medium'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}

                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-500">
                        {timeRange === 'week' && 'Consistency is key! Try to keep all bars high.'}
                        {timeRange === 'month' && 'Weekly breakdown of your progress.'}
                        {timeRange === 'year' && 'Long term trends.'}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
