-- Add suppliers table and update raw_materials foreign key
-- This migration adds the missing suppliers table to match the initial design requirements

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  agent text,
  type text NOT NULL,
  category text NOT NULL,
  email text,
  phone text,
  notes text,
  vat_number text,
  address text,
  city text,
  country text,
  payment_terms text,
  shipping_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (org_id, code)
);

-- Add trigger for suppliers
CREATE TRIGGER trg_suppliers_updated_at 
  BEFORE UPDATE ON suppliers 
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Update raw_materials to reference suppliers properly
-- First, drop the existing constraint if it exists
ALTER TABLE raw_materials 
  DROP CONSTRAINT IF EXISTS raw_materials_default_supplier_id_fkey;

-- Add the proper foreign key constraint
ALTER TABLE raw_materials 
  ADD CONSTRAINT fk_raw_materials_default_supplier 
  FOREIGN KEY (default_supplier_id) REFERENCES suppliers (id);

-- Insert sample suppliers data
INSERT INTO suppliers (id, org_id, name, code, agent, type, category, email, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Fornitore A', 'SUP001', 'Agente Fornitore A', 'Azienda', 'Industriale', 'fornitore.a@example.com', '+39 111 333 4444'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Fornitore B', 'SUP002', 'Agente Fornitore B', 'Azienda', 'Commerciale', 'fornitore.b@example.com', '+39 222 444 5555')
ON CONFLICT (id) DO NOTHING;

