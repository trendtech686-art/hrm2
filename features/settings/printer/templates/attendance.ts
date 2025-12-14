/**
 * Attendance Template - Bảng chấm công
 * Mẫu in mặc định cho bảng chấm công
 * 
 * CHUẨN TEMPLATE v3 (2025-12-10):
 * - Dạng DỌC (portrait) - mỗi nhân viên 1 tờ A4
 * - Compact: Chia 2 nửa tháng theo chiều ngang
 * - Font nhỏ gọn, vừa 1 trang
 */

// Template cho BÁO CÁO CÁ NHÂN (mỗi nhân viên 1 trang)
export const ATTENDANCE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px; 
      line-height: 1.2;
      padding: 8mm;
    }
    @page { size: A4 portrait; margin: 8mm; }
    .page-break { page-break-after: always; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-info-container { flex: 1; }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 13px; 
      font-weight: bold; 
      text-align: center;
      margin: 8px 0 4px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 11px;
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .employee-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #f0f0f0;
      border-radius: 3px;
      font-size: 9px;
    }
    .info-group { display: flex; gap: 20px; }
    .info-item strong { font-weight: bold; }
    
    .legend {
      margin: 6px 0;
      font-size: 8px;
      color: #666;
    }
    .legend span { margin-right: 10px; }
    
    .tables-container {
      display: flex;
      gap: 8px;
    }
    .half-month {
      flex: 1;
    }
    .half-month h4 {
      font-size: 9px;
      text-align: center;
      margin-bottom: 4px;
      background: #333;
      color: white;
      padding: 3px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 8px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px 3px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 7px;
    }
    .col-day { width: 22px; }
    .col-dow { width: 22px; }
    .col-status { width: 28px; }
    .col-time { width: 38px; font-size: 7px; }
    
    .summary-section {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }
    .summary-box {
      flex: 1;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }
    .summary-box strong {
      font-size: 11px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 35px;
    }
    .signature-line {
      border-top: 1px dotted #333;
      padding-top: 3px;
      font-size: 8px;
    }
    
    .print-date {
      font-size: 8px;
      color: #666;
      text-align: right;
      margin-top: 10px;
    }
    
    @media print {
      body { padding: 5mm; }
    }
  </style>
