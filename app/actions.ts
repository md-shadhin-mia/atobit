'use server';

import { createClient } from '@/utils/supabase/server';

export async function createShareLink(habitId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check if share already exists for this user/habit?
    // Or just create new one. Let's check first to avoid spamming.
    const { data: existing } = await supabase
        .from('habit_shares')
        .select('id')
        .eq('user_id', user.id)
        .eq('habit_id', habitId)
        .single();

    if (existing) {
        return existing.id;
    }

    const { data, error } = await supabase
        .from('habit_shares')
        .insert({
            user_id: user.id,
            habit_id: habitId
        })
        .select('id')
        .single();

    if (error) throw new Error(error.message);
    return data.id;
}
