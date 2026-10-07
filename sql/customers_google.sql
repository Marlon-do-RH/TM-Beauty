-- Optional: allow Google-only accounts without a password.
alter table public.customers alter column password_hash drop not null;
alter table public.customers add column if not exists google_id text;
