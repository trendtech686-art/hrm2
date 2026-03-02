-- Check orders
SELECT id, "systemId" FROM orders ORDER BY "systemId";

-- Check counter
SELECT * FROM id_counters WHERE "entityType" = 'orders';

-- Fix: Update counter to be higher than max existing
UPDATE id_counters 
SET "currentValue" = (
  SELECT COALESCE(MAX(CAST(SUBSTRING("systemId" FROM 6) AS INTEGER)), 0) 
  FROM orders 
  WHERE "systemId" LIKE 'ORDER%'
)
WHERE "entityType" = 'orders';

-- Show updated counter
SELECT * FROM id_counters WHERE "entityType" = 'orders';
