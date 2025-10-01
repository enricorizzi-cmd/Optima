-- Enable RLS
alter table profiles enable row level security;
alter table features enable row level security;
alter table clients enable row level security;
alter table suppliers enable row level security;
alter table raw_materials enable row level security;
alter table finished_products enable row level security;
alter table warehouses enable row level security;
alter table operators enable row level security;
alter table inventory_items enable row level security;
alter table customer_orders enable row level security;
alter table customer_order_lines enable row level security;
alter table production_schedules enable row level security;
alter table production_progress_logs enable row level security;
alter table deliveries enable row level security;
alter table push_subscriptions enable row level security;

-- Helper macros
create policy "Select own org profiles" on profiles
  for select using (org_id = current_org_id());
create policy "Update profile self or owner" on profiles
  for update using (
    org_id = current_org_id()
    and (user_id = auth.uid() or current_org_role() in ('owner', 'admin'))
  )
  with check (
    org_id = current_org_id()
    and current_org_role() in ('owner', 'admin')
  );

create policy "Select features" on features
  for select using (org_id = current_org_id());
create policy "Manage features" on features
  for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin'))
  with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin'));

create policy "Select base tables" on clients
  for select using (org_id = current_org_id());
create policy "Insert base tables" on clients
  for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));
create policy "Update base tables" on clients
  for update using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'))
  with check (org_id = current_org_id());
create policy "Delete base tables" on clients
  for delete using (org_id = current_org_id() and current_org_role() in ('owner', 'admin'));

-- Reuse by copying policies to other tables
create policy "Select suppliers" on suppliers for select using (org_id = current_org_id());
create policy "Insert suppliers" on suppliers for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));
create policy "Update suppliers" on suppliers for update using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());
create policy "Delete suppliers" on suppliers for delete using (org_id = current_org_id() and current_org_role() in ('owner', 'admin'));

create policy "Select raw materials" on raw_materials for select using (org_id = current_org_id());
create policy "Insert raw materials" on raw_materials for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));
create policy "Update raw materials" on raw_materials for update using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());
create policy "Delete raw materials" on raw_materials for delete using (org_id = current_org_id() and current_org_role() in ('owner', 'admin'));

create policy "Select finished products" on finished_products for select using (org_id = current_org_id());
create policy "Manage finished products" on finished_products for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select warehouses" on warehouses for select using (org_id = current_org_id());
create policy "Manage warehouses" on warehouses for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select operators" on operators for select using (org_id = current_org_id());
create policy "Manage operators" on operators for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select inventory" on inventory_items for select using (org_id = current_org_id());
create policy "Upsert inventory" on inventory_items for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));
create policy "Update inventory" on inventory_items for update using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select orders" on customer_orders for select using (org_id = current_org_id());
create policy "Insert orders" on customer_orders for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));
create policy "Update orders" on customer_orders for update using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());
create policy "Delete orders" on customer_orders for delete using (org_id = current_org_id() and current_org_role() in ('owner', 'admin'));

create policy "Select order lines" on customer_order_lines for select using (
  exists (
    select 1
    from customer_orders co
    where co.id = customer_order_lines.order_id
      and co.org_id = current_org_id()
  )
);
create policy "Manage order lines" on customer_order_lines for all using (
  exists (
    select 1
    from customer_orders co
    where co.id = customer_order_lines.order_id
      and co.org_id = current_org_id()
      and current_org_role() in ('owner', 'admin', 'editor')
  )
) with check (
  exists (
    select 1
    from customer_orders co
    where co.id = customer_order_lines.order_id
      and co.org_id = current_org_id()
      and current_org_role() in ('owner', 'admin', 'editor')
  )
);

create policy "Select schedules" on production_schedules for select using (org_id = current_org_id());
create policy "Manage schedules" on production_schedules for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select progress" on production_progress_logs for select using (org_id = current_org_id());
create policy "Insert progress" on production_progress_logs for insert with check (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor'));

create policy "Select deliveries" on deliveries for select using (org_id = current_org_id());
create policy "Manage deliveries" on deliveries for all using (org_id = current_org_id() and current_org_role() in ('owner', 'admin', 'editor')) with check (org_id = current_org_id());

create policy "Select push subscriptions" on push_subscriptions for select using (org_id = current_org_id() and user_id = auth.uid());
create policy "Manage push subscriptions" on push_subscriptions for all using (org_id = current_org_id() and user_id = auth.uid()) with check (org_id = current_org_id() and user_id = auth.uid());

