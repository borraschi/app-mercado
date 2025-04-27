-- Create feedback table
create table if not exists public.feedback (
    id uuid default gen_random_uuid() primary key,
    rating smallint not null check (rating >= 1 and rating <= 5),
    selectedOptions text[] not null,
    comment text,
    createdAt timestamp with time zone default now() not null
);

-- Create reviews table
create table if not exists public.reviews (
    id uuid default gen_random_uuid() primary key,
    userId text not null, -- Just a simple identifier string instead of UUID reference
    rating smallint not null check (rating >= 1 and rating <= 5),
    comment text,
    createdAt timestamp with time zone default now() not null
);

-- Create index for faster queries on created dates
create index if not exists feedback_createdAt_idx on public.feedback(createdAt desc);
create index if not exists reviews_createdAt_idx on public.reviews(createdAt desc);

-- Disable RLS (Row Level Security) since we don't need authentication
alter table public.feedback disable row level security;
alter table public.reviews disable row level security;

-- Enable realtime for these tables
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.feedback;
alter publication supabase_realtime add table public.reviews;