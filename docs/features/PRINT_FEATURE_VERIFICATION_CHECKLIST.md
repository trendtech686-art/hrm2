# Print Template Verification Checklist

This checklist contains all available variables for each print template type, grouped by their category.
Use this to verify that templates are correctly implementing the required variables.

**Status:**
- [x] Verified: All Modules
- [ ] Pending: None

## Order (`order`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
- [x] `{location_phone_number}` - SĐT chi nhánh
### Thông tin đơn hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_qr_code}` - Mã đơn hàng dạng QR code
- [x] `{bar_code(code)}` - Mã đơn hàng dạng mã vạch
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{ship_on_min}` - Ngày hẹn giao hàng từ
- [x] `{ship_on_max}` - Thời gian hẹn giao hàng đến
- [x] `{assignee_name}` - Người phụ trách
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_contact}` - Liên hệ khách hàng
- [x] `{customer_contact_phone_number}` - SĐT liên hệ khách hàng
- [x] `{customer_contact_phone_number_hide}` - SĐT liên hệ khách hàng - ẩn 4 số giữa
- [x] `{customer_group}` - Nhóm khách hàng
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
- [x] `{customer_point}` - Điểm hiện tại
- [x] `{customer_point_used}` - Điểm đã thanh toán cho hóa đơn
- [x] `{customer_point_new}` - Điểm tích được khi mua hàng
- [x] `{customer_point_before_create_invoice}` - Điểm trước khi mua hàng
- [x] `{customer_point_after_create_invoice}` - Điểm sau khi mua hàng
- [x] `{currency_name}` - Tiền tệ
- [x] `{tax_treatment}` - Giá đã bao gồm thuế
- [x] `{fulfillment_status}` - Trạng thái giao hàng
- [x] `{packed_status}` - Trạng thái đóng gói
- [x] `{return_status}` - Trạng thái trả hàng
- [x] `{customer_debt_text}` - Nợ KH bằng chữ
- [x] `{customer_tax_number}` - Mã số thuế của KH
- [x] `{expected_delivery_type}` - Vận chuyển dự kiến
- [x] `{weight_g}` - Tổng khối lượng đơn hàng (g)
- [x] `{weight_kg}` - Tổng khối lượng đơn hàng (kg)
- [x] `{issued_on_text}` - Ngày chứng từ dạng chữ
- [x] `{shipping_address:full_name}` - Người nhận
- [x] `{shipping_address:phone_number}` - SĐT người nhận
- [x] `{shipping_address:phone_number_hide}` - SĐT người nhận - ẩn 4 số giữa
- [x] `{created_on}` - Ngày tạo
- [x] `{source}` - Nguồn
- [x] `{bar_code(reference_number)}` - Tham chiếu dạng mã vạch
- [x] `{issued_on}` - Ngày chứng từ
- [x] `{account_name}` - Người tạo
- [x] `{issued_on_time}` - Thời gian chứng từ
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{customer_code}` - Mã khách hàng
- [x] `{customer_debt}` - Nợ hiện tại
- [x] `{debt_before_create_invoice}` - Nợ trước khi mua hàng
- [x] `{debt_before_create_invoice_text}` - Nợ trước khi mua hàng bằng chữ
- [x] `{debt_after_create_invoice}` - Nợ sau khi mua hàng
- [x] `{debt_after_create_invoice_text}` - Nợ sau khi mua hàng bằng chữ
- [x] `{billing_address}` - Địa chỉ gửi hóa đơn
- [x] `{customer_email}` - Email khách hàng
- [x] `{reference}` - Tham chiếu
- [x] `{customer_card}` - Hạng thẻ
- [x] `{price_list_name}` - Chính sách giá
- [x] `{order_status}` - Trạng thái đơn hàng
- [x] `{tag}` - Thẻ Tag
- [x] `{payment_status}` - Trạng thái thanh toán
- [x] `{customer_debt_prev}` - Nợ cũ
- [x] `{customer_debt_prev_text}` - Nợ cũ KH bằng chữ
- [x] `{expected_payment_method}` - Thanh toán dự kiến
- [x] `{channel}` - Kênh bán hàng
- [x] `{shipped_on}` - Ngày xuất kho
- [x] `{created_on_text}` - Ngày tạo dạng chữ
- [x] `{total_amount_and_debt_before_create_invoice}` - Nợ và đơn hàng mới
- [x] `{total_amount_and_debt_before_create_invoice_text}` - Nợ và đơn hàng mới bằng chữ
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_tax_rate}` - Thuế theo %
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_price_after_discount}` - Giá sau chiết khấu trên 1 sản phẩm
- [x] `{line_promotion_or_loyalty}` - Hàng tích điểm, KM
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_weight_g}` - Tổng khối lượng sản phẩm (g)
- [x] `{line_weight_kg}` - Tổng khối lượng sản phẩm (kg)
- [x] `{term_number}` - Thời hạn bảo hành
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng bán sản phẩm
- [x] `{composite_details}` - Thành phần combo
- [x] `{packsizes}` - Đơn vị quy đổi
- [x] `{lots_number_combo}` - Mã lô-date thành phần trong combo
- [x] `{line_image}` - Ảnh phiên bản sản phẩm
- [x] `{line_variant_barcode_image}` - Mã vạch sản phẩm (dạng ảnh)
- [x] `{total_line_item_discount}` - Tổng chiết khấu sản phẩm
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Tên phiên bản sản phẩm
- [x] `{line_tax_amount}` - Thuế
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_price_discount}` - Giá bán sau/trước chiết khấu
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_amount_none_discount}` - Tiền hàng (Giá * SL)
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_category}` - Loại sản phẩm
- [x] `{serials}` - Serial
- [x] `{term_name}` - Chính sách bảo hành
- [x] `{bin_location}` - Điểm lưu kho
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
- [x] `{line_product_description}` - Mô tả sản phẩm
- [x] `{term_name_combo}` - Chính sách bảo hành thành phần combo
- [x] `{term_number_combo}` - Thời hạn bảo hành thành phần combo
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount}` - Tổng tiền
- [x] `{money_return}` - Tổng tiền trả lại
- [x] `{total_text}` - Tổng tiền bằng chữ
- [x] `{total_tax}` - Tổng thuế
- [x] `{delivery_fee}` - Phí giao hàng
- [x] `{total_remain}` - Tiền còn lại khách phải trả
- [x] `{total_remain_text}` - Tiền còn lại khách phải trả bằng chữ
- [x] `{payment_name}` - Phương thức thanh toán
- [x] `{payments}` - Tên phương thức thanh toán: Số tiền thanh toán
- [x] `{payment_qr}` - Mã QR thanh toán
- [x] `{promotion_name}` - Tên khuyến mại
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế
- [x] `{total_discount}` - Tổng chiết khấu của sản phẩm và đơn hàng
- [x] `{product_discount}` - Chiết khấu sản phẩm
- [x] `{payment_customer}` - Tổng tiền khách đưa
- [x] `{total}` - Tổng tiền hàng
- [x] `{discount_details}` - Chiết khấu chi tiết
- [x] `{order_note}` - Ghi chú đơn hàng
- [x] `{order_discount_rate}` - Chiết khấu đơn hàng theo %
- [x] `{order_discount_value}` - Chiết khấu đơn hàng theo giá trị
- [x] `{order_discount}` - Chiết khấu đơn hàng
- [x] `{total_none_discount}` - Tổng tiền (Đơn giá * SL)
- [x] `{promotion_code}` - Mã chương trình khuyến mại
- [x] `{total_extra_tax}` - Tổng thuế phải trả thêm
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm

