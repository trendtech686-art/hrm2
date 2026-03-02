@echo off
set DATABASE_URL=postgresql://erp_user:erp_password@localhost:5433/erp_db?schema=public
npx tsx cleanup-order-history.ts
pause
