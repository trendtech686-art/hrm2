/**
 * Meilisearch Sync Script
 * 
 * Run: npx tsx scripts/meilisearch-sync.ts
 * 
 * Options:
 *   --full     Full sync all indexes
 *   --products Sync products only
 *   --customers Sync customers only
 *   --orders   Sync orders only
 *   --employees Sync employees only
 */

import { fullSync, syncProducts, syncCustomers, syncOrders, syncEmployees } from '@/lib/meilisearch-sync'
import { healthCheck, getStats } from '@/lib/meilisearch'

async function main() {
  console.log('🔍 Meilisearch Sync Tool\n')
  
  // Check connection
  console.log('Checking Meilisearch connection...')
  const isHealthy = await healthCheck()
  
  if (!isHealthy) {
    console.error('❌ Cannot connect to Meilisearch!')
    console.error('   Make sure Meilisearch is running:')
    console.error('   docker-compose up -d meilisearch')
    process.exit(1)
  }
  
  console.log('✅ Meilisearch connected\n')
  
  // Parse args
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--full')) {
    await fullSync()
  } else {
    if (args.includes('--products')) {
      await syncProducts({ fullSync: true })
    }
    if (args.includes('--customers')) {
      await syncCustomers()
    }
    if (args.includes('--orders')) {
      await syncOrders()
    }
    if (args.includes('--employees')) {
      await syncEmployees()
    }
  }
  
  // Show stats
  console.log('\n📊 Index Statistics:')
  const stats = await getStats()
  console.log(JSON.stringify(stats, null, 2))
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
