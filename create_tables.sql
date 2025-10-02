-- Create missing tables in Supabase
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

-- Create organizations table
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz default now()
);

-- Create profiles table
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

-- Create raw_materials table
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

-- Create finished_products table
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

-- Create warehouses table
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

-- Create operators table
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

-- Create inventory_items table
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

-- Create clients table
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

-- Create suppliers table
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

-- Create customer_orders table
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

-- Create customer_order_lines table
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

-- Insert a default organization
insert into organizations (id, name, slug) 
values ('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default')
on conflict (id) do nothing;

-- Insert sample data
insert into warehouses (id, org_id, code, name, site, line)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'WH001', 'Magazzino Principale', 'Sede Centrale', 'Linea 1'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'WH002', 'Magazzino Secondario', 'Sede Centrale', 'Linea 2')
on conflict (id) do nothing;

insert into operators (id, org_id, first_name, last_name, email, phone, warehouse_id)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Mario', 'Rossi', 'mario.rossi@example.com', '+39 123 456 7890', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Giulia', 'Bianchi', 'giulia.bianchi@example.com', '+39 098 765 4321', '00000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

insert into raw_materials (id, org_id, name, code, class, "group", type, unit_of_measure, last_purchase_price)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Acciaio Inox', 'RM001', 'Metalli', 'Acciai', 'Inox 304', 'kg', 15.50),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Alluminio', 'RM002', 'Metalli', 'Leghe', 'Alluminio 6061', 'kg', 8.75)
on conflict (id) do nothing;

insert into finished_products (id, org_id, name, code, class, "group", type, unit_of_measure)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Prodotto Finito A', 'PF001', 'Prodotti', 'Categoria A', 'Tipo 1', 'pz'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Prodotto Finito B', 'PF002', 'Prodotti', 'Categoria B', 'Tipo 2', 'pz')
on conflict (id) do nothing;

insert into inventory_items (id, org_id, item_id, item_type, warehouse_id, quantity, unit_of_measure)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'raw_material', '00000000-0000-0000-0000-000000000001', 100.000, 'kg'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'raw_material', '00000000-0000-0000-0000-000000000001', 50.000, 'kg'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'finished_product', '00000000-0000-0000-0000-000000000001', 25.000, 'pz'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'finished_product', '00000000-0000-0000-0000-000000000001', 15.000, 'pz')
on conflict (id) do nothing;

insert into suppliers (id, org_id, name, code, agent, type, category, email, phone)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Fornitore A', 'SUP001', 'Agente Fornitore A', 'Azienda', 'Industriale', 'fornitore.a@example.com', '+39 111 333 4444'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Fornitore B', 'SUP002', 'Agente Fornitore B', 'Azienda', 'Commerciale', 'fornitore.b@example.com', '+39 222 444 5555')
on conflict (id) do nothing;

insert into clients (id, org_id, name, code, agent, type, category, email, phone)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Cliente A', 'CL001', 'Agente A', 'Azienda', 'Industriale', 'cliente.a@example.com', '+39 111 222 3333'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Cliente B', 'CL002', 'Agente B', 'Azienda', 'Commerciale', 'cliente.b@example.com', '+39 444 555 6666')
on conflict (id) do nothing;

insert into customer_orders (id, org_id, client_id, code, order_date, due_date, status, priority)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ORD001', '2024-01-15', '2024-02-15', 'confirmed', 'high'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ORD002', '2024-01-20', '2024-02-20', 'draft', 'medium')
on conflict (id) do nothing;

insert into customer_order_lines (id, order_id, product_id, quantity, unit_price, unit_of_measure)
values 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 10.000, 25.00, 'pz'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 5.000, 30.00, 'pz')
on conflict (id) do nothing;
