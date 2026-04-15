/**
 * Script test kết nối VTP (Viettel Post) Sandbox
 * 
 * Chạy: npx tsx scripts/test-vtp-sandbox.ts
 * 
 * TRƯỚC KHI CHẠY, điền thông tin sandbox vào phần CONFIG bên dưới.
 * Lấy token:
 *   Cách 1: API Login (USERNAME/PASSWORD) → ownerconnect → token dài hạn (1 năm)
 *   Cách 2: Website viettelpost.vn → Cấu hình tài khoản → Thêm mới token
 * Docs: https://partner2.viettelpost.vn/document/environment-parameter
 */

// ============ CONFIG - ĐIỀN THÔNG TIN TẠI ĐÂY ============
const CONFIG = {
  token: '',         // Token xác thực (JWT)
  username: '',      // (Tùy chọn) Tài khoản Partner cho API Login
  password: '',      // (Tùy chọn) Mật khẩu
  environment: 'staging' as 'staging' | 'production',
}
// ===================================================================

function getBaseUrl(): string {
  return CONFIG.environment === 'staging'
    ? 'https://partnerdev.viettelpost.vn/v2'
    : 'https://partner.viettelpost.vn/v2'
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json;charset=UTF-8',
    'Token': CONFIG.token,
  }
}

/** Test 0: Login để lấy token (nếu chưa có) */
async function testLogin() {
  if (CONFIG.token) return // Đã có token, bỏ qua

  console.log('\n' + '='.repeat(60))
  console.log('TEST 0: LOGIN (Lấy token)')
  console.log('='.repeat(60))

  if (!CONFIG.username || !CONFIG.password) {
    console.error('❌ Chưa có token và chưa điền username/password')
    return
  }

  const url = `${getBaseUrl()}/user/Login`
  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        USERNAME: CONFIG.username,
        PASSWORD: CONFIG.password,
      }),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.status === 200 && !data.error && data.data?.token) {
      CONFIG.token = data.data.token
      console.log('✅ LOGIN: THÀNH CÔNG!')
      console.log('Token:', CONFIG.token.substring(0, 30) + '...')
      console.log('User ID:', data.data.userId)
    } else {
      console.log('❌ LOGIN: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 1: Lấy danh sách tỉnh/thành phố */
async function testGetProvinces() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 1: GET PROVINCES (Danh sách tỉnh/thành)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/categories/listProvinceById`
  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Token': CONFIG.token },
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.status === 200 && !data.error) {
      console.log('✅ GET PROVINCES: THÀNH CÔNG!')
      console.log(`Tổng tỉnh/thành: ${data.data?.length || 0}`)
      const first5 = (data.data || []).slice(0, 5)
      for (const p of first5) {
        console.log(`  - ${p.PROVINCE_NAME} (ID: ${p.PROVINCE_ID})`)
      }
    } else {
      console.log('❌ GET PROVINCES: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 2: Lấy danh sách quận/huyện (TP.HCM) */
async function testGetDistricts() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 2: GET DISTRICTS (Quận/huyện TP.HCM)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/categories/listDistrict`
  console.log('URL:', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ PROVINCE_ID: 2 }), // TP.HCM (ID=2 trên VTP)
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.status === 200 && !data.error) {
      console.log('✅ GET DISTRICTS: THÀNH CÔNG!')
      console.log(`Tổng quận/huyện: ${data.data?.length || 0}`)
      const first5 = (data.data || []).slice(0, 5)
      for (const d of first5) {
        console.log(`  - ${d.DISTRICT_NAME} (ID: ${d.DISTRICT_ID})`)
      }
      return data.data?.[0]?.DISTRICT_ID
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

  const url = `${getBaseUrl()}/categories/listWards`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ DISTRICT_ID: districtId }),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)

    if (data.status === 200 && !data.error) {
      console.log('✅ GET WARDS: THÀNH CÔNG!')
      console.log(`Tổng phường/xã: ${data.data?.length || 0}`)
      const first5 = (data.data || []).slice(0, 5)
      for (const w of first5) {
        console.log(`  - ${w.WARDS_NAME} (ID: ${w.WARDS_ID})`)
      }
    } else {
      console.log('❌ GET WARDS: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 4: Tính phí vận chuyển (NLP - dùng địa chỉ string) */
async function testCalculateFee() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 4: CALCULATE FEE NLP (Tính phí vận chuyển)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/order/getPriceNlp`

  const feeData = {
    PRODUCT_WEIGHT: 500,     // 500g
    PRODUCT_PRICE: 100000,   // 100k VND
    MONEY_COLLECTION: 0,     // Không COD
    ORDER_SERVICE: 'VCN',    // Chuyển phát nhanh
    ORDER_SERVICE_ADD: '',
    SENDER_ADDRESS: 'Quận 10, Hồ Chí Minh',
    RECEIVER_ADDRESS: 'Quận Cầu Giấy, Hà Nội',
    PRODUCT_LENGTH: 20,
    PRODUCT_WIDTH: 15,
    PRODUCT_HEIGHT: 10,
    PRODUCT_TYPE: 'HH',      // Hàng hóa
    NATIONAL_TYPE: 1,        // Trong nước
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

    if (data.status === 200 && !data.error) {
      console.log('✅ CALCULATE FEE: THÀNH CÔNG!')
      console.log('Tổng cước:', data.data?.MONEY_TOTAL?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('Cước dịch vụ:', data.data?.MONEY_TOTAL_FEE?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('Phí xăng dầu:', data.data?.MONEY_FEE?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('VAT:', data.data?.MONEY_VAT?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('KPI (giờ):', data.data?.KPI_HT)
    } else {
      console.log('❌ CALCULATE FEE: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

/** Test 5: Tạo đơn hàng NLP (Staging only!) */
async function testCreateOrder() {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 5: CREATE ORDER NLP (Tạo đơn hàng test)')
  console.log('='.repeat(60))

  if (CONFIG.environment !== 'staging') {
    console.log('⚠️ SKIP: Chỉ test tạo đơn trên Staging!')
    return null
  }

  const url = `${getBaseUrl()}/order/createOrderNlp`

  const orderData = {
    ORDER_NUMBER: `HRM2-TEST-${Date.now()}`,
    SENDER_FULLNAME: 'NGUOI GUI TEST',
    SENDER_ADDRESS: 'Số 10, Quận 10, Hồ Chí Minh',
    SENDER_PHONE: '0901234567',
    RECEIVER_FULLNAME: 'KHACH HANG TEST',
    RECEIVER_ADDRESS: '456 Trần Hưng Đạo, Quận 1, TP HCM',
    RECEIVER_PHONE: '0987654321',
    PRODUCT_NAME: 'Sản phẩm test HRM2',
    PRODUCT_QUANTITY: 1,
    PRODUCT_WEIGHT: 500,
    PRODUCT_PRICE: 100000,
    MONEY_COLLECTION: 0,
    PRODUCT_TYPE: 'HH',
    ORDER_PAYMENT: 1,     // Người gửi trả
    ORDER_SERVICE: 'VCN', // Chuyển phát nhanh
    NATIONAL_TYPE: 1,     // Trong nước
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

    if (data.status === 200 && !data.error) {
      console.log('✅ CREATE ORDER: THÀNH CÔNG!')
      console.log('Order Number:', data.data?.ORDER_NUMBER)
      console.log('Total Fee:', data.data?.MONEY_TOTAL?.toLocaleString('vi-VN'), 'VNĐ')
      console.log('KPI (giờ):', data.data?.KPI_HT)
      return data.data?.ORDER_NUMBER
    } else {
      console.log('❌ CREATE ORDER: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
  return null
}

/** Test 6: Cancel Order */
async function testCancelOrder(orderNumber: string) {
  console.log('\n' + '='.repeat(60))
  console.log('TEST 6: CANCEL ORDER (Hủy đơn test)')
  console.log('='.repeat(60))

  const url = `${getBaseUrl()}/order/UpdateOrder`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        TYPE: 4, // 4 = Hủy đơn hàng
        ORDER_NUMBER: orderNumber,
        NOTE: 'Đơn hàng test từ HRM2 - tự động hủy',
      }),
    })

    const data = await response.json()
    console.log(`\nHTTP ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (data.status === 200 && !data.error) {
      console.log('✅ CANCEL ORDER: THÀNH CÔNG!')
      console.log('Message:', data.message)
    } else {
      console.log('❌ CANCEL ORDER: THẤT BẠI -', data.message)
    }
  } catch (err) {
    console.error('❌ ERROR:', err instanceof Error ? err.message : err)
  }
}