## Quote (`quote`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
- [x] `{location_phone_number}` - SĐT chi nhánh
### Thông tin đơn hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_qr_code}` - Mã đơn hàng dạng QR code
- [x] `{bar_code(code)}` - Mã đơn hàng dạng mã vạch
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{ship_on_min}` - Ngày hẹn giao hàng từ
- [x] `{ship_on_max}` - Thời gian hẹn giao hàng đến
- [x] `{assignee_name}` - Người phụ trách
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_contact}` - Liên hệ khách hàng
- [x] `{customer_contact_phone_number}` - SĐT liên hệ khách hàng
- [x] `{customer_contact_phone_number_hide}` - SĐT liên hệ khách hàng - ẩn 4 số giữa
- [x] `{customer_group}` - Nhóm khách hàng
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
- [x] `{customer_point}` - Điểm hiện tại
- [x] `{customer_point_used}` - Điểm đã thanh toán cho hóa đơn
- [x] `{customer_point_new}` - Điểm tích được khi mua hàng
- [x] `{customer_point_before_create_invoice}` - Điểm trước khi mua hàng
- [x] `{customer_point_after_create_invoice}` - Điểm sau khi mua hàng
- [x] `{currency_name}` - Tiền tệ
- [x] `{tax_treatment}` - Giá đã bao gồm thuế
- [x] `{fulfillment_status}` - Trạng thái giao hàng
- [x] `{packed_status}` - Trạng thái đóng gói
- [x] `{return_status}` - Trạng thái trả hàng
- [x] `{customer_debt_text}` - Nợ KH bằng chữ
- [x] `{customer_tax_number}` - Mã số thuế của KH
- [x] `{expected_delivery_type}` - Vận chuyển dự kiến
- [x] `{weight_g}` - Tổng khối lượng đơn hàng (g)
- [x] `{weight_kg}` - Tổng khối lượng đơn hàng (kg)
- [x] `{issued_on_text}` - Ngày chứng từ dạng chữ
- [x] `{shipping_address:full_name}` - Người nhận
- [x] `{shipping_address:phone_number}` - SĐT người nhận
- [x] `{shipping_address:phone_number_hide}` - SĐT người nhận - ẩn 4 số giữa
- [x] `{created_on}` - Ngày tạo
- [x] `{source}` - Nguồn
- [x] `{bar_code(reference_number)}` - Tham chiếu dạng mã vạch
- [x] `{issued_on}` - Ngày chứng từ
- [x] `{account_name}` - Người tạo
- [x] `{issued_on_time}` - Thời gian chứng từ
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{customer_code}` - Mã khách hàng
- [x] `{customer_debt}` - Nợ hiện tại
- [x] `{debt_before_create_invoice}` - Nợ trước khi mua hàng
- [x] `{debt_before_create_invoice_text}` - Nợ trước khi mua hàng bằng chữ
- [x] `{debt_after_create_invoice}` - Nợ sau khi mua hàng
- [x] `{debt_after_create_invoice_text}` - Nợ sau khi mua hàng bằng chữ
- [x] `{billing_address}` - Địa chỉ gửi hóa đơn
- [x] `{customer_email}` - Email khách hàng
- [x] `{reference}` - Tham chiếu
- [x] `{customer_card}` - Hạng thẻ
- [x] `{price_list_name}` - Chính sách giá
- [x] `{order_status}` - Trạng thái đơn hàng
- [x] `{tag}` - Thẻ Tag
- [x] `{payment_status}` - Trạng thái thanh toán
- [x] `{customer_debt_prev}` - Nợ cũ
- [x] `{customer_debt_prev_text}` - Nợ cũ KH bằng chữ
- [x] `{expected_payment_method}` - Thanh toán dự kiến
- [x] `{channel}` - Kênh bán hàng
- [x] `{shipped_on}` - Ngày xuất kho
- [x] `{created_on_text}` - Ngày tạo dạng chữ
- [x] `{total_amount_and_debt_before_create_invoice}` - Nợ và đơn hàng mới
- [x] `{total_amount_and_debt_before_create_invoice_text}` - Nợ và đơn hàng mới bằng chữ
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_tax_rate}` - Thuế theo %
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_price_after_discount}` - Giá sau chiết khấu trên 1 sản phẩm
- [x] `{line_promotion_or_loyalty}` - Hàng tích điểm, KM
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_weight_g}` - Tổng khối lượng sản phẩm (g)
- [x] `{line_weight_kg}` - Tổng khối lượng sản phẩm (kg)
- [x] `{term_number}` - Thời hạn bảo hành
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX -NHH - Số lượng bán sản phẩm
- [x] `{composite_details}` - Thành phần combo
- [x] `{packsizes}` - Đơn vị quy đổi
- [x] `{lots_number_combo}` - Mã lô-date thành phần trong combo
- [x] `{line_image}` - Ảnh phiên bản sản phẩm
- [x] `{line_variant_barcode_image}` - Mã vạch sản phẩm (dạng ảnh)
- [x] `{total_line_item_discount}` - Tổng chiết khấu sản phẩm
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Tên phiên bản sản phẩm
- [x] `{line_tax_amount}` - Thuế
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_price_discount}` - Giá bán sau/trước chiết khấu
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_amount_none_discount}` - Tiền hàng (Giá * SL)
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_category}` - Loại sản phẩm
- [x] `{serials}` - Serial
- [x] `{term_name}` - Chính sách bảo hành
- [x] `{bin_location}` - Điểm lưu kho
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
- [x] `{line_product_description}` - Mô tả sản phẩm
- [x] `{term_name_combo}` - Chính sách bảo hành thành phần combo
- [x] `{term_number_combo}` - Thời hạn bảo hành thành phần combo
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount}` - Tổng tiền
- [x] `{money_return}` - Tổng tiền trả lại
- [x] `{total_text}` - Tổng tiền bằng chữ
- [x] `{total_tax}` - Tổng thuế
- [x] `{delivery_fee}` - Phí giao hàng
- [x] `{total_remain}` - Tiền còn lại khách phải trả
- [x] `{total_remain_text}` - Tiền còn lại khách phải trả bằng chữ
- [x] `{payment_name}` - Phương thức thanh toán
- [x] `{payments}` - Tên phương thức thanh toán: Số tiền thanh toán
- [x] `{payment_qr}` - Mã QR thanh toán
- [x] `{promotion_name}` - Tên khuyến mại
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế
- [x] `{total_discount}` - Tổng chiết khấu của sản phẩm và đơn hàng
- [x] `{product_discount}` - Chiết khấu sản phẩm
- [x] `{payment_customer}` - Tổng tiền khách đưa
- [x] `{total}` - Tổng tiền hàng
- [x] `{discount_details}` - Chiết khấu chi tiết
- [x] `{order_note}` - Ghi chú
- [x] `{order_discount_rate}` - Chiết khấu đơn hàng theo %
- [x] `{order_discount_value}` - Chiết khấu đơn hàng theo giá trị
- [x] `{order_discount}` - Chiết khấu đơn hàng
- [x] `{total_none_discount}` - Tổng tiền (Đơn giá * SL)
- [x] `{promotion_code}` - Mã chương trình khuyến mại
- [x] `{total_extra_tax}` - Tổng thuế phải trả thêm
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm

## Sales Return (`sales-return`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_qr_code}` - Mã đơn hàng dạng QR code
- [x] `{bar_code(code)}` - Mã đơn hàng dạng mã vạch
- [x] `{order_return_code}` - Mã đơn trả hàng
- [x] `{ship_on_min}` - Ngày hẹn giao hàng từ
- [x] `{ship_on_max}` - Thời gian hẹn giao hàng đến
- [x] `{assignee_name}` - Người phụ trách
- [x] `{expected_delivery_type}` - Vận chuyển dự kiến
- [x] `{shipping_address:full_name}` - Người nhận
- [x] `{shipping_address:phone_number}` - SĐT người nhận
- [x] `{shipping_address}` - Địa chỉ nhận
- [x] `{customer_debt}` - Nợ hiện tại
- [x] `{customer_debt_text}` - Nợ KH bằng chữ
- [x] `{customer_debt_prev}` - Nợ cũ
- [x] `{customer_debt_prev_text}` - Nợ cũ KH bằng chữ
- [x] `{created_on}` - Ngày tạo
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{issued_on}` - Ngày chứng từ
- [x] `{issued_on_time}` - Thời gian chứng từ
- [x] `{source}` - Nguồn
- [x] `{channel}` - Kênh bán hàng
- [x] `{bar_code(reference_number)}` - Tham chiếu dạng mã vạch
- [x] `{reference}` - Tham chiếu
- [x] `{tag}` - Thẻ Tag
- [x] `{order_status}` - Trạng thái đơn hàng
- [x] `{fulfillment_status}` - Trạng thái giao hàng
- [x] `{packed_status}` - Trạng thái đóng gói
- [x] `{return_status}` - Trạng thái trả hàng
- [x] `{payment_status}` - Trạng thái thanh toán
- [x] `{expected_payment_method}` - Thanh toán dự kiến
- [x] `{price_list_name}` - Chính sách giá
- [x] `{currency_name}` - Tiền tệ
### Thông tin khách hàng
- [x] `{customer_code}` - Mã khách hàng
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_contact}` - Liên hệ khách hàng
- [x] `{billing_address}` - Địa chỉ gửi hóa đơn
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_email}` - Email khách hàng
- [x] `{customer_point}` - Điểm của khách hàng
- [x] `{customer_card}` - Hạng thẻ
- [x] `{customer_tax_number}` - Mã số thuế của KH
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_tax_rate}` - Thuế theo %
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_price_after_discount}` - Giá sau chiết khấu trên 1 sản phẩm
- [x] `{line_promotion_or_loyalty}` - Hàng tích điểm, KM
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{total_line_item_discount}` - Tổng chiết khấu sản phẩm
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng bán sản phẩm
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Tên phiên bản sản phẩm
- [x] `{line_tax_amount}` - Thuế
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_amount_none_discount}` - Tiền hàng (Giá * SL)
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_category}` - Loại sản phẩm
- [x] `{serials}` - Serial
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
### Thông tin giỏ hàng trả
- [x] `{return_line_stt}` - STT
- [x] `{return_line_unit}` - Đơn vị tính
- [x] `{return_line_variant_code}` - Mã phiên bản
- [x] `{return_line_quantity}` - Số lượng sản phẩm
- [x] `{return_line_price}` - Giá bán
- [x] `{return_line_product_name}` - Tên hàng
- [x] `{return_line_note}` - Ghi chú sản phẩm
- [x] `{return_line_variant}` - Tên phiên bản
- [x] `{return_line_amount}` - Thành tiền
- [x] `{return_serials}` - Serial
### Tổng giá trị
- [x] `{return_total_quantity}` - Tổng số lượng sản phẩm trả
- [x] `{total_quantity}` - Tổng số lượng hàng mua
- [x] `{total_order_exchange_amount}` - Tổng tiền cần thanh toán
- [x] `{money_return}` - Tổng tiền trả lại
- [x] `{total_text}` - Tổng tiền bằng chữ
- [x] `{order_note}` - Ghi chú
- [x] `{total_remain}` - Tiền còn lại khách phải trả
- [x] `{payment_name}` - Phương thức thanh toán
- [x] `{promotion_name}` - Tên khuyến mại
- [x] `{promotion_code}` - Mã chương trình khuyến mại
- [x] `{order_discount}` - Chiết khấu đơn hàng
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế
- [x] `{return_total_amount}` - Tổng tiền hoàn trả
- [x] `{total_amount}` - Tổng tiền mua
- [x] `{order_exchange_payment_note}` - Nội dung thanh toán (Khách phải trả/Cần trả khách)
- [x] `{payment_customer}` - Tổng tiền khách đưa
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_none_discount}` - Tổng tiền (Đơn giá * SL)
- [x] `{total_discount}` - Tổng chiết khấu của sản phẩm và đơn hàng
- [x] `{product_discount}` - Chiết khấu sản phẩm
- [x] `{total_tax}` - Tổng thuế
- [x] `{delivery_fee}` - Phí giao hàng
- [x] `{order_discount_rate}` - Chiết khấu đơn hàng theo %
- [x] `{order_discount_value}` - Chiết khấu đơn hàng theo giá trị
- [x] `{total_extra_tax}` - Tổng thuế phải trả thêm
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm

## Packing (`packing`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
- [x] `{location_country}` - Quốc gia (chi nhánh)
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
### Thông tin gói hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{shipped_on}` - Ngày chuyển hàng
- [x] `{shipped_on_time}` - Thời gian chuyển hàng
- [x] `{billing_address}` - Địa chỉ gửi hóa đơn
- [x] `{shipping_address}` - Giao hàng đến
- [x] `{customer_email}` - Email khách hàng
- [x] `{package_note}` - Ghi chú
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{customer_name}` - Tên khách hàng
- [x] `{created_on}` - Ngày tạo
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{packed_on}` - Ngày đóng gói
- [x] `{packed_on_time}` - Thời gian đóng gói
- [x] `{order_note}` - Ghi chú đơn hàng
- [x] `{fulfillment_status}` - Trạng thái
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_product_category}` - Loại sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_tax_rate}` - % Thuế
- [x] `{line_variant_barcode}` - Mã vạch phiên bản sp
- [x] `{line_price_after_discount}` - Giá sau chiết khấu/sản phẩm
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{line_composite_variant_code}` - Mã thành phần combo
- [x] `{line_composite_variant_name}` - Tên thành phần combo
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Tên phiên bản sản phẩm
- [x] `{line_tax}` - Loại thuế theo từng mặt hàng
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_product_brand}` - Nhãn hiệu
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_tax_amount}` - Thuế (giá trị)
- [x] `{serials}` - Serial
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng bán sản phẩm
- [x] `{line_composite_unit}` - ĐV thành phần combo
- [x] `{line_composite_quantity}` - SL thành phần combo
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
### Tổng giá trị
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_tax}` - Tổng thuế
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế
- [x] `{total_amount}` - Khách phải trả
- [x] `{fulfillment_discount}` - Chiết khấu
- [x] `{total_amount_text}` - Tổng tiền bằng chữ
- [x] `{total_extra_tax}` - Tổng thuế phải trả thêm
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm

## Delivery (`delivery`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{location_phone_number}` - SĐT chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin phiếu giao hàng
- [x] `{delivery_code}` - Mã phiếu giao hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_qr_code}` - Mã đơn hàng dạng QR
- [x] `{order_bar_code}` - Mã đơn hàng dạng mã vạch
- [x] `{created_on}` - Ngày tạo
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{shipped_on}` - Ngày giao hàng
- [x] `{shipped_on_time}` - Thời gian giao hàng
- [x] `{account_name}` - Người tạo phiếu
- [x] `{shipper_name}` - Nhân viên giao hàng
- [x] `{delivery_status}` - Trạng thái giao hàng
- [x] `{note}` - Ghi chú
### Thông tin vận chuyển
- [x] `{tracking_number}` - Mã vận đơn
- [x] `{tracking_number_qr_code}` - Mã vận đơn dạng QR
- [x] `{tracking_number_bar_code}` - Mã vận đơn dạng mã vạch
- [x] `{shipment_barcode}` - Mã vạch vận đơn
- [x] `{shipment_qrcode}` - QR code vận đơn
- [x] `{carrier_name}` - Đối tác vận chuyển
- [x] `{partner_name}` - Tên đối tác
- [x] `{delivery_type}` - Phương thức vận chuyển
- [x] `{service_name}` - Dịch vụ vận chuyển
### Thông tin người nhận
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_code}` - Mã khách hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
- [x] `{customer_email}` - Email khách hàng
- [x] `{receiver_name}` - Tên người nhận
- [x] `{receiver_phone}` - SĐT người nhận
- [x] `{receiver_phone_hide}` - SĐT người nhận - ẩn 4 số giữa
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{city}` - Tỉnh/Thành phố
- [x] `{district}` - Quận/Huyện
- [x] `{ward}` - Phường/Xã
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Tên phiên bản
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_quantity}` - Số lượng giao
- [x] `{line_price}` - Đơn giá
- [x] `{line_amount}` - Thành tiền
- [x] `{line_weight}` - Khối lượng
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{serials}` - Serial
- [x] `{lots_number_code1}` - Mã lô
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng giao
- [x] `{total_weight}` - Tổng khối lượng
- [x] `{total}` - Tổng tiền hàng
- [x] `{delivery_fee}` - Phí giao hàng
- [x] `{cod_amount}` - Tiền thu hộ (COD)
- [x] `{cod_amount_text}` - Tiền thu hộ bằng chữ
- [x] `{total_amount}` - Tổng cộng
- [x] `{total_text}` - Tổng tiền bằng chữ