</head>
<body>
  {{#line_items}}
  <div class="employee-page">
    <!-- Header -->
    <div class="header">
      <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
      <div class="store-info-container">
        <div class="store-name">{store_name}</div>
        <div class="store-info">{store_address} | ĐT: {store_phone_number}</div>
      </div>
    </div>

    <div class="title">BẢNG CHẤM CÔNG CÁ NHÂN</div>
    <div class="subtitle">Tháng {month_year}</div>

    <!-- Thông tin nhân viên -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>Mã NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ tên:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Phòng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="legend">
      <span>✓ Có mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ phép</span>
      <span>½ Nửa ngày</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối tháng -->
    <div class="tables-container">
      <!-- Nửa đầu tháng (1-15) -->
      <div class="half-month">
        <h4>Ngày 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{dow_1}</td><td>{day_1}</td><td>{checkin_1}</td><td>{checkout_1}</td></tr>
            <tr><td>2</td><td>{dow_2}</td><td>{day_2}</td><td>{checkin_2}</td><td>{checkout_2}</td></tr>
            <tr><td>3</td><td>{dow_3}</td><td>{day_3}</td><td>{checkin_3}</td><td>{checkout_3}</td></tr>
            <tr><td>4</td><td>{dow_4}</td><td>{day_4}</td><td>{checkin_4}</td><td>{checkout_4}</td></tr>
            <tr><td>5</td><td>{dow_5}</td><td>{day_5}</td><td>{checkin_5}</td><td>{checkout_5}</td></tr>
            <tr><td>6</td><td>{dow_6}</td><td>{day_6}</td><td>{checkin_6}</td><td>{checkout_6}</td></tr>
            <tr><td>7</td><td>{dow_7}</td><td>{day_7}</td><td>{checkin_7}</td><td>{checkout_7}</td></tr>
            <tr><td>8</td><td>{dow_8}</td><td>{day_8}</td><td>{checkin_8}</td><td>{checkout_8}</td></tr>
            <tr><td>9</td><td>{dow_9}</td><td>{day_9}</td><td>{checkin_9}</td><td>{checkout_9}</td></tr>
            <tr><td>10</td><td>{dow_10}</td><td>{day_10}</td><td>{checkin_10}</td><td>{checkout_10}</td></tr>
            <tr><td>11</td><td>{dow_11}</td><td>{day_11}</td><td>{checkin_11}</td><td>{checkout_11}</td></tr>
            <tr><td>12</td><td>{dow_12}</td><td>{day_12}</td><td>{checkin_12}</td><td>{checkout_12}</td></tr>
            <tr><td>13</td><td>{dow_13}</td><td>{day_13}</td><td>{checkin_13}</td><td>{checkout_13}</td></tr>
            <tr><td>14</td><td>{dow_14}</td><td>{day_14}</td><td>{checkin_14}</td><td>{checkout_14}</td></tr>
            <tr><td>15</td><td>{dow_15}</td><td>{day_15}</td><td>{checkin_15}</td><td>{checkout_15}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Nửa cuối tháng (16-31) -->
      <div class="half-month">
        <h4>Ngày 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>16</td><td>{dow_16}</td><td>{day_16}</td><td>{checkin_16}</td><td>{checkout_16}</td></tr>
            <tr><td>17</td><td>{dow_17}</td><td>{day_17}</td><td>{checkin_17}</td><td>{checkout_17}</td></tr>
            <tr><td>18</td><td>{dow_18}</td><td>{day_18}</td><td>{checkin_18}</td><td>{checkout_18}</td></tr>
            <tr><td>19</td><td>{dow_19}</td><td>{day_19}</td><td>{checkin_19}</td><td>{checkout_19}</td></tr>
            <tr><td>20</td><td>{dow_20}</td><td>{day_20}</td><td>{checkin_20}</td><td>{checkout_20}</td></tr>
            <tr><td>21</td><td>{dow_21}</td><td>{day_21}</td><td>{checkin_21}</td><td>{checkout_21}</td></tr>
            <tr><td>22</td><td>{dow_22}</td><td>{day_22}</td><td>{checkin_22}</td><td>{checkout_22}</td></tr>
            <tr><td>23</td><td>{dow_23}</td><td>{day_23}</td><td>{checkin_23}</td><td>{checkout_23}</td></tr>
            <tr><td>24</td><td>{dow_24}</td><td>{day_24}</td><td>{checkin_24}</td><td>{checkout_24}</td></tr>
            <tr><td>25</td><td>{dow_25}</td><td>{day_25}</td><td>{checkin_25}</td><td>{checkout_25}</td></tr>
            <tr><td>26</td><td>{dow_26}</td><td>{day_26}</td><td>{checkin_26}</td><td>{checkout_26}</td></tr>
            <tr><td>27</td><td>{dow_27}</td><td>{day_27}</td><td>{checkin_27}</td><td>{checkout_27}</td></tr>
            <tr><td>28</td><td>{dow_28}</td><td>{day_28}</td><td>{checkin_28}</td><td>{checkout_28}</td></tr>
            <tr><td>29</td><td>{dow_29}</td><td>{day_29}</td><td>{checkin_29}</td><td>{checkout_29}</td></tr>
            <tr><td>30</td><td>{dow_30}</td><td>{day_30}</td><td>{checkin_30}</td><td>{checkout_30}</td></tr>
            <tr><td>31</td><td>{dow_31}</td><td>{day_31}</td><td>{checkin_31}</td><td>{checkout_31}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tổng kết -->
    <div class="summary-section">
      <div class="summary-box"><span>Ngày công:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ phép:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ làm thêm:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ ký -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nhân viên</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng phòng</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Giám đốc</div>
        <div class="signature-line">(Ký, đóng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ngày in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`;


// ============================================
// Template cho BÁO CÁO TỔNG HỢP (nhiều nhân viên - dạng ngang)
// ============================================
export const ATTENDANCE_SUMMARY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 8px; 
      line-height: 1.2;
      padding: 5mm;
    }
    @page { size: A4 landscape; margin: 5mm; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 14px; 
      font-weight: bold; 
      text-align: center;
      margin: 5px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 10px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .legend {
      font-size: 7px;
      margin-bottom: 5px;
      color: #666;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 7px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .col-name { 
      text-align: left; 
      padding-left: 3px !important;
      min-width: 80px;
    }
    
    .summary {
      margin-top: 8px;
      font-size: 9px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 25%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 30px;
    }
    
    .print-date {
      font-size: 7px;
      color: #666;
      text-align: right;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
    <div>
      <div class="store-name">{store_name}</div>
      <div class="store-info">{store_address}</div>
    </div>
  </div>

  <div class="title">BẢNG CHẤM CÔNG TỔNG HỢP</div>
  <div class="subtitle">Tháng {month_year} | Phòng ban: {department_name}</div>

  <div class="legend">
    ✓ = Có mặt | X = Vắng | P = Nghỉ phép | ½ = Nửa ngày | L = Nghỉ lễ | - = Cuối tuần
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Mã NV</th>
        <th rowspan="2" class="col-name">Họ và tên</th>
        <th colspan="4">Tổng kết</th>
        <th colspan="31">Ngày trong tháng</th>
      </tr>
      <tr>
        <th>Công</th>
        <th>Phép</th>
        <th>Vắng</th>
        <th>OT</th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
        <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th>
        <th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th>
        <th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{line_index}</td>
        <td>{employee_code}</td>
        <td class="col-name">{employee_name}</td>
        <td>{work_days}</td>
        <td>{leave_days}</td>
        <td>{absent_days}</td>
        <td>{ot_hours}</td>
        <td>{day_1}</td><td>{day_2}</td><td>{day_3}</td><td>{day_4}</td><td>{day_5}</td><td>{day_6}</td><td>{day_7}</td>
        <td>{day_8}</td><td>{day_9}</td><td>{day_10}</td><td>{day_11}</td><td>{day_12}</td><td>{day_13}</td><td>{day_14}</td><td>{day_15}</td>
        <td>{day_16}</td><td>{day_17}</td><td>{day_18}</td><td>{day_19}</td><td>{day_20}</td><td>{day_21}</td><td>{day_22}</td>
        <td>{day_23}</td><td>{day_24}</td><td>{day_25}</td><td>{day_26}</td><td>{day_27}</td><td>{day_28}</td><td>{day_29}</td><td>{day_30}</td><td>{day_31}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>

  <div class="summary">
    <strong>Tổng cộng:</strong> {total_employees} nhân viên | 
    {total_work_days} công | {total_leave_days} phép | {total_absent_days} vắng | {total_ot_hours}h OT
  </div>

  <div class="footer">
    <div class="signature-box">
      <div class="signature-title">Người lập</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Kế toán</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Trưởng phòng</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Giám đốc</div>
    </div>
  </div>

  <div class="print-date">Ngày in: {print_date}</div>
</body>
</html>`;
