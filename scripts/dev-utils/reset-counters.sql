-- Reset orders and packaging counters so they can be re-initialized from actual data
DELETE FROM id_counters WHERE "entityType" IN ('orders', 'packaging', 'shipments');

-- Verify
SELECT * FROM id_counters;