## Shipping Label (`shipping-label`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_phone_number}` - Số điện thoại chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_qr_code}` - Mã đơn hàng dạng QR code
- [x] `{order_bar_code}` - Mã đơn hàng dạng mã vạch
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{received_on}` - Ngày nhận
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{received_on_time}` - Thời gian nhận
- [x] `{customer_name}` - Tên khách hàng
- [x] `{shipping_address}` - Giao hàng đến
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{delivery_type}` - Phương thức vận chuyển
- [x] `{tracking_number}` - Mã vận đơn
- [x] `{tracking_number_qr_code}` - Mã vận đơn dạng QR code
- [x] `{tracking_number_bar_code}` - Mã vận đơn dạng mã vạch
- [x] `{ship_on_min}` - Ngày hẹn giao từ
- [x] `{status}` - Trạng thái
- [x] `{city}` - Tỉnh thành giao hàng
- [x] `{partner_type}` - Loại đối tác
- [x] `{shipper_deposits}` - Số tiền cọc trước
- [x] `{reason_cancel}` - Lý do hủy đơn
- [x] `{account_name}` - Nhân viên tạo đơn
- [x] `{created_on}` - Ngày tạo
- [x] `{vnpost_crm_code}` - Mã CRM VNPost
- [x] `{vnpost_crm_bar_code}` - Mã CRM VNPost dạng mã vạch
- [x] `{packed_on}` - Ngày đóng gói
- [x] `{packed_on_time}` - Thời gian đóng gói
- [x] `{shipped_on_time}` - Thời gian chuyển hàng
- [x] `{service_name}` - Dịch vụ
- [x] `{billing_address}` - Nơi giao hàng
- [x] `{customer_email}` - Email khách hàng
- [x] `{delivery_service_provider}` - Đối tác vận chuyển
- [x] `{receiver_name}` - Người nhận
- [x] `{packing_weight}` - Khối lượng đóng gói
- [x] `{creator_name}` - Nhân viên tạo phiếu giao hàng
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{ship_on_max}` - Ngày hẹn giao đến
- [x] `{district}` - Quận huyện giao hàng
- [x] `{partner_phone_number}` - Số ĐT đối tác
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
- [x] `{receiver_phone}` - Số điện thoại người nhận
- [x] `{receiver_phone_hide}` - Số điện thoại người nhận - ẩn 4 số giữa
- [x] `{pushing_status}` - Trạng thái đẩy đơn
- [x] `{route_code_se}` - Mã phân tuyến Sapo Express
- [x] `{sorting_code}` - Mã định danh bưu cục
- [x] `{sorting_code_bar_code}` - Mã định danh dạng mã vạch
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_tax}` - Tổng thuế
- [x] `{delivery_fee}` - Phí giao hàng
- [x] `{shipment_note}` - Ghi chú
- [x] `{cod_amount}` - Tiền thu hộ
- [x] `{total_amount}` - Khách phải trả
- [x] `{fulfillment_discount}` - Chiết khấu
- [x] `{freight_amount}` - Phí trả shipper

## Product Label (`product-label`)
### Thông tin sản phẩm
- [x] `{product_name}` - Tên sản phẩm
- [x] `{product_name_vat}` - Tên sản phẩm VAT (đầy đủ)
- [x] `{product_sku}` - SKU / Mã sản phẩm
- [x] `{product_unit}` - Đơn vị tính
- [x] `{product_brand}` - Thương hiệu
- [x] `{product_category}` - Danh mục
- [x] `{product_weight}` - Khối lượng / Quy cách
- [x] `{product_origin}` - Xuất xứ / Địa chỉ sản xuất
### Thông tin nhập khẩu
- [x] `{product_importer_name}` - Đơn vị nhập khẩu
- [x] `{product_importer_address}` - Địa chỉ nhập khẩu
- [x] `{product_usage_guide}` - Hướng dẫn sử dụng
### Ngày & lô
- [x] `{product_lot_number}` - Số lô
- [x] `{product_mfg_date}` - Ngày sản xuất (NSX)
- [x] `{product_expiry_date}` - Hạn sử dụng (HSD)
### Giá & mã
- [x] `{product_price}` - Giá bán hiển thị
- [x] `{product_barcode}` - Mã vạch (text)
- [x] `{product_barcode_image}` - Mã vạch (ảnh)
- [x] `{product_qr_code}` - QR sản phẩm (ảnh)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
### Mô tả
- [x] `{product_short_description}` - Mô tả ngắn
- [x] `{product_description}` - Mô tả chi tiết
- [x] `{product_storage_instructions}` - Hướng dẫn bảo quản
- [x] `{product_ingredients}` - Thành phần

## Purchase Order (`purchase-order`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn đặt hàng nhập
- [x] `{order_supplier_code}` - Mã đơn
- [x] `{status}` - Trạng thái
- [x] `{created_on}` - Ngày tạo
- [x] `{due_on}` - Ngày nhập dự kiến
- [x] `{completed_on}` - Ngày hoàn thành
- [x] `{ended_on}` - Ngày kết thúc
- [x] `{cancelled_on}` - Ngày hủy
- [x] `{supplier_name}` - Tên NCC
- [x] `{supplier_code}` - Mã NCC
- [x] `{supplier_phone}` - SĐT NCC
- [x] `{supplier_email}` - Email NCC
- [x] `{supplier_address}` - Địa chỉ NCC
- [x] `{supplier_debt}` - Nợ nhà cung cấp
- [x] `{supplier_debt_prev}` - Nợ cũ nhà cung cấp
- [x] `{supplier_debt_text}` - Nợ NCC bằng chữ
- [x] `{supplier_debt_prev_text}` - Nợ cũ NCC bằng chữ
- [x] `{activated_account_name}` - Nhân viên tạo đơn
- [x] `{assignee_name}` - Nhân viên phụ trách NCC
- [x] `{weight_kg}` - Tổng khối lượng đơn nhập hàng (kg)
- [x] `{weight_g}` - Tổng khối lượng đơn nhập hàng (g)
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_title}` - Tên hàng
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng đặt
- [x] `{line_received_quantity}` - Số lượng nhập
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_category}` - Loại sản phẩm
- [x] `{line_price}` - Giá nhập
- [x] `{line_price_after_discount}` - Giá nhập sau chiết khấu
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_amount}` - Thành tiền
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
- [x] `{line_tax_amount}` - Thuế (giá trị)
- [x] `{line_weight_g}` - Tổng khối lượng sản phẩm (g)
- [x] `{line_weight_kg}` - Tổng khối lượng sản phẩm (kg)
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_tax}` - Tổng thuế
- [x] `{total_line_amount_text}` - Tổng tiền bằng chữ
- [x] `{total_price}` - Tổng tiền
- [x] `{total_line_amount}` - Tổng tiền hàng
- [x] `{note}` - Ghi chú
- [x] `{tags}` - Tags
- [x] `{total_discounts}` - Chiết khấu đơn nhập
- [x] `{total_discounts_rate}` - Chiết khấu đơn nhập (%)
- [x] `{total_discounts_value}` - Chiết khấu đơn nhập (giá trị)
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế
- [x] `{total_amount_text}` - Tổng tiền bằng chữ

## Stock In (`stock-in`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{account_name}` - Tên người tạo
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn hàng
- [x] `{purchase_order_code}` - Mã đơn nhập hàng
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{received_on_time}` - Thời gian nhập kho
- [x] `{supplier_name}` - Tên NCC
- [x] `{supplier_code}` - Mã NCC
- [x] `{supplier_debt_text}` - Nợ NCC bằng chữ
- [x] `{supplier_debt_prev_text}` - Nợ cũ NCC bằng chữ
- [x] `{supplier_phone}` - SĐT NCC
- [x] `{created_on}` - Ngày tạo
- [x] `{received_on}` - Ngày nhập kho
- [x] `{receipt_code}` - Mã phiếu nhập kho
- [x] `{note}` - Ghi chú
- [x] `{supplier_debt}` - Nợ NCC
- [x] `{supplier_debt_prev}` - Nợ cũ NCC
- [x] `{supplier_email}` - Email NCC
- [x] `{reference}` - Tham chiếu
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{bin_location}` - Điểm lưu kho
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_tax_rate}` - Thuế (%)
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_tax}` - Loại thuế theo từng mặt hàng
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_amount}` - Thành tiền
- [x] `{line_category}` - Loại sản phẩm
- [x] `{serials}` - Serial
- [x] `{line_tax_amount}` - Thuế (giá trị)
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_tax}` - Tổng thuế
- [x] `{total_discounts}` - Tổng chiết khấu
- [x] `{total_amount_text}` - Tổng tiền bằng chữ
- [x] `{total_price}` - Tổng tiền
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_landed_costs}` - Tổng chi phí

## Stock Transfer (`stock-transfer`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin phiếu chuyển hàng
- [x] `{order_code}` - Mã phiếu
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{shipped_on}` - Ngày chuyển
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{shipped_on_time}` - Thời gian chuyển
- [x] `{source_location_name}` - Tên chi nhánh chuyển
- [x] `{source_location_address}` - Địa chỉ chi nhánh chuyển
- [x] `{reference}` - Tham chiếu
- [x] `{account_name}` - Người tạo
- [x] `{weight_g}` - Tổng khối lượng chuyển hàng (g)
- [x] `{created_on}` - Ngày tạo
- [x] `{note}` - Ghi chú
- [x] `{received_on}` - Ngày nhận
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{received_on_time}` - Thời gian nhận
- [x] `{destination_location_name}` - Tên chi nhánh nhận
- [x] `{destination_location_address}` - Địa chỉ chi nhánh nhận
- [x] `{status}` - Trạng thái
- [x] `{weight_kg}` - Tổng khối lượng chuyển hàng (kg)
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_price}` - Đơn giá
- [x] `{line_amount}` - Thành tiền
- [x] `{line_weight_g}` - Tổng khối lượng sản phẩm (g)
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_category}` - Loại sản phẩm
- [x] `{serials}` - Serial
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng bán sản phẩm
- [x] `{line_variant_image}` - Ảnh phiên bản sản phẩm
- [x] `{line_weight_kg}` - Tổng khối lượng sản phẩm (kg)
### Thông tin giỏ hàng
- [x] `{receipt_quantity}` - Số lượng nhận
- [x] `{change_quantity}` - Số lượng chênh lệch
- [x] `{line_amount_received}` - Thành tiền nhận
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount_transfer}` - Tổng giá trị chuyển
- [x] `{total_fee_amount}` - Tổng chi phí chuyển hàng
- [x] `{total_receipt_quantity}` - Tổng số lượng nhận
- [x] `{total_amount_receipt}` - Tổng giá trị nhận

## Inventory Check (`inventory-check`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn kiểm
- [x] `{code}` - Mã code
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{note}` - Ghi chú
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{adjusted_on_time}` - Thời gian kiểm hàng
- [x] `{created_on}` - Ngày tạo
- [x] `{reason}` - Lý do
- [x] `{adjusted_on}` - Ngày kiểm hàng
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{status}` - Trạng thái kiểm hàng
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_after_quantity}` - Số lượng sau kiểm
- [x] `{line_stock_quantity}` - Tồn kho
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_change_quantity}` - Số lượng chênh lệch
- [x] `{line_reason}` - Lý do từng mặt hàng
- [x] `{line_category}` - Loại sản phẩm
- [x] `{line_unit}` - Đơn vị tính
### Tổng giá trị
- [x] `{total}` - Tổng số lượng

