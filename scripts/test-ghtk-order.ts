/**
 * Test GHTK Create Order API directly
 * Usage: npx tsx scripts/test-ghtk-order.ts
 */
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const { Pool } = pg

async function main() {
  let connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env.local')
    process.exit(1)
  }
  connectionString = connectionString.replace(/^["']|["']$/g, '')

  const pool = new Pool({ connectionString })

  // 1. Get GHTK config from database
  const result = await pool.query(
    `SELECT value FROM "settings" WHERE key = 'shipping_partners_config' AND "group" = 'shipping'`
  )

  if (!result.rows[0]?.value) {
    console.error('No shipping config found')
    process.exit(1)
  }

  const config = result.rows[0].value as Record<string, unknown>
  const ghtkPartner = (config.partners as Record<string, unknown>)?.GHTK as {
    accounts?: Array<{
      active?: boolean
      isDefault?: boolean
      credentials?: { apiToken?: string; partnerCode?: string }
    }>
  } | undefined

  const activeAccount = ghtkPartner?.accounts?.find(acc => acc.active && acc.isDefault)
    || ghtkPartner?.accounts?.find(acc => acc.active)

  const apiToken = activeAccount?.credentials?.apiToken
  const partnerCode = activeAccount?.credentials?.partnerCode || ''

  if (!apiToken) {
    console.error('No GHTK API token found')
    process.exit(1)
  }

  console.log('✅ Found GHTK config:', { partnerCode, tokenLength: apiToken.length })

  // 2. Build test payload - simulating a BBS (heavy) order with dimensions
  const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn'

  // First: list pick addresses to get a valid pickup address
  console.log('\n📋 Listing pick addresses...')
  const pickAddressRes = await fetch(`${GHTK_API_BASE}/services/shipment/list_pick_add`, {
    headers: {
      'Token': apiToken,
      'X-Client-Source': partnerCode,
    }
  })
  const pickAddressData = await pickAddressRes.json()
  console.log('Pick addresses:', JSON.stringify(pickAddressData, null, 2).substring(0, 500))

  const pickAddress = pickAddressData?.data?.[0]
  if (!pickAddress) {
    console.error('No pick address found')
    process.exit(1)
  }

  console.log('\n✅ Using pick address:', pickAddress.pick_address_id, '-', pickAddress.address)

  // ====================================================
  // Test 1: ORDER-level dimensions ONLY (no product-level)
  // ====================================================
  console.log('\n========================================')
  console.log('🔄 Test 1: ORDER-level dimensions ONLY')
  console.log('========================================')

  const baseOrder = {
    pick_address_id: pickAddress.pick_address_id,
    pick_name: pickAddress.pick_name || 'Test Sender',
    pick_address: pickAddress.address || '',
    pick_province: 'Hà Nội',
    pick_district: 'Huyện Gia Lâm',
    pick_ward: 'Xã Bát Tràng',
    pick_tel: pickAddress.pick_tel || '0123456789',
    name: 'Test Customer BBS',
    address: '123 Nguyễn Huệ',
    province: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    street: 'Nguyễn Huệ',
    hamlet: 'Khác',
    tel: '0987654321',
    is_freeship: 1,
    pick_money: 0,
    value: 500000,
    note: 'Test BBS - DO NOT PROCESS',
    transport: 'road',
    pick_option: 'cod',
    tags: [],
  }

  const test1 = {
    products: [{ name: 'SP Test 40kg', weight: 40.0, quantity: 1, product_code: 'T1', price: 500000 }],
    order: {
      ...baseOrder,
      id: `T1-ORDER-${Date.now()}`,
      total_weight: 40.0,
      height: 30, width: 20, length: 10, // ORDER-level only
    }
  }

  console.log('Payload:')
  console.log('  products[0] dims:', 'NONE')
  console.log('  order dims:', 'height=30, width=20, length=10')
  
  const r1 = await fetch(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
    method: 'POST',
    headers: { 'Token': apiToken, 'X-Client-Source': partnerCode, 'Content-Type': 'application/json' },
    body: JSON.stringify(test1),
  })
  const d1 = await r1.json()
  console.log('Result:', d1.success ? '✅ SUCCESS' : `❌ FAIL: ${d1.message}`)
  if (d1.success && d1.order?.label) {
    console.log('  Label:', d1.order.label, 'Fee:', d1.order.fee)
    await fetch(`${GHTK_API_BASE}/services/shipment/cancel/${d1.order.label}`, {
      method: 'POST', headers: { 'Token': apiToken, 'X-Client-Source': partnerCode }
    })
    console.log('  → Cancelled')
  }

  // ====================================================
  // Test 2: PRODUCT-level dimensions ONLY (no order-level)
  // ====================================================
  console.log('\n========================================')
  console.log('🔄 Test 2: PRODUCT-level dimensions ONLY')
  console.log('========================================')

  const test2 = {
    products: [{ name: 'SP Test 40kg', weight: 40.0, quantity: 1, product_code: 'T2', price: 500000,
      height: 30, width: 20, length: 10 }],
    order: {
      ...baseOrder,
      id: `T2-PROD-${Date.now()}`,
      total_weight: 40.0,
      // NO order-level dimensions
    }
  }

  console.log('Payload:')
  console.log('  products[0] dims:', 'height=30, width=20, length=10')
  console.log('  order dims:', 'NONE')

  const r2 = await fetch(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
    method: 'POST',
    headers: { 'Token': apiToken, 'X-Client-Source': partnerCode, 'Content-Type': 'application/json' },
    body: JSON.stringify(test2),
  })
  const d2 = await r2.json()
  console.log('Result:', d2.success ? '✅ SUCCESS' : `❌ FAIL: ${d2.message}`)
  if (d2.success && d2.order?.label) {
    console.log('  Label:', d2.order.label, 'Fee:', d2.order.fee)
    await fetch(`${GHTK_API_BASE}/services/shipment/cancel/${d2.order.label}`, {
      method: 'POST', headers: { 'Token': apiToken, 'X-Client-Source': partnerCode }
    })
    console.log('  → Cancelled')
  }

  // ====================================================
  // Test 3: NO dimensions at all
  // ====================================================
  console.log('\n========================================')
  console.log('🔄 Test 3: NO dimensions')
  console.log('========================================')

  const test3 = {
    products: [{ name: 'SP Test 40kg', weight: 40.0, quantity: 1, product_code: 'T3', price: 500000 }],
    order: {
      ...baseOrder,
      id: `T3-NONE-${Date.now()}`,
      total_weight: 40.0,
    }
  }

  const r3 = await fetch(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
    method: 'POST',
    headers: { 'Token': apiToken, 'X-Client-Source': partnerCode, 'Content-Type': 'application/json' },
    body: JSON.stringify(test3),
  })
  const d3 = await r3.json()
  console.log('Result:', d3.success ? '✅ SUCCESS' : `❌ FAIL: ${d3.message}`)
  if (d3.success && d3.order?.label) {
    console.log('  Label:', d3.order.label, 'Fee:', d3.order.fee)
    await fetch(`${GHTK_API_BASE}/services/shipment/cancel/${d3.order.label}`, {
      method: 'POST', headers: { 'Token': apiToken, 'X-Client-Source': partnerCode }
    })
    console.log('  → Cancelled')
  }

  await pool.end()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
