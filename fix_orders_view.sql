-- Fix customer_orders_view
-- This script creates the missing view that causes the 500 error

-- Drop the view if it exists
DROP VIEW IF EXISTS customer_orders_view;

-- Create the customer_orders_view
CREATE VIEW customer_orders_view AS
SELECT
  o.*,
  COALESCE(json_agg(
    json_build_object(
      'id', l.id,
      'product_id', l.product_id,
      'quantity', l.quantity,
      'unit_price', l.unit_price,
      'unit_of_measure', l.unit_of_measure,
      'created_at', l.created_at,
      'updated_at', l.updated_at
    )
  ) FILTER (WHERE l.id IS NOT NULL), '[]'::json) AS lines
FROM customer_orders o
LEFT JOIN customer_order_lines l ON l.order_id = o.id
GROUP BY o.id;