## Receipt (`receipt`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin
- [x] `{receipt_voucher_code}` - Mã
- [x] `{object_name}` - Tên người nộp
- [x] `{object_phone_number}` - SĐT người nộp
- [x] `{total_text}` - Số tiền bằng chữ
- [x] `{note}` - Ghi chú
- [x] `{account_name}` - Người tạo phiếu
- [x] `{group_name}` - Loại phiếu thu
- [x] `{created_on}` - Ngày tạo
- [x] `{counted}` - Hạch toán KQKD
- [x] `{customer_debt_before_create_receipt}` - Nợ KH trước khi tạo phiếu
- [x] `{customer_debt_before_create_receipt_text}` - Nợ KH trước khi tạo phiếu bằng chữ
- [x] `{customer_debt_after_create_receipt}` - Nợ KH sau khi tạo phiếu
- [x] `{customer_debt_after_create_receipt_text}` - Nợ KH sau khi tạo phiếu bằng chữ
- [x] `{supplier_debt_before_create_receipt}` - Nợ NCC trước khi tạo phiếu
- [x] `{supplier_debt_before_create_receipt_text}` - Nợ NCC trước khi tạo phiếu bằng chữ
- [x] `{supplier_debt_after_create_receipt}` - Nợ NCC sau khi tạo phiếu
- [x] `{supplier_debt_after_create_receipt_text}` - Nợ NCC sau khi tạo phiếu bằng chữ
- [x] `{issued_on}` - Ngày ghi nhận
- [x] `{object_address}` - Địa chỉ người nộp
- [x] `{amount}` - Số tiền
- [x] `{reference}` - Tham chiếu
- [x] `{issued_on_time}` - Thời gian ghi nhận
- [x] `{payment_method_name}` - Phương thức thanh toán
- [x] `{object_type}` - Loại người nộp
- [x] `{document_root_code}` - Chứng từ gốc
- [x] `{supplier_debt}` - Nợ nhà cung cấp hiện tại
- [x] `{supplier_debt_text}` - Nợ nhà cung cấp hiện tại bằng chữ
- [x] `{supplier_debt_prev}` - Nợ cũ nhà cung cấp
- [x] `{supplier_debt_prev_text}` - Nợ cũ nhà cung cấp bằng chữ
- [x] `{customer_debt}` - Nợ khách hàng hiện tại
- [x] `{customer_debt_text}` - Nợ khách hàng hiện tại bằng chữ
- [x] `{customer_debt_prev}` - Nợ cũ khách hàng
- [x] `{customer_debt_prev_text}` - Nợ cũ khách hàng bằng chữ

## Payment (`payment`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin
- [x] `{payment_voucher_code}` - Mã
- [x] `{object_name}` - Tên người nhận
- [x] `{object_phone_number}` - SĐT người nhận
- [x] `{total_text}` - Số tiền bằng chữ
- [x] `{note}` - Ghi chú
- [x] `{account_name}` - Người tạo phiếu
- [x] `{group_name}` - Loại phiếu chi
- [x] `{created_on}` - Ngày tạo
- [x] `{counted}` - Hạch toán KQKD
- [x] `{customer_debt_before_create_payment}` - Nợ KH trước khi tạo phiếu
- [x] `{customer_debt_before_create_payment_text}` - Nợ KH trước khi tạo phiếu bằng chữ
- [x] `{customer_debt_after_create_payment}` - Nợ KH sau khi tạo phiếu
- [x] `{customer_debt_after_create_payment_text}` - Nợ KH sau khi tạo phiếu bằng chữ
- [x] `{supplier_debt_before_create_payment}` - Nợ NCC trước khi tạo phiếu
- [x] `{supplier_debt_before_create_payment_text}` - Nợ NCC trước khi tạo phiếu bằng chữ
- [x] `{supplier_debt_after_create_payment}` - Nợ NCC sau khi tạo phiếu
- [x] `{supplier_debt_after_create_payment_text}` - Nợ NCC sau khi tạo phiếu bằng chữ
- [x] `{issued_on}` - Ngày ghi nhận
- [x] `{object_address}` - Địa chỉ người nhận
- [x] `{amount}` - Số tiền
- [x] `{reference}` - Tham chiếu
- [x] `{issued_on_time}` - Thời gian ghi nhận
- [x] `{payment_method_name}` - Phương thức thanh toán
- [x] `{object_type}` - Loại người nhận
- [x] `{document_root_code}` - Chứng từ gốc
- [x] `{supplier_debt}` - Nợ nhà cung cấp hiện tại
- [x] `{supplier_debt_text}` - Nợ nhà cung cấp hiện tại bằng chữ
- [x] `{supplier_debt_prev}` - Nợ cũ nhà cung cấp
- [x] `{supplier_debt_prev_text}` - Nợ cũ nhà cung cấp bằng chữ
- [x] `{customer_debt}` - Nợ khách hàng hiện tại
- [x] `{customer_debt_text}` - Nợ khách hàng hiện tại bằng chữ
- [x] `{customer_debt_prev}` - Nợ cũ khách hàng
- [x] `{customer_debt_prev_text}` - Nợ cũ khách hàng bằng chữ

