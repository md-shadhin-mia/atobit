-- 1. Modify habits table to support custom habits
-- Add user_id column (nullable). 
-- null user_id means "Global/Predefined". 
-- Non-null means "Custom/Private".

alter table habits 
add column user_id uuid references auth.users;

-- 2. Update RLS for habits
-- Drop old policy
drop policy "Habits are viewable by everyone" on habits;

-- Create new SELECT policy:
-- Users can see habits where user_id is NULL (global) OR user_id is their own id.
create policy "Users can view global and own habits"
on habits for select
using ( 
  user_id is null 
  or 
  user_id = auth.uid() 
);

-- Create INSERT policy:
-- Authenticated users can insert habits if they set their own user_id
create policy "Users can insert own habits"
on habits for insert
with check ( 
  auth.uid() = user_id 
);

-- 3. Create habit_shares table for Sharing Feature
create table habit_shares (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references habits(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for habit_shares
alter table habit_shares enable row level security;

-- Owner can insert/view their shares
create policy "Users can manage their own shares"
on habit_shares for all
using ( auth.uid() = user_id );

-- Public Access? 
-- Since we want a public link, we'll use a Service Role client on the server side to fetch this data 
-- bypassing RLS. So we don't need a public RLS policy here.
