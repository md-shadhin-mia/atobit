'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Loader2, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import { HABIT_COLORS, HABIT_ICON_OPTIONS, getHabitIcon } from '@/lib/habit-ui';

export default function AddHabitPage() {
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');
    const [icon, setIcon] = useState('star');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error: insertError } = await supabase
                .from('habits')
                .insert({
                    name: name,
                    user_id: user.id,
                    color,
                    icon,
                    frequency,
                });

            if (insertError) throw insertError;

            router.push('/dashboard');
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create habit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Link href="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">New Habit</h1>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Create a custom habit to track. This will be visible only to you.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Habit Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., 10-Step Skincare"
                                required
                            />
                        </div>

                        {/* Frequency */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['daily', 'weekly'] as const).map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setFrequency(f)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                            frequency === f
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'
                                        }`}
                                    >
                                        {f === 'daily' ? 'Daily' : 'Weekly'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon
                            </label>
                            <div className="grid grid-cols-8 gap-1.5">
                                {HABIT_ICON_OPTIONS.map((opt) => {
                                    const Icon = getHabitIcon(opt.key);
                                    const selected = icon === opt.key;
                                    return (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => setIcon(opt.key)}
                                            title={opt.label}
                                            className={`flex items-center justify-center h-9 w-9 rounded-lg border transition-colors ${
                                                selected
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {HABIT_COLORS.map((c) => {
                                    const selected = color === c.value;
                                    return (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setColor(c.value)}
                                            title={c.name}
                                            className={`relative h-8 w-8 rounded-full flex items-center justify-center transition-transform ${
                                                selected ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: c.value }}
                                        >
                                            {selected && <Check size={16} className="text-white" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                    Create Habit
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
