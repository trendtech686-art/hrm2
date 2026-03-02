-- Delete "Đặt hàng" stock history records
-- These should not be recorded as per business requirement
-- "Giữ" (committed) only affects "Có thể bán", not actual stock level

DELETE FROM stock_history WHERE action = 'Đặt hàng';
