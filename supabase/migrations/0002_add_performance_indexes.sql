-- Add performance indexes for frequently queried columns
-- This migration adds indexes to improve query performance

-- Indexes for customer orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_orders_org_status 
ON customer_orders(org_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_orders_org_due_date 
ON customer_orders(org_id, due_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_orders_org_created_at 
ON customer_orders(org_id, created_at DESC);

-- Indexes for production schedules
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_schedules_org_status 
ON production_schedules(org_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_schedules_org_scheduled_start 
ON production_schedules(org_id, scheduled_start);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_schedules_org_created_at 
ON production_schedules(org_id, created_at DESC);

-- Indexes for deliveries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_org_status 
ON deliveries(org_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_org_delivery_date 
ON deliveries(org_id, delivery_date);

-- Indexes for inventory items
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_items_org_item_type 
ON inventory_items(org_id, item_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_items_org_warehouse 
ON inventory_items(org_id, warehouse_id);

-- Indexes for catalog tables (frequently accessed)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_org_code 
ON clients(org_id, code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_suppliers_org_code 
ON suppliers(org_id, code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_raw_materials_org_code 
ON raw_materials(org_id, code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_finished_products_org_code 
ON finished_products(org_id, code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_warehouses_org_code 
ON warehouses(org_id, code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_operators_org_email 
ON operators(org_id, email);

-- Indexes for production progress logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_progress_logs_org_schedule 
ON production_progress_logs(org_id, schedule_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_progress_logs_org_recorded_at 
ON production_progress_logs(org_id, recorded_at DESC);

-- Indexes for push subscriptions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_push_subscriptions_org_user 
ON push_subscriptions(org_id, user_id);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_orders_org_client_status 
ON customer_orders(org_id, client_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_production_schedules_org_order_status 
ON production_schedules(org_id, order_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_org_order_status 
ON deliveries(org_id, order_id, status);

