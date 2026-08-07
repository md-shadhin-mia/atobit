-- ============================================================
-- Atobit - Full schema setup (run this ONCE in Supabase SQL editor)
-- Safe to re-run: uses IF NOT EXISTS guards.
-- ============================================================

-- 1. habits table
create table if not exists habits (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users,
  color text default '#6366f1',
  icon text default 'star',
  frequency text default 'daily', -- 'daily' | 'weekly'
  days_of_week int[],             -- e.g. {1,3,5} for weekly (0=Sun..6=Sat)
  reminder_time time
);

-- 2. habit_entries table
create table if not exists habit_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references habits(id) not null,
  note text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. habit_shares table
create table if not exists habit_shares (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references habits(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Row Level Security
alter table habits enable row level security;
alter table habit_entries enable row level security;
alter table habit_shares enable row level security;

-- 5. Policies: habits
drop policy if exists "Habits are viewable by everyone" on habits;
drop policy if exists "Users can view global and own habits" on habits;
create policy "Users can view global and own habits"
on habits for select
using ( user_id is null or user_id = auth.uid() );

drop policy if exists "Users can insert own habits" on habits;
create policy "Users can insert own habits"
on habits for insert
with check ( auth.uid() = user_id );

drop policy if exists "Users can update own habits" on habits;
create policy "Users can update own habits"
on habits for update
using ( auth.uid() = user_id );

drop policy if exists "Users can delete own habits" on habits;
create policy "Users can delete own habits"
on habits for delete
using ( auth.uid() = user_id );

-- 6. Policies: habit_entries
drop policy if exists "Users can view their own entries" on habit_entries;
create policy "Users can view their own entries"
on habit_entries for select
using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own entries" on habit_entries;
create policy "Users can insert their own entries"
on habit_entries for insert
with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own entries" on habit_entries;
create policy "Users can update their own entries"
on habit_entries for update
using ( auth.uid() = user_id );

drop policy if exists "Users can delete own entries" on habit_entries;
create policy "Users can delete own entries"
on habit_entries for delete
using ( auth.uid() = user_id );

-- 7. Policies: habit_shares
drop policy if exists "Users can manage their own shares" on habit_shares;
create policy "Users can manage their own shares"
on habit_shares for all
using ( auth.uid() = user_id );

-- 8. Seed data (only if empty)
insert into habits (name, user_id)
select name, null from (values
  ('Morning Skincare'),
  ('Night Skincare'),
  ('Hair Care Routine'),
  ('Drink Water')
) as seed(name)
where not exists (select 1 from habits where user_id is null);

-- 9. Storage bucket
insert into storage.buckets (id, name, public)
values ('habit-photos', 'habit-photos', true)
on conflict (id) do nothing;

drop policy if exists "Habit photos: upload" on storage.objects;
create policy "Habit photos: upload"
on storage.objects for insert
with check ( bucket_id = 'habit-photos' and auth.role() = 'authenticated' );

drop policy if exists "Habit photos: read" on storage.objects;
create policy "Habit photos: read"
on storage.objects for select
using ( bucket_id = 'habit-photos' );

drop policy if exists "Habit photos: delete" on storage.objects;
create policy "Habit photos: delete"
on storage.objects for delete
using ( bucket_id = 'habit-photos' and auth.uid()::text = (storage.foldername(name))[1] );
