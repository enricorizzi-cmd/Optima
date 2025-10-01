-- Enable extensions required for UUID generation
create extension if not exists "pgcrypto";

-- Generic trigger to maintain updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.current_org_id()
returns uuid as $$
  select coalesce(nullif(current_setting(''request.jwt.claims'', true), '')::json->>'org_id', '')::uuid;
$$ language sql stable;

create or replace function public.current_org_role()
returns text as $$
  select coalesce(nullif(current_setting(''request.jwt.claims'', true), '')::json->>'role', 'viewer');
$$ language sql stable;
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  org_id uuid not null references organizations (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists profiles_user_id_idx on profiles (user_id);
create index if not exists profiles_org_idx on profiles (org_id);
create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();

create table if not exists features (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  key text not null,
  enabled boolean not null default false,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, key)
);
create trigger trg_features_updated_at before update on features for each row execute function set_updated_at();

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  code text not null,
  agent text,
  type text not null,
  category text not null,
  email text,
  phone text,
  notes text,
  vat_number text,
  address text,
  city text,
  country text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_clients_updated_at before update on clients for each row execute function set_updated_at();

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  code text not null,
  agent text,
  type text not null,
  category text not null,
  email text,
  phone text,
  notes text,
  vat_number text,
  address text,
  city text,
  country text,
  payment_terms text,
  shipping_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_suppliers_updated_at before update on suppliers for each row execute function set_updated_at();

create table if not exists raw_materials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  code text not null,
  class text not null,
  "group" text not null,
  type text not null,
  unit_of_measure text not null,
  last_purchase_price numeric(12,2) default 0,
  distributors text[] default '{}',
  default_supplier_id uuid references suppliers (id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_raw_materials_updated_at before update on raw_materials for each row execute function set_updated_at();

create table if not exists finished_products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  code text not null,
  class text not null,
  "group" text not null,
  type text not null,
  unit_of_measure text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_finished_products_updated_at before update on finished_products for each row execute function set_updated_at();

create table if not exists warehouses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  code text not null,
  name text not null,
  site text not null,
  line text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_warehouses_updated_at before update on warehouses for each row execute function set_updated_at();

create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  warehouse_id uuid references warehouses (id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, email)
);
create trigger trg_operators_updated_at before update on operators for each row execute function set_updated_at();

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  item_id uuid not null,
  item_type text not null check (item_type in ('raw_material', 'finished_product')),
  warehouse_id uuid not null references warehouses (id) on delete cascade,
  quantity numeric(14,3) not null default 0,
  unit_of_measure text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, item_id, item_type, warehouse_id)
);
create trigger trg_inventory_items_updated_at before update on inventory_items for each row execute function set_updated_at();

create table if not exists customer_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  client_id uuid not null references clients (id),
  code text not null,
  order_date date not null,
  due_date date not null,
  status text not null check (status in ('draft', 'confirmed', 'in_production', 'fulfilled', 'cancelled')),
  priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, code)
);
create trigger trg_customer_orders_updated_at before update on customer_orders for each row execute function set_updated_at();

create table if not exists customer_order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references customer_orders (id) on delete cascade,
  product_id uuid not null references finished_products (id),
  quantity numeric(14,3) not null,
  unit_price numeric(12,2) not null default 0,
  unit_of_measure text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_customer_order_lines_updated_at before update on customer_order_lines for each row execute function set_updated_at();

create table if not exists production_schedules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  order_id uuid not null references customer_orders (id) on delete cascade,
  order_line_id uuid not null references customer_order_lines (id) on delete cascade,
  planned_quantity numeric(14,3) not null,
  production_line text not null,
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status text not null check (status in ('planned', 'in_progress', 'completed', 'stocked')) default 'planned',
  operator_id uuid references operators (id),
  warehouse_id uuid references warehouses (id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_production_schedules_updated_at before update on production_schedules for each row execute function set_updated_at();

create table if not exists production_progress_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  schedule_id uuid not null references production_schedules (id) on delete cascade,
  status text not null check (status in ('planned', 'in_progress', 'completed', 'stocked')),
  quantity_completed numeric(14,3) not null default 0,
  notes text,
  recorded_by text not null,
  recorded_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_production_progress_logs_updated_at before update on production_progress_logs for each row execute function set_updated_at();

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  order_id uuid not null references customer_orders (id) on delete cascade,
  schedule_id uuid not null references production_schedules (id) on delete cascade,
  warehouse_id uuid not null references warehouses (id) on delete cascade,
  status text not null check (status in ('pending', 'prepared', 'shipped', 'delivered')) default 'pending',
  delivery_date date,
  transporter text,
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_deliveries_updated_at before update on deliveries for each row execute function set_updated_at();

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, user_id, endpoint)
);
create trigger trg_push_subscriptions_updated_at before update on push_subscriptions for each row execute function set_updated_at();

create view customer_orders_view as
select
  o.*,
  coalesce(json_agg(
    json_build_object(
      'id', l.id,
      'product_id', l.product_id,
      'quantity', l.quantity,
      'unit_price', l.unit_price,
      'unit_of_measure', l.unit_of_measure,
      'created_at', l.created_at,
      'updated_at', l.updated_at
    )
  ) filter (where l.id is not null), '[]'::json) as lines
from customer_orders o
left join customer_order_lines l on l.order_id = o.id
group by o.id;


