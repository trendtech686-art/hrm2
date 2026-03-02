-- Check order_line_items
SELECT "systemId", "orderId" FROM order_line_items ORDER BY "systemId" DESC LIMIT 10;

-- Check packagings  
SELECT "systemId", id, "orderId" FROM packagings ORDER BY "systemId" DESC LIMIT 10;

-- Check if OLI000003 exists
SELECT * FROM order_line_items WHERE "systemId" LIKE 'OLI000003%';

-- Check if PACKAGE000008 exists
SELECT * FROM packagings WHERE "systemId" LIKE 'PACKAGE00000%';
