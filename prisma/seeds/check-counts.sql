SELECT 'provinces' AS table_name, COUNT(*) AS count FROM provinces
UNION ALL
SELECT 'districts' AS table_name, COUNT(*) AS count FROM districts
UNION ALL
SELECT 'wards' AS table_name, COUNT(*) AS count FROM wards;
