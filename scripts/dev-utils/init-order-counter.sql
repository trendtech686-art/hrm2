-- Initialize orders counter from existing data
INSERT INTO id_counters ("systemId", "entityType", prefix, "currentValue", padding, "updatedAt", "businessPrefix", "systemPrefix")
SELECT 
  gen_random_uuid(), 
  'orders', 
  'DH', 
  COALESCE(MAX(CAST(SUBSTRING("systemId" FROM 6) AS INTEGER)), 0), 
  6, 
  NOW(), 
  'DH', 
  'ORDER'
FROM orders 
WHERE "systemId" LIKE 'ORDER%'
ON CONFLICT ("entityType") DO NOTHING;

-- Initialize packaging counter from existing data
INSERT INTO id_counters ("systemId", "entityType", prefix, "currentValue", padding, "updatedAt", "businessPrefix", "systemPrefix")
SELECT 
  gen_random_uuid(), 
  'packaging', 
  'DG', 
  COALESCE(MAX(CAST(SUBSTRING("systemId" FROM 8) AS INTEGER)), 0), 
  6, 
  NOW(), 
  'DG', 
  'PACKAGE'
FROM packagings 
WHERE "systemId" LIKE 'PACKAGE%'
ON CONFLICT ("entityType") DO NOTHING;

-- Show result
SELECT * FROM id_counters WHERE "entityType" IN ('orders', 'packaging');
