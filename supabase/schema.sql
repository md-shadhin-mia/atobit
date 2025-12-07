-- Create a table for public profiles (optional, but good practice if needed later)
-- For this MVP, we rely on auth.users mostly, but habits need to be linked.

-- 1. Create habits table (Predefined list)
create table habits (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create habit_entries table
create table habit_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references habits(id) not null,
  note text,
  photo_url text, -- Store the path or full URL to Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS)

-- Enable RLS
alter table habits enable row level security;
alter table habit_entries enable row level security;

-- Policies for habits
-- Everyone can view habits (since they are predefined and shared)
create policy "Habits are viewable by everyone" 
  on habits for select 
  using ( true );

-- Only service role (admin) can insert/update/delete habits normally, 
-- but for MVP if you want to add them via SQL editor, that's fine.

-- Policies for habit_entries
-- Users can see only their own entries
create policy "Users can view their own entries" 
  on habit_entries for select 
  using ( auth.uid() = user_id );

-- Users can insert their own entries
create policy "Users can insert their own entries" 
  on habit_entries for insert 
  with check ( auth.uid() = user_id );

-- Users can update their own entries
create policy "Users can update their own entries" 
  on habit_entries for update 
  using ( auth.uid() = user_id );

-- 4. Seed Data
insert into habits (name) values
  ('Morning Skincare'),
  ('Night Skincare'),
  ('Hair Care Routine'),
  ('Drink Water');

-- 5. Storage (Instructions for User)
-- Please create a NEW BUCKET in Supabase Storage named 'habit-photos'.
-- Set it to Public.
-- Policy: Give authenticated users INSERT SELECT access.
