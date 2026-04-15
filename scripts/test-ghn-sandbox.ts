/**
 * Script test kết nối GHN (Giao Hàng Nhanh) Sandbox
 * 
 * Chạy: npx tsx scripts/test-ghn-sandbox.ts
 * 
 * TRƯỚC KHI CHẠY, điền thông tin sandbox vào phần CONFIG bên dưới.
 * Staging: Đăng ký tại 5sao.ghn.dev
 * Production: Đăng ký tại khachhang.ghn.vn
 * Docs: https://api.ghn.vn/home/docs/detail
 */

// ============ CONFIG - ĐIỀN THÔNG TIN TẠI ĐÂY ============
const CONFIG = {
  token: '',         // Token từ dashboard (Tab "Chủ cửa hàng" → Nút "Xem")
  shopId: '',        // Shop ID
  environment: 'staging' as 'staging' | 'production',
}
// ===================================================================

function getBaseUrl(): string {
  return CONFIG.environment === 'staging'
    ? 'https://dev-online-gateway.ghn.vn/shiip/public-api'
    : 'https://online-gateway.ghn.vn/shiip/public-api'
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Token': CONFIG.token,
    ...(CONFIG.shopId && { 'ShopId': CONFIG.shopId }),
  }
}

/** Test 1: Lấy danh sách tỉnh/thành phố */
async function testGetProvinces() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 1: GET PROVINCES (Danh sách tỉnh/thành)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/master-data/province`
  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Token': CONFIG.token },
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.code === 200) {
      console.log('✅ GET PROVINCES: THÀNH CÔNG!')
      console.log(`Tổng tỉnh/thành: ${data.data?.length || 0}`)
      // Show 5 first
      const first5 = (data.data || []).slice(0, 5)
      for (const p of first5) {
        console.log(`  - ${p.ProvinceName} (ID: ${p.ProvinceID})`)
      }
    } else {
      console.log('❌ GET PROVINCES: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 2: Lấy danh sách quận/huyện (TP.HCM = 202) */
async function testGetDistricts() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 2: GET DISTRICTS (Quận/huyện TP.HCM)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/master-data/district`
  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ province_id: 202 }), // TP.HCM
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.code === 200) {
      console.log('✅ GET DISTRICTS: THÀNH CÔNG!')
      console.log(`Tổng quận/huyện: ${data.data?.length || 0}`)
      const first5 = (data.data || []).slice(0, 5)
      for (const d of first5) {
        console.log(`  - ${d.DistrictName} (ID: ${d.DistrictID})`)
      }
      return data.data?.[0]?.DistrictID // Return first district for next test
    } else {
      console.log('❌ GET DISTRICTS: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
  return null
}

/** Test 3: Lấy danh sách phường/xã */
async function testGetWards(districtId: number) {
  console.log('\n' + '='.repeat(60))
  console.log(`TEST 3: GET WARDS (Phường/xã quận ID=${districtId})`)
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/master-data/ward`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ district_id: districtId }),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.code === 200) {
      console.log('✅ GET WARDS: THÀNH CÔNG!')
      console.log(`Tổng phường/xã: ${data.data?.length || 0}`)
      const first5 = (data.data || []).slice(0, 5)
      for (const w of first5) {
        console.log(`  - ${w.WardName} (Code: ${w.WardCode})`)
      }
      return data.data?.[0]?.WardCode
    } else {
      console.log('❌ GET WARDS: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
  return null
}

/** Test 4: Tính phí vận chuyển */
async function testCalculateFee(toDistrictId: number, toWardCode: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 4: CALCULATE FEE (Tính phí vận chuyển)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/v2/shipping-order/fee`

  const feeData = {
    service_type_id: 2, // Express
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    weight: 500, // 500g
    length: 20,
    width: 15,
    height: 10,
    insurance_value: 100000,
  }

  console.log('URL:', url)
  console.log('Data:', JSON.stringify(feeData, null, 2))

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feeData),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.code === 200) {
      console.log('✅ CALCULATE FEE: THÀNH CÔNG!')
      console.log('Tổng phí:', data.data?.total?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('Phí dịch vụ:', data.data?.service_fee?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('Phí bảo hiểm:', data.data?.insurance_fee?.toLocaleString('vi-VN'), 'VNĐ')
    } else {
      console.log('❌ CALCULATE FEE: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 5: Lấy dịch vụ khả dụng */
async function testGetServices(toDistrictId: number) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 5: GET SERVICES (Dịch vụ khả dụng)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/v2/shipping-order/available-services`

  const payload = {
    shop_id: Number(CONFIG.shopId) || 0,
    from_district: 1454, // Quận 10 HCM (mặc định)
    to_district: toDistrictId,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.code === 200) {
      console.log('✅ GET SERVICES: THÀNH CÔNG!')
      for (const s of (data.data || [])) {
        console.log(`  - ${s.short_name}: service_id=${s.service_id}, service_type_id=${s.service_type_id}`)
      }
    } else {
      console.log('❌ GET SERVICES: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 6: Tạo đơn hàng (Staging only!) */
async function testCreateOrder(toDistrictId: number, toWardCode: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 6: CREATE ORDER (Tạo đơn hàng test)')
  console.log('='.repeat(60))

  if (CONFIG.environment !== 'staging') {
    console.log('⚠️ SKIP: Chỉ test tạo đơn trên Staging!')
    return null
  }

  const url = `${getBaseUrl()}/v2/shipping-order/create`

  const orderData = {
    payment_type_id: 2, // Người nhận trả
    note: 'Don hang test tu HRM2',
    required_note: 'KHONGCHOXEMHANG',
    to_name: 'KHACH HANG TEST',
    to_phone: '0987654321',
    to_address: '456 Tran Hung Dao, Quan 1, TP HCM',
    to_ward_code: toWardCode,
    to_district_id: toDistrictId,
    cod_amount: 0,
    content: 'San pham test HRM2',
    weight: 500,
    length: 20,
    width: 15,
    height: 10,
    service_type_id: 2,
    items: [
      {
        name: 'San pham test',
        quantity: 1,
        price: 100000,
        weight: 500,
      },
    ],
  }

  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (data.code === 200) {
      console.log('✅ CREATE ORDER: THÀNH CÔNG!')
      console.log('Order Code:', data.data?.order_code)
      console.log('Total Fee:', data.data?.total_fee?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('Expected Delivery:', data.data?.expected_delivery_time)
      return data.data?.order_code
    } else {
      console.log('❌ CREATE ORDER: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
  return null
}

/** Test 7: Cancel Order */
async function testCancelOrder(orderCode: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 7: CANCEL ORDER (Hủy đơn test)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/v2/switch-status/cancel`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ order_codes: [orderCode] }),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (data.code === 200) {
      const detail = data.data?.[0]
      if (detail?.result) {
        console.log('✅ CANCEL ORDER: THÀNH CÔNG!')
      } else {
        console.log('❌ CANCEL ORDER: LỖI -', detail?.message)
      }
    } else {
      console.log('❌ CANCEL ORDER: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

// ============ MAIN ============
async function main() {
  console.log('🚀 GHN (Giao Hàng Nhanh) Sandbox Test')
  console.log('Thời gian:', new Date().toLocaleString('vi-VN'))
  console.log('Môi trường:', CONFIG.environment)

  // Kiểm tra config
  if (!CONFIG.token) {
    console.error('\n❌ CHƯA ĐIỀN THÔNG TIN!')
    console.error('Mở file scripts/test-ghn-sandbox.ts và điền thông tin vào phần CONFIG.')
    console.error('\nThông tin cần lấy:')
    console.error('  1. token   - Token API (Dashboard → Tab "Chủ cửa hàng" → Nút "Xem")')
    console.error('  2. shopId  - Shop ID (Dashboard → Quản lý cửa hàng)')
    console.error('\nStaging: Đăng ký tại https://5sao.ghn.dev')
    console.error('Production: Đăng ký tại https://khachhang.ghn.vn')
    process.exit(1)
  }

  console.log('\n📋 Config:')
  console.log('  Token:', CONFIG.token.substring(0, 10) + '...')
  console.log('  Shop ID:', CONFIG.shopId || '(không có)')
  console.log('  Base URL:', getBaseUrl())

  // Test 1: Get Provinces (test connection)
  await testGetProvinces()

  // Test 2: Get Districts (TP.HCM)
  const districtId = await testGetDistricts()

  if (districtId) {
    // Test 3: Get Wards
    const wardCode = await testGetWards(districtId)

    if (wardCode) {
      // Test 4: Calculate Fee
      await testCalculateFee(districtId, wardCode)

      // Test 5: Get Services
      await testGetServices(districtId)

      // Test 6: Create Order (staging only)
      const orderCode = await testCreateOrder(districtId, wardCode)

      // Test 7: Cancel Order (cleanup)
      if (orderCode) {
        await testCancelOrder(orderCode)
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🏁 HOÀN TẤT TEST GHN')
  console.log('='.repeat(60))
}

main().catch(console.error)
