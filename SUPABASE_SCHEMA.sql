-- OweMate Supabase schema
-- Run this once in Supabase SQL Editor.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person text not null check (length(trim(person)) > 0),
  amount numeric(14,2) not null check (amount > 0),
  type text not null check (type in ('lent', 'owed')),
  due_date date,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_due_date_idx on public.transactions(user_id, due_date);

alter table public.transactions enable row level security;

create policy "Users can read their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can create their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.transactions to authenticated;
