-- OweMate initial transactions schema
-- This migration documents the production table currently used by the app.
-- It is safe to apply to a fresh Supabase project.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person text not null check (char_length(trim(person)) > 0),
  amount numeric not null check (amount > 0),
  type text not null check (type in ('lent', 'borrowed')),
  status text not null default 'pending' check (status in ('pending', 'settled')),
  due_date date,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists transactions_user_created_at_idx
  on public.transactions (user_id, created_at desc);

create index if not exists transactions_user_due_date_idx
  on public.transactions (user_id, due_date)
  where due_date is not null;

alter table public.transactions enable row level security;

drop policy if exists "Users can read their own transactions" on public.transactions;
create policy "Users can read their own transactions"
  on public.transactions
  for select
  to public
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own transactions" on public.transactions;
create policy "Users can create their own transactions"
  on public.transactions
  for insert
  to public
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own transactions" on public.transactions;
create policy "Users can update their own transactions"
  on public.transactions
  for update
  to public
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own transactions" on public.transactions;
create policy "Users can delete their own transactions"
  on public.transactions
  for delete
  to public
  using (auth.uid() = user_id);
