-- Superior Concrete Works: database schema, security rules, storage bucket and demo products.
-- Already applied to the Supabase project this site was built with. Keep this file to rebuild the database from scratch
-- (paste it into the Supabase SQL editor of a new project).

-- ---------- admins ----------
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins can read their own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;

-- ---------- products ----------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null check (char_length(name) between 1 and 160),
  category text not null check (category in ('balusters','columns','flower-pots','window-moulds','molds','other')),
  short_description text,
  description text,
  price numeric(12,2) check (price is null or price >= 0),
  price_currency text not null default 'TTD' check (price_currency = 'TTD'),
  is_demo boolean not null default false,
  availability text not null default 'on_request'
    check (availability in ('in_stock','made_to_order','on_request','out_of_stock')),
  featured boolean not null default false,
  active boolean not null default true,
  images jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category) where active;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
create policy "public can read active products" on public.products
  for select to anon, authenticated using (active or public.is_admin());
create policy "admins insert products" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "admins update products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete products" on public.products
  for delete to authenticated using (public.is_admin());

-- ---------- gallery ----------
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null default '',
  caption text,
  category text,
  illustrative boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.gallery_items enable row level security;
revoke all on public.gallery_items from anon, authenticated;
grant select on public.gallery_items to anon;
grant select, insert, update, delete on public.gallery_items to authenticated;
create policy "public can read gallery" on public.gallery_items
  for select to anon, authenticated using (true);
create policy "admins insert gallery" on public.gallery_items
  for insert to authenticated with check (public.is_admin());
create policy "admins update gallery" on public.gallery_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete gallery" on public.gallery_items
  for delete to authenticated using (public.is_admin());

-- ---------- quote requests ----------
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  name text not null check (char_length(name) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  country text check (country is null or char_length(country) <= 80),
  items jsonb not null default '[]'::jsonb,
  message text check (message is null or char_length(message) <= 4000),
  check (email is not null or phone is not null)
);
alter table public.quote_requests enable row level security;
revoke all on public.quote_requests from anon, authenticated;
grant insert on public.quote_requests to anon, authenticated;
grant select, update, delete on public.quote_requests to authenticated;
create policy "anyone can request a quote" on public.quote_requests
  for insert to anon, authenticated
  with check (status = 'new' and jsonb_typeof(items) = 'array' and jsonb_array_length(items) <= 30);
create policy "admins read quotes" on public.quote_requests
  for select to authenticated using (public.is_admin());
create policy "admins update quotes" on public.quote_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete quotes" on public.quote_requests
  for delete to authenticated using (public.is_admin());

-- ---------- orders (created only through place_order) ----------
create sequence public.order_number_seq start 1001;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('SCW-' || nextval('public.order_number_seq')),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new','confirmed','paid','shipped','completed','cancelled')),
  kind text not null default 'order' check (kind in ('order','quote')),
  customer_name text not null,
  email text,
  phone text not null,
  country text,
  delivery_address text,
  notes text,
  items jsonb not null,
  total numeric(12,2),
  currency text not null default 'TTD' check (currency = 'TTD')
);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select, update, delete on public.orders to authenticated;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete orders" on public.orders
  for delete to authenticated using (public.is_admin());

