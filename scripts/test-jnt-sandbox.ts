/**
 * Script test kết nối J&T Express Sandbox
 * 
 * Chạy: npx tsx scripts/test-jnt-sandbox.ts
 * 
 * TRƯỚC KHI CHẠY, điền thông tin sandbox vào phần CONFIG bên dưới.
 * Lấy thông tin từ J&T developer dashboard: https://developer.jet.co.id/
 */

import crypto from 'crypto'

// ============ CONFIG - ĐIỀN THÔNG TIN SANDBOX TẠI ĐÂY ============
const CONFIG = {
  username: '',        // Username từ dashboard
  api_key: '',         // API Key từ dashboard
  key: '',             // Signing key (dùng tạo chữ ký MD5+Base64)
  eccompanyid: '',     // EC Company ID (cho tracking)
  
  // URLs - lấy từ dashboard
  orderUrl: '',        // Order API URL (e.g. https://xxx.jtexpress.vn/order)
  tariffUrl: '',       // Tariff Check URL (nếu có, hoặc sẽ derive từ orderUrl)
  trackingUrl: '',     // Tracking API URL
  trackingPassword: '',// Password cho Basic Auth tracking
}
// ===================================================================

/** Tạo chữ ký J&T: base64(md5(data + key)) */
function createSignature(data: string, key: string): string {
  return Buffer.from(
    crypto.createHash('md5').update(data + key).digest('hex')
  ).toString('base64')
}

