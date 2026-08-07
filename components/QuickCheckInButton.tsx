'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fireConfetti } from '@/components/ConfettiBurst';

interface QuickCheckInButtonProps {
    habitId: string;
    habitName: string;
    initiallyDone: boolean;
    color?: string;
}

export default function QuickCheckInButton({ habitId, habitName, initiallyDone, color = '#6366f1' }: QuickCheckInButtonProps) {
    const router = useRouter();
    const supabase = createClient();
    const [done, setDone] = useState(initiallyDone);
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        if (done || loading) return;
        setLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('habit_entries').insert({
                user_id: user.id,
                habit_id: habitId,
            });

            if (error) throw error;

            setDone(true);
            fireConfetti();
            toast.success(`Nice! ${habitName} done ✓`);
            router.refresh();
        } catch (err: unknown) {
            console.error('Quick check-in failed:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to check in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCheckIn}
            disabled={done || loading}
            aria-label={done ? `${habitName} completed today` : `Check in ${habitName}`}
            className={`relative flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-200 active:scale-90 disabled:cursor-default ${
                done
                    ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200'
                    : 'border-gray-300 bg-white text-gray-400 hover:text-white hover:border-transparent'
            }`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {done ? (
                    <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                        <Check size={18} strokeWidth={3} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="plus"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ scale: 0 }}
                        className="text-lg font-bold leading-none"
                        onMouseEnter={(e) => {
                            (e.currentTarget.parentElement as HTMLButtonElement)?.style.setProperty('background-color', color);
                            (e.currentTarget.parentElement as HTMLButtonElement)?.style.setProperty('border-color', color);
                        }}
                        onMouseLeave={(e) => {
                            const btn = e.currentTarget.parentElement as HTMLButtonElement;
                            btn.style.removeProperty('background-color');
                            btn.style.removeProperty('border-color');
                        }}
                    >
                        +
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
