# J&T Express API Integration — Trạng thái

> Cập nhật: 2026-04-15

## Tình trạng hiện tại

| Hạng mục | Trạng thái |
|----------|-----------|
| Code integration (settings UI) | ✅ Hoàn thành |
| API proxy routes (5 routes) | ✅ Hoàn thành |
| Script test sandbox | ✅ Có sẵn (`scripts/test-jnt-sandbox.ts`) |
| Tài khoản sandbox J&T | ❌ **Chưa có** — đang chờ xin từ J&T |
| Test kết nối thực tế | ⏳ Chờ tài khoản |
| Mapping mã vùng (area codes) | ⏳ Chờ tài khoản |
| Production go-live | ⏳ Chờ test sandbox xong |

## Đã hoàn thành

### 1. Constants & Status Mapping
- `lib/jnt-constants.ts` — mã trạng thái J&T (101, 100, 150-152, 162-163, 200, 401-402)

### 2. Service Class
- `features/settings/shipping/integrations/jnt-service.ts` — client-side service gọi qua proxy

### 3. API Proxy Routes (server-side)
- `app/api/shipping/jnt/test-connection/route.ts` — test kết nối qua Tariff Check
- `app/api/shipping/jnt/create-order/route.ts` — tạo đơn
- `app/api/shipping/jnt/tracking/route.ts` — theo dõi đơn (Basic Auth)
- `app/api/shipping/jnt/cancel-order/route.ts` — hủy đơn
- `app/api/shipping/jnt/calculate-fee/route.ts` — tính cước

### 4. Settings UI
- `features/settings/shipping/forms/jnt-config-form.tsx` — form cấu hình tài khoản J&T
- `features/settings/shipping/tabs/partner-info-tab.tsx` — đã wire J&T vào routing

### 5. Type Definitions
- `lib/types/shipping-config.ts` — thêm `JNTDefaultSettings`

## Cần làm sau khi có tài khoản

1. **Điền credentials vào `scripts/test-jnt-sandbox.ts`** và chạy `npx tsx scripts/test-jnt-sandbox.ts`
2. **Xác nhận mã vùng Vietnam** — origin_code, destination_code, receiver_area (J&T cung cấp danh sách mapping)
3. **Test qua UI** — Settings > Vận chuyển > Thêm tài khoản > J&T Express
4. **Order packaging route** — tạo route bắn đơn từ trang quản lý đơn hàng
5. **Webhook/Cron sync** — đồng bộ trạng thái đơn theo thời gian thực
6. **Tích hợp tính cước** — wire J&T vào `useShippingCalculator()` trên form đơn hàng

## Thông tin cần lấy từ J&T

Đăng nhập: https://developer.jet.co.id/

| Thông tin | Mô tả |
|-----------|-------|
| `username` | Username |
| `api_key` | API Key |
| `key` | Signing key (tạo chữ ký MD5+Base64) |
| `eccompanyid` | EC Company ID (cho tracking) |
| `orderUrl` | Order API endpoint |
| `tariffUrl` | Tariff Check URL |
| `trackingUrl` | Tracking API URL |
| `trackingPassword` | Password Basic Auth tracking |
| Area code list | Danh sách mã tỉnh/quận/huyện Vietnam |