## Warranty (`warranty`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin phiếu bảo hành
- [x] `{account_name}` - Tên nhân viên tạo
- [x] `{warranty_card_code}` - Mã phiếu bảo hành
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{created_on}` - Ngày tạo
- [x] `{status}` - Trạng thái
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_address1}` - Địa chỉ khách hàng
- [x] `{customer_group}` - Nhóm khách hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{claim_status}` - Trạng thái yêu cầu
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_variant_sku}` - Mã SKU
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{serials}` - Mã serial
- [x] `{term_name}` - Tên chính sách bảo hành
- [x] `{term_number}` - Thời hạn bảo hành
- [x] `{warranty_period_days}` - Thời hạn bảo hành quy ra ngày
- [x] `{start_date}` - Ngày bắt đầu
- [x] `{end_date}` - Ngày hết hạn

## Supplier Return (`supplier-return`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin hoàn trả
- [x] `{supplier_name}` - Tên nhà cung cấp
- [x] `{supplier_code}` - Mã nhà cung cấp
- [x] `{supplier_address1}` - Địa chỉ nhà cung cấp
- [x] `{account_name}` - Tên nhân viên tạo
- [x] `{created_on}` - Ngày tạo
- [x] `{note}` - Lý do hoàn trả
- [x] `{supplier_phone_number}` - SĐT nhà cung cấp
- [x] `{purchase_order_code}` - Mã đơn nhập hàng
- [x] `{refund_code}` - Mã phiếu hoàn trả
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{reference}` - Tham chiếu
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_sku}` - Mã SKU
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_price_after_discount}` - Giá sau chiết khấu trên 1 sản phẩm
- [x] `{tax_lines_rate}` - Mức thuế sản phẩm
- [x] `{lots_number_code2}` - Mã lô - Số lượng trả
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng trả
- [x] `{line_product_name}` - Tên hàng
- [x] `{line_variant_name}` - Tên phiên bản
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_amount}` - Thành tiền
- [x] `{serials}` - Serial
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_amount_none_discount}` - Tiền hàng (Giá * SL)
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount}` - Giá trị hàng trả
- [x] `{total_tax}` - Tổng thuế
- [x] `{total_landed_costs}` - Chi phí hoàn lại
- [x] `{transaction_refund_method_name}` - Tên PTTT
- [x] `{total_discounts}` - Chiết khấu đơn
- [x] `{total_price}` - Tổng giá trị hàng trả
- [x] `{discrepancy_price}` - Tổng giá trị hàng trả điều chỉnh
- [x] `{discrepancy_reason}` - Lý do giảm trừ
- [x] `{transaction_refund_amount}` - Tổng tiền NCC hoàn lại
- [x] `{transaction_refund_method_amount}` - Giá trị PTTT

## Complaint (`complaint`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_email}` - Email cửa hàng
### Thông tin phiếu
- [x] `{complaint_code}` - Mã phiếu khiếu nại
- [x] `{created_on}` - Ngày tạo
- [x] `{created_on_time}` - Thời gian tạo
### Thông tin khách hàng
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_code}` - Mã khách hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_email}` - Email khách hàng
- [x] `{customer_address}` - Địa chỉ khách hàng
### Đơn hàng liên quan
- [x] `{order_code}` - Mã đơn hàng
- [x] `{order_date}` - Ngày đặt hàng
### Nội dung khiếu nại
- [x] `{complaint_type}` - Loại khiếu nại
- [x] `{complaint_description}` - Mô tả vấn đề
- [x] `{customer_request}` - Yêu cầu của khách hàng
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant}` - Phiên bản sản phẩm
- [x] `{line_variant_code}` - Mã sản phẩm
### Xử lý khiếu nại
- [x] `{complaint_status}` - Trạng thái xử lý
- [x] `{resolution}` - Phương án xử lý
- [x] `{assignee_name}` - Người xử lý
- [x] `{resolved_on}` - Ngày hoàn thành
- [x] `{complaint_note}` - Ghi chú
### Người tạo
- [x] `{account_name}` - Người tạo phiếu

## Penalty (`penalty`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
### Thông tin phiếu
- [x] `{penalty_code}` - Mã phiếu phạt
- [x] `{created_on}` - Ngày lập
- [x] `{created_on_time}` - Thời gian lập
### Thông tin nhân viên
- [x] `{employee_name}` - Họ tên nhân viên
- [x] `{employee_code}` - Mã nhân viên
- [x] `{department_name}` - Bộ phận
- [x] `{position_name}` - Chức vụ
### Nội dung vi phạm
- [x] `{violation_type}` - Loại vi phạm
- [x] `{violation_date}` - Ngày vi phạm
- [x] `{violation_description}` - Mô tả vi phạm
- [x] `{evidence}` - Bằng chứng
- [x] `{violation_count}` - Lần vi phạm thứ
### Hình thức xử phạt
- [x] `{penalty_type}` - Hình thức phạt
- [x] `{penalty_amount}` - Số tiền phạt
- [x] `{penalty_amount_text}` - Số tiền phạt bằng chữ
- [x] `{penalty_note}` - Ghi chú
### Người lập
- [x] `{account_name}` - Người lập phiếu

## Handover (`handover`)
### Thông tin cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_phone_number}` - SĐT cửa hàng
### Thông tin
- [x] `{hand_over_code}` - Mã phiếu
- [x] `{shipping_provider_name}` - Đối tác giao hàng
- [x] `{service_name}` - Dịch vụ
- [x] `{total_cod}` - Tổng tiền thu hộ
- [x] `{order_code}` - Mã đơn hàng
- [x] `{shipping_name}` - Tên người nhận đơn
- [x] `{shipping_phone}` - Số điện thoại người nhận
- [x] `{shipping_phone_hide}` - Số điện thoại người nhận - ẩn 4 số giữa
- [x] `{printed_on}` - Ngày in phiếu
- [x] `{freight_amount}` - Phí trả shipper
- [x] `{district}` - Quận/Huyện giao đến
- [x] `{quantity}` - Số lượng đơn
- [x] `{current_account_name}` - Tên nhân viên
- [x] `{shipment_code}` - Mã vận đơn
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{cod}` - Tiền thu hộ
- [x] `{note}` - Ghi chú
- [x] `{city}` - Tỉnh/Thành phố giao
- [x] `{freight_payer}` - Người trả phí
- [x] `{total_freight_amount}` - Tổng phí trả shipper

## Import Order (`don-nhap-hang`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn nhập
- [x] `{purchase_order_code}` - Mã đơn nhập
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{received_on}` - Ngày nhận
- [x] `{received_on_time}` - Thời gian nhận
- [x] `{due_on}` - Ngày hẹn giao
- [x] `{supplier_name}` - Tên NCC
- [x] `{supplier_code}` - Mã NCC
- [x] `{supplier_phone}` - SĐT NCC
- [x] `{supplier_email}` - Email NCC
- [x] `{supplier_address}` - Địa chỉ NCC
- [x] `{billing_address}` - Địa chỉ giao hóa đơn
- [x] `{supplier_debt_text}` - Nợ NCC bằng chữ
- [x] `{supplier_debt_prev_text}` - Nợ cũ NCC bằng chữ
- [x] `{weight_g}` - Tổng khối lượng đơn nhập hàng (g)
- [x] `{weight_kg}` - Tổng khối lượng đơn nhập hàng (kg)
- [x] `{tags}` - Tags
- [x] `{total_transaction_amount}` - Tổng tiền đã thanh toán
- [x] `{total_remain}` - Tổng tiền còn phải trả
- [x] `{created_on}` - Ngày tạo
- [x] `{modified_on_time}` - Thời gian cập nhật
- [x] `{reference}` - Tham chiếu
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{due_on_time}` - Thời gian hẹn giao
- [x] `{status}` - Trạng thái
- [x] `{received_status}` - Trạng thái nhập kho
- [x] `{financial_status}` - Trạng thái thanh toán
- [x] `{refund_status}` - Trạng thái hoàn hàng
- [x] `{refund_transaction_status}` - Trạng thái hoàn tiền
- [x] `{supplier_debt}` - Nợ nhà cung cấp
- [x] `{supplier_debt_prev}` - Nợ cũ NCC
- [x] `{account_name}` - Nhân viên tạo
- [x] `{assignee_name}` - Nhân viên phụ trách NCC
- [x] `{note}` - Ghi chú
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_tax_rate}` - Thuế (%)
- [x] `{line_weight_kg}` - Tổng khối lượng sản phẩm (kg)
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
- [x] `{line_tax_exclude}` - Giá chưa bao gồm thuế
- [x] `{line_price_after_discount}` - Giá nhập sau chiết khấu
- [x] `{line_title}` - Tên hàng
- [x] `{line_tax}` - Loại thuế theo từng mặt hàng
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá nhập
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_code}` - Mã phiên bản sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_category}` - Loại sản phẩm
- [x] `{line_tax_amount}` - Thuế (giá trị)
- [x] `{serials}` - Serial
- [x] `{line_weight_g}` - Tổng khối lượng sản phẩm (g)
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX - NHH - Số lượng bán sản phẩm
- [x] `{line_tax_included}` - Giá đã bao gồm thuế
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_tax}` - Tổng thuế
- [x] `{total_amount_transaction}` - Tổng tiền trả lại
- [x] `{total_discounts_value}` - Chiết khấu đơn nhập (giá trị)
- [x] `{total_amount_text}` - Tổng tiền bằng chữ
- [x] `{total_landed_costs}` - Tổng chi phí
- [x] `{total_amount_before_tax}` - Tổng tiền trước thuế
- [x] `{payments}` - Tên phương thức thanh toán: Số tiền thanh toán
- [x] `{product_discount}` - Chiết khấu sản phẩm
- [x] `{total_price}` - Tổng tiền
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_discounts_rate}` - Chiết khấu đơn nhập (%)
- [x] `{total_discounts}` - Chiết khấu đơn nhập
- [x] `{total_extra_tax}` - Tổng thuế phải trả thêm
- [x] `{total_tax_included_line}` - Tổng thuế đã bao gồm trong sản phẩm
- [x] `{total_amount_after_tax}` - Tổng tiền sau thuế

