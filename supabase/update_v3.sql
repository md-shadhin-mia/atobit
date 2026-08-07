-- Phase 1: Habit customization + RLS fixes
-- Run this in the Supabase SQL editor.

-- 1. Add customization fields to habits table
alter table habits
  add column color text default '#6366f1',
  add column icon text default 'star',
  add column frequency text default 'daily', -- 'daily' | 'weekly'
  add column days_of_week int[],             -- e.g. {1,3,5} for weekly (0=Sun..6=Sat)
  add column reminder_time time;

-- 2. RLS fixes
-- Habits currently have no UPDATE/DELETE policy, so custom habits cannot be edited/deleted.
create policy "Users can update own habits"
on habits for update
using ( auth.uid() = user_id );

create policy "Users can delete own habits"
on habits for delete
using ( auth.uid() = user_id );

-- habit_entries has no DELETE policy even though the app deletes entries client-side.
create policy "Users can delete own entries"
on habit_entries for delete
using ( auth.uid() = user_id );