-- Prices are always read from the products table here, never trusted from the browser.
create or replace function public.place_order(
  p_name text, p_email text, p_phone text, p_country text,
  p_address text, p_notes text, p_items jsonb
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_item jsonb;
  v_prod public.products%rowtype;
  v_qty int;
  v_lines jsonb := '[]'::jsonb;
  v_total numeric(12,2) := 0;
  v_needs_quote boolean := false;
  v_order public.orders%rowtype;
begin
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_phone), '') = '' then
    raise exception 'Name and phone number are required';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'Your cart is empty';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := greatest(1, least(coalesce((v_item->>'qty')::int, 1), 999));
    select * into v_prod from public.products
      where id = (v_item->>'product_id')::uuid and active;
    if not found then
      raise exception 'A product in your cart is no longer available';
    end if;
    v_lines := v_lines || jsonb_build_object(
      'product_id', v_prod.id, 'slug', v_prod.slug, 'name', v_prod.name,
      'qty', v_qty, 'unit_price', v_prod.price, 'is_demo', v_prod.is_demo);
    if v_prod.price is null then
      v_needs_quote := true;
    else
      v_total := v_total + v_prod.price * v_qty;
    end if;
  end loop;

  insert into public.orders (kind, customer_name, email, phone, country,
                             delivery_address, notes, items, total)
  values (
    case when v_needs_quote then 'quote' else 'order' end,
    left(trim(p_name), 120),
    nullif(left(trim(coalesce(p_email, '')), 200), ''),
    left(trim(p_phone), 40),
    nullif(left(trim(coalesce(p_country, '')), 80), ''),
    nullif(left(trim(coalesce(p_address, '')), 500), ''),
    nullif(left(trim(coalesce(p_notes, '')), 2000), ''),
    v_lines,
    case when v_needs_quote then null else v_total end
  ) returning * into v_order;

  return jsonb_build_object(
    'order_number', v_order.order_number, 'kind', v_order.kind,
    'total', v_order.total, 'items', v_lines);
end $$;
revoke all on function public.place_order(text,text,text,text,text,text,jsonb) from public;
grant execute on function public.place_order(text,text,text,text,text,text,jsonb) to anon, authenticated;

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 8388608,
        array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
create policy "admins upload site images" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
create policy "admins update site images" on storage.objects
  for update to authenticated using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());
create policy "admins delete site images" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());

-- ---------- demo products (sample prices, all flagged is_demo) ----------
insert into public.products
  (slug, name, category, short_description, description, price, is_demo, featured, images, sort_order)
values
  ('turned-baluster', 'Turned Baluster', 'balusters',
   'A classic turned concrete baluster for balconies, verandas and staircases.',
   E'A turned concrete baluster for balustrades on balconies, verandas, staircases and terraces.\n\nAsk us about sizes, quantities and finishing for your project.',
   95.00, true, true,
   '[{"url":"/placeholders/baluster-studio.webp","alt":"A turned concrete baluster standing upright in a studio","illustrative":true}]'::jsonb, 10),
  ('classic-column', 'Classic Column', 'columns',
   'A concrete column for entrances, verandas and porches.',
   E'A concrete column for entrances, verandas and porches.\n\nAsk us about sizes and quantities for your project.',
   1850.00, true, true, '[]'::jsonb, 20),
  ('garden-flower-pot', 'Garden Flower Pot', 'flower-pots',
   'A concrete flower pot for gardens, entrances and outdoor spaces.',
   E'A concrete flower pot for gardens, entrances, verandas and other outdoor spaces.\n\nAsk us about sizes and quantities.',
   650.00, true, true, '[]'::jsonb, 30),
  ('window-surround', 'Window Surround', 'window-moulds',
   'A decorative concrete moulding to frame a window.',
   E'A decorative concrete window moulding that frames a window and adds architectural detail to a facade.\n\nSend us your window sizes and we will quote for your project.',
   null, true, true, '[]'::jsonb, 40),
  ('baluster-mold', 'Baluster Mold', 'molds',
   'A reusable mold for casting concrete balusters.',
   E'A mold for casting concrete balusters.\n\nAsk us about mold designs and availability.',
   1200.00, true, false, '[]'::jsonb, 50),
  ('large-planter', 'Large Planter', 'flower-pots',
   'A large concrete planter for entrances, terraces and landscaping.',
   E'A large concrete planter for entrances, terraces and landscaping.\n\nSend us the size you need and we will quote for your project.',
   null, true, false, '[]'::jsonb, 60);

-- ---------- make the owner an admin (run after creating their user in Authentication > Users) ----------
-- insert into public.admins (user_id) select id from auth.users where email = 'OWNER_EMAIL_HERE';