## Return Order (`don-tra-hang`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{order_return_code}` - Mã đơn trả
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đơn hàng
- [x] `{customer_name}` - Tên khách hàng
- [x] `{order_code}` - Mã đơn hàng
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{note}` - Ghi chú
- [x] `{reason_return}` - Lý do
- [x] `{refund_status}` - Trạng thái hoàn tiền
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_group}` - Nhóm khách hàng
- [x] `{billing_address}` - Địa chỉ gửi hóa đơn
- [x] `{created_on}` - Ngày tạo
- [x] `{received_on}` - Ngày nhận
- [x] `{reference}` - Tham chiếu
- [x] `{status}` - Trạng thái đơn trả
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_variant_code}` - Mã phiên bản
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_product_name}` - Tên hàng
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_variant}` - Tên phiên bản
- [x] `{line_amount}` - Thành tiền
- [x] `{serials}` - Serial
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount}` - Tổng tiền trả khách

## Refund Confirmation (`phieu-xac-nhan-hoan`)
### Thông tin cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_phone_number}` - SĐT cửa hàng
### Thông tin
- [x] `{hand_over_code}` - Mã phiếu
- [x] `{shipping_provider_name}` - Đối tác giao hàng
- [x] `{service_name}` - Dịch vụ
- [x] `{total_cod}` - Tổng tiền thu hộ
- [x] `{order_code}` - Mã đơn hàng
- [x] `{shipping_name}` - Tên người nhận đơn
- [x] `{shipping_phone}` - Số điện thoại người nhận
- [x] `{shipping_phone_hide}` - Số điện thoại người nhận - ẩn 4 số giữa
- [x] `{printed_on}` - Ngày in phiếu
- [x] `{district}` - Quận/Huyện giao đến
- [x] `{quantity}` - Số lượng đơn
- [x] `{current_account_name}` - Tên nhân viên
- [x] `{shipment_code}` - Mã vận đơn
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{cod}` - Tiền thu hộ
- [x] `{note}` - Ghi chú
- [x] `{city}` - Tỉnh/Thành phố giao

## Sales Summary (`phieu-tong-ket-ban-hang`)
### Thông tin
- [x] `{location_name}` - Tên chi nhánh
- [x] `{account_name}` - Tên nhân viên
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_phone_number}` - Số ĐT cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{date_print}` - Ngày in
- [x] `{time_print}` - Thời gian in
- [x] `{time_filter}` - Ngày lọc
- [x] `{source_name}` - Nguồn bán hàng
- [x] `{total_quantity_order_finished}` - Số đơn hàng bán ra
- [x] `{total_quantity_line_item_fulfillment}` - Số lượng hàng bán ra
- [x] `{total_quantity_line_item_return}` - Số lượng hàng trả lại
- [x] `{total_line_amount}` - Doanh thu
- [x] `{total_order_payment}` - Khách thanh toán
- [x] `{total_order_return_payment}` - Hoàn lại khách
- [x] `{total_real_receipt}` - Thực thu
- [x] `{real_receipt_cash}` - Thực thu tiền mặt
- [x] `{real_receipt_transfer}` - Thực thu chuyển khoản
- [x] `{real_receipt_mpos}` - Thực thu quẹt thẻ
- [x] `{real_receipt_cod}` - Thực thu COD
- [x] `{real_receipt_online}` - Thực thu online
- [x] `{debt}` - Nợ còn lại phải thu
- [x] `{receipt_in_day}` - Tổng thu
- [x] `{receipt_cash}` - Tổng thu tiền mặt
- [x] `{receipt_transfer}` - Tổng thu chuyển khoản
- [x] `{receipt_mpos}` - Tổng thu quẹt thẻ
- [x] `{receipt_cod}` - Tổng thu COD
- [x] `{receipt_online}` - Tổng thu online
- [x] `{payment_in_day}` - Tổng chi
- [x] `{payment_cash}` - Tổng chi tiền mặt
- [x] `{payment_transfer}` - Tổng chi chuyển khoản
- [x] `{payment_mpos}` - Tổng chi quẹt thẻ
- [x] `{stt_order_finish}` - STT đơn hàng bán
- [x] `{order_code}` - Mã đơn
- [x] `{amount_order_finished}` - Tiền hàng
- [x] `{discount_order_finished}` - Chiết khấu
- [x] `{tax_order_finished}` - Thuế
- [x] `{total_order_finished}` - Doanh thu
- [x] `{stt_item_fulfillment}` - STT đơn hàng bán
- [x] `{sku_fulfillment}` - Mã SKU hàng bán
- [x] `{variant_name_fulfillment}` - Tên hàng bán
- [x] `{quantity_item_fulfilment}` - SL hàng bán
- [x] `{amount_item_fulfilment}` - Giá trị hàng bán
- [x] `{stt_item_return}` - STT hàng trả lại
- [x] `{sku_return}` - Mã SKU hàng trả
- [x] `{variant_name_return}` - Tên hàng trả
- [x] `{quantity_item_return}` - SL hàng trả
- [x] `{amount_item_return}` - Giá trị hàng trả
- [x] `{payment_method_name}` - Tên hình thức thanh toán
- [x] `{payment_method_amount}` - Giá trị thanh toán theo hình thức

## Packing Guide (`phieu-huong-dan-dong-goi`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
### Thông tin phiếu hướng dẫn đóng gói
- [x] `{created_on}` - Ngày tạo
- [x] `{list_order_code}` - Danh sách đơn hàng áp dụng
- [x] `{account_phone}` - SĐT nhân viên phụ trách
- [x] `{created_on_time}` - Thời gian tạo
- [x] `{account_name}` - Tên nhân viên phụ trách
- [x] `{account_email}` - Email nhân viên phụ trách
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_variant_sku}` - Mã phiên bản sản phẩm
- [x] `{line_variant_barcode}` - Mã vạch phiên bản sản phẩm
- [x] `{line_unit}` - Đơn vị tính
- [x] `{note_of_store}` - Ghi chú
- [x] `{line_variant_qrcode}` - Mã QR phiên bản sản phẩm
- [x] `{line_brand}` - Thương hiệu sản phẩm
- [x] `{line_image}` - Ảnh phiên bản sản phẩm
- [x] `{location_name}` - Chi nhánh
- [x] `{composite_details}` - Thành phần combo
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_variant_options}` - Thuộc tính sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{bin_location}` - Điểm lưu kho
- [x] `{line_category}` - Loại sản phẩm
- [x] `{line_product_description}` - Mô tả sản phẩm
- [x] `{lineitem_note}` - Ghi chú sản phẩm
### Tổng giá trị
- [x] `{total}` - Tổng tiền hàng
- [x] `{total_product_quantity}` - Tổng số mặt hàng
- [x] `{order_note}` - Ghi chú đơn hàng

