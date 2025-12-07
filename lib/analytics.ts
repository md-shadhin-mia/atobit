import { startOfWeek, endOfWeek, subWeeks, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export interface ChartData {
    name: string;
    count: number;
    fullDate?: string;
}

export function processWeeklyData(entries: any[]): ChartData[] {
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

export function processMonthlyData(entries: any[]): ChartData[] {
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

export function processYearlyData(entries: any[]): ChartData[] {
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
