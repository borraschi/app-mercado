-- Enable the pgvector extension to support the vector functionality if needed
-- create extension vector;

-- Enable Row Level Security (RLS)
alter table if exists public.users enable row level security;

-- Create feedback table
create table if not exists public.feedback (
    id uuid default gen_random_uuid() primary key,
    rating smallint not null check (rating >= 1 and rating <= 5),
    selectedOptions text[] not null,
    comment text,
    createdAt timestamp with time zone default now() not null
);

-- Enable Row Level Security for feedback table
alter table public.feedback enable row level security;

-- Allow public read access to feedback
create policy "Allow public read access for feedback"
    on public.feedback for select
    to authenticated, anon
    using (true);

-- Allow authenticated users to insert their own feedback
create policy "Allow authenticated users to insert feedback"
    on public.feedback for insert
    to authenticated
    with check (true);

-- Create reviews table
create table if not exists public.reviews (
    id uuid default gen_random_uuid() primary key,
    userId uuid not null references auth.users(id),
    rating smallint not null check (rating >= 1 and rating <= 5),
    comment text,
    createdAt timestamp with time zone default now() not null
);

-- Enable Row Level Security for reviews table
alter table public.reviews enable row level security;

-- Allow public read access to reviews
create policy "Allow public read access for reviews"
    on public.reviews for select
    to authenticated, anon
    using (true);

-- Allow authenticated users to insert their own reviews
create policy "Allow authenticated users to insert reviews"
    on public.reviews for insert
    to authenticated
    with check (auth.uid() = userId);

-- Create index for faster queries on created dates
create index if not exists feedback_createdAt_idx on public.feedback(createdAt desc);
create index if not exists reviews_createdAt_idx on public.reviews(createdAt desc);

-- Enable realtime for these tables
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.feedback;
alter publication supabase_realtime add table public.reviews;

-- Set up webhooks trigger (optional - if you need webhooks when data changes)
-- create function public.handle_new_feedback() returns trigger as $$
-- begin
--   perform net.http_post(
--     'https://your-webhook-url.com/feedback',
--     jsonb_build_object('feedback', row_to_json(new)),
--     'application/json'
--   );
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_feedback_created
--   after insert on public.feedback
--   for each row execute procedure public.handle_new_feedback();