/** Test 1: Tariff Check - kiểm tra credentials */
async function testTariffCheck() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 1: TARIFF CHECK (Kiểm tra cước)')
  console.log('='.repeat(60))
  
  const tariffUrl = CONFIG.tariffUrl || CONFIG.orderUrl.replace(/\/order\/?$/, '/tariff')
  console.log('URL:', tariffUrl)
  
  const data = JSON.stringify({
    weight: '1',
    sendSiteCode: 'HOCHIMINH',
    destAreaCode: 'HANOI',
    cusName: CONFIG.username,
    productType: 'EZ',
  })
  
  const sign = createSignature(data, CONFIG.key)
  
  console.log('data:', data)
  console.log('sign:', sign)
  
  const formData = new URLSearchParams()
  formData.append('data', data)
  formData.append('sign', sign)
  
  try {
    const response = await fetch(tariffUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    
    const status = response.status
    const text = await response.text()
    console.log(`\nHTTP ${status}`)
    console.log('Response:', text)
    
    try {
      const json = JSON.parse(text)
      if (json.is_success === 'true' || json.is_success === true) {
        console.log('✅ TARIFF CHECK: THÀNH CÔNG!')
        if (json.content) {
          const content = typeof json.content === 'string' ? JSON.parse(json.content) : json.content
          console.log('Cước phí:', JSON.stringify(content, null, 2))
        }
      } else {
        console.log('❌ TARIFF CHECK: THẤT BẠI -', json.message || json.desc)
      }
    } catch {
      console.log('⚠️ Response không phải JSON hợp lệ')
    }
  } catch (err) {
    console.error('❌ TARIFF CHECK ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 2: Create Order (sandbox) */
async function testCreateOrder() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 2: CREATE ORDER (Tạo đơn sandbox)')
  console.log('='.repeat(60))
  
  const now = new Date()
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19)
  const orderId = `TEST-HRM2-${Date.now()}`
  
  const orderData = {
    username: CONFIG.username,
    api_key: CONFIG.api_key,
    orderid: orderId,
    shipper_name: 'SHOP TEST',
    shipper_contact: 'SHOP TEST',
    shipper_phone: '+84901234567',
    shipper_addr: '123 Nguyen Van Linh, Quan 7, TP HCM',
    origin_code: 'SGN',      // Có thể cần thay đổi theo mã J&T Vietnam
    receiver_name: 'KHACH HANG TEST',
    receiver_phone: '+84987654321',
    receiver_addr: '456 Tran Hung Dao, Quan 1, TP HCM',
    receiver_zip: '70000',
    destination_code: 'SGN',  // Có thể cần thay đổi
    receiver_area: 'SGN001',  // Có thể cần thay đổi  
    qty: '1',
    weight: '0.5',
    goodsdesc: 'Hang test sandbox',
    servicetype: '1',        // 1 = Pickup, 6 = Drop off
    insurance: '0',
    orderdate: dateStr,
    item_name: 'San pham test',
    cod: '0',
    sendstarttime: dateStr,
    sendendtime: dateStr,
    expresstype: '1',        // 1 = EZ (Regular)
    goodsvalue: '100000',
  }
  
  const dataParam = JSON.stringify({ detail: [orderData] })
  const dataSign = createSignature(dataParam, CONFIG.key)
  
  console.log('URL:', CONFIG.orderUrl)
  console.log('Order ID:', orderId)
  console.log('data_param length:', dataParam.length)
  
  const formData = new URLSearchParams()
  formData.append('data_param', dataParam)
  formData.append('data_sign', dataSign)
  
  try {
    const response = await fetch(CONFIG.orderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    
    const status = response.status
    const text = await response.text()
    console.log(`\nHTTP ${status}`)
    console.log('Response:', text)
    
    try {
      const json = JSON.parse(text)
      if (json.success === true) {
        const detail = json.detail?.[0]
        if (detail?.status === 'Sukses') {
          console.log('✅ CREATE ORDER: THÀNH CÔNG!')
          console.log('AWB Number:', detail.awb_no)
          console.log('Order ID:', detail.orderid)
          console.log('ETD:', detail.etd)
          return detail.awb_no // Trả về để test tracking
        } else {
          console.log('❌ CREATE ORDER: LỖI -', detail?.reason || 'Unknown')
        }
      } else {
        console.log('❌ CREATE ORDER: THẤT BẠI -', json.desc || json.message)
      }
    } catch {
      console.log('⚠️ Response không phải JSON hợp lệ')
    }
  } catch (err) {
    console.error('❌ CREATE ORDER ERROR:', err instanceof Error ? err.message : err)
  }
  return null
}

/** Test 3: Tracking */
async function testTracking(awbNo: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 3: TRACKING (Theo dõi đơn)')
  console.log('='.repeat(60))

  if (!CONFIG.trackingUrl || !CONFIG.eccompanyid) {
    console.log('⚠️ SKIP: Chưa có trackingUrl hoặc eccompanyid')
    return
  }
  
  const trackData = JSON.stringify({
    awb: awbNo,
    eccompanyid: CONFIG.eccompanyid,
  })
  
  const password = CONFIG.trackingPassword || CONFIG.key
  const basicAuth = Buffer.from(`${CONFIG.eccompanyid}:${password}`).toString('base64')
  
  console.log('URL:', CONFIG.trackingUrl)
  console.log('AWB:', awbNo)
  
  try {
    const response = await fetch(CONFIG.trackingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: trackData,
    })
    
    const status = response.status
    const text = await response.text()
    console.log(`\nHTTP ${status}`)
    
    try {
      const json = JSON.parse(text)
      console.log('Response:', JSON.stringify(json, null, 2))
      
      if (json.awb || json.history) {
        console.log('✅ TRACKING: THÀNH CÔNG!')
        if (json.history?.length) {
          console.log(`Lịch sử: ${json.history.length} events`)
        }
      } else if (json.error_id) {
        console.log('❌ TRACKING: LỖI -', json.error_message)
      }
    } catch {
      console.log('Response raw:', text)
    }
  } catch (err) {
    console.error('❌ TRACKING ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 4: Cancel Order */
async function testCancelOrder(orderId: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 4: CANCEL ORDER (Hủy đơn)')
  console.log('='.repeat(60))
  
  const cancelUrl = CONFIG.orderUrl.replace(/\/order\/?$/, '/cancel')
  
  const cancelData = {
    username: CONFIG.username,
    api_key: CONFIG.api_key,
    orderid: orderId,
    remark: 'Test cancel from HRM2',
  }
  
  const dataParam = JSON.stringify({ detail: [cancelData] })
  const dataSign = createSignature(dataParam, CONFIG.key)
  
  const formData = new URLSearchParams()
  formData.append('data_param', dataParam)
  formData.append('data_sign', dataSign)
  
  console.log('URL:', cancelUrl)
  console.log('Order ID:', orderId)
  
  try {
    const response = await fetch(cancelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    
    const status = response.status
    const text = await response.text()
    console.log(`\nHTTP ${status}`)
    console.log('Response:', text)
    
    try {
      const json = JSON.parse(text)
      if (json.success === true) {
        const detail = json.detail?.[0]
        if (detail?.status === 'Sukses') {
          console.log('✅ CANCEL ORDER: THÀNH CÔNG!')
        } else {
          console.log('❌ CANCEL: LỖI -', detail?.reason || 'Unknown')
        }
      }
    } catch {
      console.log('⚠️ Response không phải JSON hợp lệ')
    }
  } catch (err) {
    console.error('❌ CANCEL ORDER ERROR:', err instanceof Error ? err.message : err)
  }
}

// ============ MAIN ============
async function main() {
  console.log('🚀 J&T Express Sandbox Test')
  console.log('Thời gian:', new Date().toLocaleString('vi-VN'))
  
  // Kiểm tra config
  if (!CONFIG.username || !CONFIG.api_key || !CONFIG.key) {
    console.error('\n❌ CHƯA ĐIỀN THÔNG TIN!')
    console.error('Mở file scripts/test-jnt-sandbox.ts và điền thông tin vào phần CONFIG.')
    console.error('\nThông tin cần lấy từ J&T developer dashboard:')
    console.error('  1. username     - Username')
    console.error('  2. api_key      - API Key')
    console.error('  3. key          - Signing key (dùng tạo chữ ký)')
    console.error('  4. eccompanyid  - EC Company ID (cho tracking)')
    console.error('  5. orderUrl     - Order API endpoint URL')
    console.error('  6. tariffUrl    - Tariff Check URL (optional)')
    console.error('  7. trackingUrl  - Tracking API URL')
    console.error('  8. trackingPassword - Password Basic Auth tracking')
    console.error('\nĐăng nhập tại: https://developer.jet.co.id/')
    process.exit(1)
  }
  
  if (!CONFIG.orderUrl) {
    console.error('\n❌ CHƯA ĐIỀN ORDER URL!')
    console.error('Lấy API URL từ J&T dashboard.')
    process.exit(1)
  }
  
  console.log('\n📋 Config:')
  console.log('  Username:', CONFIG.username)
  console.log('  API Key:', CONFIG.api_key.substring(0, 6) + '...')
  console.log('  Key:', CONFIG.key.substring(0, 6) + '...')
  console.log('  Order URL:', CONFIG.orderUrl)
  
  // Test 1: Tariff check
  await testTariffCheck()
  
  // Test 2: Create order
  const awbNo = await testCreateOrder()
  
  // Test 3: Tracking (nếu tạo đơn thành công)
  if (awbNo) {
    await testTracking(awbNo)
    
    // Test 4: Cancel order (dọn dẹp sandbox)
    const orderId = `TEST-HRM2-${Date.now()}`
    await testCancelOrder(orderId)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🏁 HOÀN TẤT TEST')
  console.log('='.repeat(60))
}

main().catch(console.error)
