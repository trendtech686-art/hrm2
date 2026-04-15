import pg from 'pg'
import { config } from 'dotenv'
config()

let connStr = process.env.DATABASE_URL
if (!connStr) { console.error('No DATABASE_URL'); process.exit(1) }
connStr = connStr.replace(/^["']|["']$/g, '')

const pool = new pg.Pool({ connectionString: connStr })

const { rows: logs } = await pool.query(`
  SELECT action, "entityId", "createdBy", "createdAt"
  FROM common."ActivityLog"
  WHERE "entityType" = 'order'
  ORDER BY "createdAt" DESC
  LIMIT 20
`)

console.log('=== Latest 20 order activity logs ===')
for (const r of logs) {
  console.log(`[${r.createdAt.toISOString()}] ${r.entityId} | ${r.action} | by: ${r.createdBy}`)
}

const { rows: ghtkLogs } = await pool.query(`
  SELECT action, "entityId", "createdBy", "createdAt"
  FROM common."ActivityLog"
  WHERE "entityType" = 'order' AND action ILIKE '%ghtk%'
  ORDER BY "createdAt" DESC
  LIMIT 10
`)

console.log('\n=== GHTK-related logs ===')
if (ghtkLogs.length === 0) console.log('No GHTK logs found in DB!')
for (const r of ghtkLogs) {
  console.log(`[${r.createdAt.toISOString()}] ${r.entityId} | ${r.action} | by: ${r.createdBy}`)
}

// Also check for DH000005 specifically
const { rows: dh5Logs } = await pool.query(`
  SELECT action, "entityId", "createdBy", "createdAt", "actionType"
  FROM common."ActivityLog"
  WHERE "entityId" LIKE '%000005%' OR "entityId" LIKE '%DH000005%'
  ORDER BY "createdAt" DESC
  LIMIT 20
`)

console.log('\n=== DH000005 / *000005* logs ===')
if (dh5Logs.length === 0) console.log('No logs found for DH000005!')
for (const r of dh5Logs) {
  console.log(`[${r.createdAt.toISOString()}] ${r.entityId} | ${r.action} | ${r.actionType} | by: ${r.createdBy}`)
}

await pool.end()
