# Print System Sync Plan

## Mục tiêu
Đồng bộ 3 layers: **Variables** ↔ **Mappers** ↔ **Templates**

## Nguyên tắc
1. **Variables = Source of Truth** cho UI (danh sách placeholders để user chọn)
2. **Template = Source of Truth** cho business logic (những gì cần in)
3. **Mapper phải map TẤT CẢ variables** có trong Variables file

## Store Variables (Auto-included)
Các biến sau được auto-inject qua `getStoreData()`:
- `{store_logo}` ✅
- `{store_name}` ✅
- `{store_address}` ✅
- `{store_phone_number}` ✅
- `{hotline}` ✅
- `{store_hotline}` ✅
- `{store_email}` ✅
- `{store_fax}` ✅
- `{store_website}` ✅
- `{store_tax_code}` ✅
- `{print_date}` ✅
- `{print_time}` ✅

## Template Types cần sync

### 1. HANDOVER (Phiếu bàn giao tài sản)
**Status:** Variables hiện tại cho "ship shipper", Template cho "bàn giao tài sản" → Cần refactor Variables + Mapper

**Template placeholders:**
- Store: `{store_logo}`, `{store_name}`, `{store_address}` ✅ (getStoreData)
- Header: `{handover_code}`, `{created_on}`, `{created_on_time}`
- Info: `{from_employee}`, `{from_department}`, `{to_employee}`, `{to_department}`, `{handover_type}`, `{status}`
- Line items: `{line_stt}`, `{line_description}`, `{line_quantity}`, `{line_condition}`, `{line_note}`
- Footer: `{note}`

### 2-24. Other templates
(Sẽ được audit và sync sau khi hoàn thành Handover)

## Execution Plan
1. ✅ Verify `getStoreData()` có đầy đủ store variables
2. 🔄 Refactor Handover (Variables + Mapper)
3. 🔄 Audit remaining 23 templates
4. 🔄 Create validation test
