import { createElement, type CSSProperties } from 'react';
import {
    Star, Dumbbell, BookOpen, GlassWater, Bed, Brush, Moon, Sun,
    Leaf, Heart, Music, PenLine, Smile, Coffee, Footprints, Brain,
    type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
    star: Star,
    dumbbell: Dumbbell,
    book: BookOpen,
    water: GlassWater,
    bed: Bed,
    brush: Brush,
    moon: Moon,
    sun: Sun,
    leaf: Leaf,
    heart: Heart,
    music: Music,
    journal: PenLine,
    smile: Smile,
    coffee: Coffee,
    walk: Footprints,
    mind: Brain,
};

export function getHabitIcon(name?: string | null): LucideIcon {
    if (name && ICONS[name]) return ICONS[name];
    return Star;
}

export function HabitIcon({ name, size = 24, className, style }: { name?: string | null; size?: number; className?: string; style?: CSSProperties }) {
    const Icon = getHabitIcon(name);
    return createElement(Icon, { size, className, style });
}

export const HABIT_COLORS: { name: string; value: string }[] = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Slate', value: '#64748b' },
];

export const HABIT_ICON_OPTIONS: { key: string; label: string }[] = [
    { key: 'star', label: 'Star' },
    { key: 'dumbbell', label: 'Workout' },
    { key: 'book', label: 'Reading' },
    { key: 'water', label: 'Water' },
    { key: 'bed', label: 'Sleep' },
    { key: 'brush', label: 'Skincare' },
    { key: 'moon', label: 'Night' },
    { key: 'sun', label: 'Morning' },
    { key: 'leaf', label: 'Nature' },
    { key: 'heart', label: 'Health' },
    { key: 'music', label: 'Music' },
    { key: 'journal', label: 'Journal' },
    { key: 'smile', label: 'Mood' },
    { key: 'coffee', label: 'Coffee' },
    { key: 'walk', label: 'Walk' },
    { key: 'mind', label: 'Mind' },
];
