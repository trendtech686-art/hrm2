-- Check all orders
SELECT id, "systemId" FROM orders ORDER BY "systemId";

-- Check if ORDER000003 exists
SELECT COUNT(*) as count_order3 FROM orders WHERE "systemId" = 'ORDER000003';