// ============ MAIN ============
async function main() {
  console.log('🚀 VTP (Viettel Post) Sandbox Test')
  console.log('Thời gian:', new Date().toLocaleString('vi-VN'))
  console.log('Môi trường:', CONFIG.environment)

  // Kiểm tra config
  if (!CONFIG.token && !CONFIG.username) {
    console.error('\n❌ CHƯA ĐIỀN THÔNG TIN!')
    console.error('Mở file scripts/test-vtp-sandbox.ts và điền thông tin vào phần CONFIG.')
    console.error('\nThông tin cần lấy:')
    console.error('  Cách 1: token     - Token dài hạn từ viettelpost.vn → Cấu hình tài khoản')
    console.error('  Cách 2: username  - Tài khoản Partner + password')
    console.error('\nStaging: partnerdev.viettelpost.vn')
    console.error('Production: partner.viettelpost.vn')
    process.exit(1)
  }

  // Login nếu chưa có token
  await testLogin()

  if (!CONFIG.token) {
    console.error('\n❌ Không có token! Kiểm tra lại thông tin đăng nhập.')
    process.exit(1)
  }

  console.log('\n📋 Config:')
  console.log('  Token:', CONFIG.token.substring(0, 20) + '...')
  console.log('  Base URL:', getBaseUrl())

  // Test 1: Get Provinces (test connection)
  await testGetProvinces()

  // Test 2: Get Districts (TP.HCM)
  const districtId = await testGetDistricts()

  if (districtId) {
    // Test 3: Get Wards
    await testGetWards(districtId)
  }

  // Test 4: Calculate Fee (NLP)
  await testCalculateFee()

  // Test 5: Create Order (staging only)
  const orderNumber = await testCreateOrder()

  // Test 6: Cancel Order (cleanup)
  if (orderNumber) {
    await testCancelOrder(orderNumber)
  }

  console.log('\n' + '='.repeat(60))
  console.log('🏁 HOÀN TẤT TEST VTP')
  console.log('='.repeat(60))
}

main().catch(console.error)