## Packing Request (`phieu-yeu-cau-dong-goi`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{store_fax}` - Số Fax
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin đóng gói
- [x] `{code}` - Mã đóng gói
- [x] `{account_name}` - Nhân viên yêu đóng gói
- [x] `{packed_processing_account_name}` - Nhân viên xác nhận đóng gói
- [x] `{cancel_account_name}` - Nhân viên hủy đóng gói
- [x] `{assignee_name}` - Nhân viên được gán cho đóng gói
- [x] `{shipping_address}` - Địa chỉ giao hàng
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_phone_number_hide}` - SĐT khách hàng - ẩn 4 số giữa
- [x] `{customer_email}` - Email khách hàng
- [x] `{status}` - Trạng thái đóng gói
- [x] `{bar_code(code)}` - Mã đóng gói dạng mã vạch
- [x] `{created_on}` - Ngày tạo đóng gói
- [x] `{created_on_time}` - Thời gian tạo đóng gói
- [x] `{packed_on}` - Ngày xác nhận đóng gói
- [x] `{packed_on_time}` - Thời gian xác nhận đóng gói
- [x] `{cancel_date}` - Ngày hủy đóng gói
- [x] `{ship_on_min}` - Ngày hẹn giao hàng từ
- [x] `{ship_on_max}` - Ngày hẹn giao hàng đến
- [x] `{order_code}` - Mã đơn hàng
- [x] `{bar_code(order_code)}` - Mã đơn hàng dạng mã vạch
- [x] `{order_note}` - Ghi chú đơn hàng
### Thông tin giỏ hàng
- [x] `{line_stt}` - STT
- [x] `{line_unit}` - Đơn vị tính
- [x] `{line_discount_rate}` - Chiết khấu sản phẩm %
- [x] `{line_note}` - Ghi chú sản phẩm
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_tax_rate}` - % Thuế
- [x] `{line_variant}` - Tên phiên bản sản phẩm
- [x] `{lots_number_code2}` - Mã lô - Số lượng bán sản phẩm
- [x] `{lots_number_code4}` - Mã lô - NSX -NHH - Số lượng bán sản phẩm
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_tax}` - Loại thuế theo từng mặt hàng
- [x] `{line_discount_amount}` - Chiết khấu sản phẩm
- [x] `{line_price}` - Giá bán
- [x] `{line_amount}` - Thành tiền
- [x] `{line_variant_code}` - Mã sản phẩm
- [x] `{lots_number_code1}` - Mã lô sản phẩm
- [x] `{lots_number_code3}` - Mã lô - NSX - NHH sản phẩm
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_tax}` - Tổng thuế
- [x] `{fulfillment_discount}` - Chiết khấu
- [x] `{total}` - Tổng tiền hàng

## Warranty Request (`phieu-yeu-cau-bao-hanh`)
### Thông tin cửa hàng
- [x] `{store_logo}` - Logo cửa hàng
- [x] `{store_name}` - Tên cửa hàng
- [x] `{store_phone_number}` - SĐT cửa hàng
- [x] `{store_address}` - Địa chỉ cửa hàng
- [x] `{store_email}` - Email cửa hàng
- [x] `{location_name}` - Tên chi nhánh
- [x] `{location_address}` - Địa chỉ chi nhánh
- [x] `{store_province}` - Tỉnh thành (cửa hàng)
- [x] `{location_province}` - Tỉnh thành (chi nhánh)
### Thông tin phiếu yêu cầu
- [x] `{account_name}` - Tên nhân viên tạo
- [x] `{warranty_claim_card_code}` - Mã phiếu yêu cầu bảo hành
- [x] `{modified_on}` - Ngày cập nhật
- [x] `{created_on}` - Ngày tạo
- [x] `{reference}` - Ghi chú
- [x] `{customer_name}` - Tên khách hàng
- [x] `{customer_phone_number}` - SĐT khách hàng
- [x] `{customer_address1}` - Địa chỉ khách hàng
- [x] `{customer_group}` - Nhóm khách hàng
- [x] `{tag}` - Thẻ tag
### Thông tin sản phẩm
- [x] `{line_stt}` - STT
- [x] `{line_product_name}` - Tên sản phẩm
- [x] `{line_variant_name}` - Tên phiên bản sản phẩm
- [x] `{line_variant_sku}` - Mã SKU
- [x] `{line_variant_barcode}` - Mã Barcode
- [x] `{serials}` - Mã serial
- [x] `{warranty_card_code}` - Mã phiếu bảo hành
- [x] `{line_quantity}` - Số lượng sản phẩm
- [x] `{line_type}` - Loại yêu cầu
- [x] `{line_received_on}` - Ngày hẹn trả
- [x] `{line_status}` - Trạng thái
- [x] `{line_expense_title}` - Tên chi phí/ dịch vụ
- [x] `{line_expense_amount}` - Giá trị chi phí/ dịch vụ
- [x] `{line_expense_total_amount}` - Tổng chi phí trên sản phẩm
### Tổng giá trị
- [x] `{total_quantity}` - Tổng số lượng
- [x] `{total_amount}` - Tổng tiền khách trả
## Cost Adjustment (\cost-adjustment\)
### Th�ng tin c?a h�ng
- [x] \{location_name}\ - T�n chi nh�nh
- [x] \{location_address}\ - �?a ch? chi nh�nh
- [x] \{location_province}\ - T?nh th�nh (chi nh�nh)
- [x] \{store_province}\ - T?nh th�nh (c?a h�ng)
### Th�ng tin phi?u
- [x] \{code}\ - M� phi?u
- [x] \{adjustment_code}\ - M� phi?u di?u ch?nh
- [x] \{created_on}\ - Ng�y t?o
- [x] \{created_on_time}\ - Th?i gian t?o
- [x] \{modified_on}\ - Ng�y c?p nh?t
- [x] \{confirmed_on}\ - Ng�y x�c nh?n
- [x] \{cancelled_on}\ - Ng�y h?y
- [x] \{account_name}\ - Ngu?i t?o
- [x] \{confirmed_by}\ - Ngu?i x�c nh?n
- [x] \{status}\ - Tr?ng th�i
- [x] \{reason}\ - L� do
- [x] \{note}\ - Ghi ch�
### Th�ng tin s?n ph?m
- [x] \{line_stt}\ - STT
- [x] \{line_variant_code}\ - M� phi�n b?n
- [x] \{line_product_name}\ - T�n s?n ph?m
- [x] \{line_variant_name}\ - T�n phi�n b?n
- [x] \{line_variant_barcode}\ - M� v?ch
- [x] \{line_unit}\ - �on v? t�nh
- [x] \{line_old_price}\ - Gi� v?n cu
- [x] \{line_new_price}\ - Gi� v?n m?i
- [x] \{line_difference}\ - Ch�nh l?ch don gi�
- [x] \{line_on_hand}\ - T?n kho
- [x] \{line_total_difference}\ - T?ng gi� tr? ch�nh l?ch
- [x] \{line_reason}\ - L� do chi ti?t
- [x] \{line_brand}\ - Thuong hi?u
- [x] \{line_category}\ - Danh m?c
- [x] \{line_variant_options}\ - Thu?c t�nh
### T?ng gi� tr?
- [x] \{total_items}\ - T?ng s? m?t h�ng
- [x] \{total_difference}\ - T?ng ch�nh l?ch
- [x] \{total_increase}\ - T?ng tang
- [x] \{total_decrease}\ - T?ng gi?m

