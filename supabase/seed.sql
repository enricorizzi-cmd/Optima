-- Base org demo
insert into organizations (id, name, slug)
values ('00000000-0000-0000-0000-000000000001', 'Optima Demo', 'optima-demo')
on conflict (id) do nothing;

insert into features (org_id, key, enabled, value)
values
  ('00000000-0000-0000-0000-000000000001', 'notifications', true, '{"channels":["email","push"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'advanced-reports', false, '{}'::jsonb)
on conflict (org_id, key) do nothing;

insert into clients (org_id, name, code, type, category, agent, email, phone)
values
  ('00000000-0000-0000-0000-000000000001', 'Azienda Gamma', 'CLI-001', 'Industry', 'Premium', 'Agente Nord', 'gamma@example.com', '+39 0123 456789'),
  ('00000000-0000-0000-0000-000000000001', 'Distribuzione Delta', 'CLI-002', 'Retail', 'Standard', 'Agente Centro', 'delta@example.com', '+39 0456 789123')
on conflict do nothing;

insert into suppliers (org_id, name, code, type, category, email, phone, payment_terms)
values
  ('00000000-0000-0000-0000-000000000001', 'Materie Prime Srl', 'FOR-001', 'Materie prime', 'Classe A', 'fornitori@example.com', '+39 0987 654321', '30 gg fm'),
  ('00000000-0000-0000-0000-000000000001', 'Packaging Italia', 'FOR-002', 'Packaging', 'Classe B', 'pack@example.com', '+39 0312 987654', '60 gg fm')
on conflict do nothing;

insert into raw_materials (org_id, name, code, class, "group", type, unit_of_measure, last_purchase_price, distributors)
values
  ('00000000-0000-0000-0000-000000000001', 'Granulato ABS', 'RM-ABS', 'Polimeri', 'Plastica', 'Granulo', 'kg', 2.45, array['Materie Prime Srl']),
  ('00000000-0000-0000-0000-000000000001', 'Lamiera Zincata', 'RM-LAM', 'Metalli', 'Lamiere', 'Foglio', 'kg', 1.85, array['Distribuzione Metalli'])
on conflict do nothing;

insert into finished_products (org_id, name, code, class, "group", type, unit_of_measure)
values
  ('00000000-0000-0000-0000-000000000001', 'Scocca GamePad', 'PF-001', 'Elettronica', 'Gaming', 'Semi-lavorato', 'pz'),
  ('00000000-0000-0000-0000-000000000001', 'Controller Neon', 'PF-002', 'Elettronica', 'Gaming', 'Prodotto finito', 'pz')
on conflict do nothing;

insert into warehouses (org_id, code, name, site, line)
values
  ('00000000-0000-0000-0000-000000000001', 'MAG-01', 'Magazzino Principale', 'HQ Milano', 'Linea A'),
  ('00000000-0000-0000-0000-000000000001', 'MAG-02', 'Magazzino Finitura', 'HQ Milano', 'Linea B')
on conflict do nothing;

insert into operators (org_id, first_name, last_name, email, warehouse_id)
select '00000000-0000-0000-0000-000000000001', 'Luca', 'Bianchi', 'luca.bianchi@example.com', id from warehouses where code = 'MAG-01'
on conflict (org_id, email) do nothing;

insert into inventory_items (org_id, item_id, item_type, warehouse_id, quantity, unit_of_measure)
select '00000000-0000-0000-0000-000000000001', id, 'finished_product', (select id from warehouses where code = 'MAG-02'), 120, 'pz'
from finished_products
where code = 'PF-002'
on conflict do nothing;
