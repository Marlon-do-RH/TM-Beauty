-- Run once in the Supabase SQL editor if the customers table does not exist.
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text,
  coupon_redeemed_at timestamptz,
  session_token text,
  created_at timestamptz default now()
);

alter table public.customers enable row level security;

drop policy if exists customers_anon_all on public.customers;
create policy customers_anon_all
  on public.customers
  for all
  to anon
  using (true)
  with check (true);
