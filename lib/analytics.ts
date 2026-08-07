import { startOfWeek, endOfWeek, subWeeks, subMonths, format, startOfMonth, endOfMonth, isSameDay, differenceInCalendarDays, startOfDay } from 'date-fns';

export interface ChartData {
    name: string;
    count: number;
    fullDate?: string;
}

export interface StreakStats {
    current: number;
    longest: number;
}

export interface HabitEntry {
    id: string;
    user_id: string;
    habit_id: string;
    note?: string | null;
    photo_url?: string | null;
    created_at: string;
}

// Returns the unique set of days (as yyyy-MM-dd strings) that have at least one entry.
function completedDays(entries: HabitEntry[]): Set<string> {
    const days = new Set<string>();
    for (const entry of entries || []) {
        days.add(format(new Date(entry.created_at), 'yyyy-MM-dd'));
    }
    return days;
}

// A streak counts consecutive completed days. The current streak ends today;
// if you completed yesterday but not today, it still counts (never miss twice).
export function computeStreaks(entries: HabitEntry[]): StreakStats {
    const days = completedDays(entries);
    if (days.size === 0) return { current: 0, longest: 0 };

    const today = startOfDay(new Date());
    const sorted = Array.from(days)
        .map((d) => startOfDay(new Date(d)))
        .sort((a, b) => a.getTime() - b.getTime());

    // Longest streak: walk the sorted days, count consecutive runs.
    let longest = 0;
    let run = 1;
    for (let i = 1; i < sorted.length; i++) {
        const gap = differenceInCalendarDays(sorted[i], sorted[i - 1]);
        if (gap === 1) {
            run += 1;
        } else {
            longest = Math.max(longest, run);
            run = 1;
        }
    }
    longest = Math.max(longest, run);

    // Current streak: walk backwards from today.
    // If today isn't completed but yesterday is, the streak still holds (today can still be completed).
    let current = 0;
    let cursor = today;
    if (!days.has(format(cursor, 'yyyy-MM-dd'))) {
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000); // check yesterday
    }
    while (days.has(format(cursor, 'yyyy-MM-dd'))) {
        current += 1;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
    }

    return { current, longest };
}

export function isCompletedToday(entries: HabitEntry[]): boolean {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    return completedDays(entries).has(today);
}

export function completedThisWeek(entries: HabitEntry[]): number {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return (entries || []).filter((e) => {
        const d = new Date(e.created_at);
        return d >= weekStart && d <= weekEnd;
    }).length;
}

export function processWeeklyData(entries: HabitEntry[]): ChartData[] {
    // Last 7 days
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        return d;
    });

    return last7Days.map(date => {
        const count = entries.filter(e => isSameDay(new Date(e.created_at), date)).length;
        return {
            name: format(date, 'EEE'), // Mon, Tue...
            count,
            fullDate: format(date, 'yyyy-MM-dd')
        };
    });
}

export function processMonthlyData(entries: HabitEntry[]): ChartData[] {
    // Last 4 weeks comparison or daily for the month? 
    // Requirement: "This month vs last month" kind of view, or just last 30 days.
    // Let's do last 30 days grouped by week for simplicity in bar chart, or just daily for 30 days is too wide.
    // Let's do last 4 weeks.

    const weeks = Array.from({ length: 4 }, (_, i) => {
        const end = subWeeks(new Date(), i);
        const start = startOfWeek(end);
        return { start, end, label: `Week ${4 - i}` };
    }).reverse();

    return weeks.map(week => {
        const count = entries.filter(e => {
            const d = new Date(e.created_at);
            return d >= week.start && d <= week.end;
        }).length;
        return {
            name: week.label,
            count
        };
    });
}

export function processYearlyData(entries: HabitEntry[]): ChartData[] {
    // Last 12 months
    const months = Array.from({ length: 12 }, (_, i) => {
        return subMonths(new Date(), 11 - i);
    });

    return months.map(date => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const count = entries.filter(e => {
            const d = new Date(e.created_at);
            return d >= monthStart && d <= monthEnd;
        }).length;
        return {
            name: format(date, 'MMM'),
            count
        };
    });
}
