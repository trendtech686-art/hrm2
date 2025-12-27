INSERT INTO users ("systemId", email, password, role, "isActive", "createdAt", "updatedAt") 
VALUES 
('USR-001', 'admin@erp.local', '$2b$10$5EOyJT2NVMqKtVgT6qoeCOwY6cWesyf1SfcMBZ4FH7jXYR8LBXNf2', 'ADMIN', true, NOW(), NOW()),
('USR-002', 'sales@erp.local', '$2b$10$5EOyJT2NVMqKtVgT6qoeCOwY6cWesyf1SfcMBZ4FH7jXYR8LBXNf2', 'MANAGER', true, NOW(), NOW())
ON CONFLICT ("systemId") DO NOTHING;
