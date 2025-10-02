-- Create customer_orders_view if it doesn't exist
-- This view is needed by the orders API endpoint

CREATE OR REPLACE VIEW customer_orders_view AS
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

