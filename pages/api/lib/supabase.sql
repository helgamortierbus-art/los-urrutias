-- Enable UUID extension
create extension if not exists pgcrypto;

-- Bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  nights int not null,
  price_per_night numeric not null,
  total numeric not null,
  guest_name text,
  guest_email text,
  message text,
  status text default 'pending', -- pending / confirmed / cancelled
  created_at timestamptz default now()
);

-- Function to check for overlapping confirmed bookings
create or replace function can_insert_booking(p_start date, p_end date) returns boolean language sql stable as $$
  select not exists (
    select 1 from bookings b
    where b.status = 'confirmed'
      and b.start_date < p_end
      and p_start < b.end_date
  );
$$;

-- RPC to insert booking if available
create or replace function insert_booking_if_available(
  p_start date,
  p_end date,
  p_nights int,
  p_price numeric,
  p_total numeric,
  p_name text,
  p_email text,
  p_message text
) returns uuid language plpgsql as $$
declare
  v_ok boolean;
  v_id uuid;
begin
  select can_insert_booking(p_start, p_end) into v_ok;
  if not v_ok then
    raise exception 'dates_unavailable';
  end if;
  insert into bookings (start_date, end_date, nights, price_per_night, total, guest_name, guest_email, message, status)
    values (p_start, p_end, p_nights, p_price, p_total, p_name, p_email, p_message, 'pending')
    returning id into v_id;
  return v_id;
end;
$$;
