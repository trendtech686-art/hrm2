/**
 * Formula helpers dùng cho UI formula editor.
 *
 * Expose danh sách biến, hàm và validator cho admin biết có gì dùng được.
 * Client dùng để: autocomplete, preview kết quả, validate realtime.
 */

export interface FormulaVariable {
  name: string;
  label: string;
  example: number;
  description: string;
  category: 'base' | 'attendance' | 'ot' | 'rate' | 'allowance';
}

export interface FormulaFunction {
  name: string;
  signature: string;
  description: string;
  example: string;
}

/**
 * Biến hợp lệ trong formula editor. Phải khớp CHÍNH XÁC với
 * `safeContext` trong `lib/payroll-engine.ts` (safeEvaluateFormula).
 */
export const FORMULA_VARIABLES: readonly FormulaVariable[] = [
  { name: 'baseSalary', label: 'Lương cơ bản', example: 15_000_000, description: 'Lương hợp đồng của nhân viên', category: 'base' },
  { name: 'workDays', label: 'Số ngày công', example: 22, description: 'Số ngày thực tế đi làm trong tháng', category: 'attendance' },
  { name: 'standardWorkDays', label: 'Số ngày công chuẩn', example: 26, description: 'Ngày công chuẩn của tháng (cài đặt)', category: 'attendance' },
  { name: 'leaveDays', label: 'Ngày nghỉ phép', example: 1, description: 'Số ngày nghỉ phép có lương', category: 'attendance' },
  { name: 'absentDays', label: 'Ngày vắng không phép', example: 0, description: 'Số ngày nghỉ không phép', category: 'attendance' },
  { name: 'lateArrivals', label: 'Số lần đi trễ', example: 0, description: 'Tổng số lần check-in trễ giờ', category: 'attendance' },
  { name: 'earlyDepartures', label: 'Số lần về sớm', example: 0, description: 'Tổng số lần check-out sớm', category: 'attendance' },
  { name: 'otHours', label: 'Tổng giờ OT', example: 8, description: 'Tổng giờ làm thêm trong tháng', category: 'ot' },
  { name: 'otHoursWeekday', label: 'Giờ OT ngày thường', example: 4, description: 'OT ngày thường', category: 'ot' },
  { name: 'otHoursWeekend', label: 'Giờ OT cuối tuần', example: 4, description: 'OT cuối tuần (hệ số khác)', category: 'ot' },
  { name: 'otHoursHoliday', label: 'Giờ OT ngày lễ', example: 0, description: 'OT ngày lễ (hệ số cao nhất)', category: 'ot' },
  { name: 'otPayWeekday', label: 'Tiền OT ngày thường', example: 520_000, description: 'Đã tính sẵn theo hệ số', category: 'ot' },
  { name: 'otPayWeekend', label: 'Tiền OT cuối tuần', example: 832_000, description: 'Đã tính sẵn theo hệ số', category: 'ot' },
  { name: 'otPayHoliday', label: 'Tiền OT ngày lễ', example: 0, description: 'Đã tính sẵn theo hệ số', category: 'ot' },
  { name: 'otPayTotal', label: 'Tổng tiền OT', example: 1_352_000, description: 'Tổng tiền OT tính theo quy định', category: 'ot' },
  { name: 'otHourlyRate', label: 'Đơn giá OT / giờ', example: 86_538, description: 'Đơn giá giờ OT (từ cài đặt)', category: 'rate' },
  { name: 'otRateWeekend', label: 'Hệ số OT cuối tuần', example: 2, description: 'Nhân với đơn giá OT', category: 'rate' },
  { name: 'otRateHoliday', label: 'Hệ số OT ngày lễ', example: 3, description: 'Nhân với đơn giá OT', category: 'rate' },
  { name: 'mealAllowancePerDay', label: 'Phụ cấp ăn / ngày', example: 30_000, description: 'Từ cài đặt, nhân với workDays', category: 'allowance' },
] as const;

/**
 * Hàm hợp lệ (được whitelisted trong engine).
 */
export const FORMULA_FUNCTIONS: readonly FormulaFunction[] = [
  { name: 'round', signature: 'round(x)', description: 'Làm tròn số nguyên gần nhất', example: 'round(baseSalary / 22)' },
  { name: 'floor', signature: 'floor(x)', description: 'Làm tròn xuống', example: 'floor(baseSalary * 0.05)' },
  { name: 'ceil', signature: 'ceil(x)', description: 'Làm tròn lên', example: 'ceil(baseSalary * 0.1)' },
  { name: 'min', signature: 'min(a, b, ...)', description: 'Số nhỏ nhất', example: 'min(baseSalary * 0.1, 5000000)' },
  { name: 'max', signature: 'max(a, b, ...)', description: 'Số lớn nhất', example: 'max(baseSalary * 0.05, 200000)' },
] as const;

export const FORMULA_VARIABLE_NAMES: readonly string[] = FORMULA_VARIABLES.map(v => v.name);
export const FORMULA_FUNCTION_NAMES: readonly string[] = FORMULA_FUNCTIONS.map(f => f.name);

/**
 * Validator cho formula — dùng trong client. Trả về:
 *  - ok: true/false
 *  - error: thông điệp ngắn (Tiếng Việt) nếu có
 *
 * Lưu ý: chỉ validate tĩnh (token, ký tự nguy hiểm). Engine server vẫn
 * phải chạy safeEvaluateFormula để eval thật sự.
 */
export function validateFormulaSyntax(formula: string): { ok: true } | { ok: false; error: string } {
  const src = formula.trim();
  if (!src) return { ok: false, error: 'Công thức trống' };

  // Chặn ký tự nguy hiểm (đồng bộ với engine)
  if (/[[\]{}\\;`$'"#@]/.test(src)) {
    return { ok: false, error: 'Chứa ký tự không được phép: [ ] { } \\ ; ` $ \' " # @' };
  }
  if (/\b(import|require|fetch|eval|Function|constructor|prototype|__proto__|globalThis|window|document|process|this|new|delete|typeof|void|in|of|class|yield|await|async|throw|try|catch|return)\b/.test(src)) {
    return { ok: false, error: 'Chứa từ khoá không được phép (import/eval/require/…)' };
  }
  if (/\./.test(src.replace(/\d+\.\d+/g, ''))) {
    return { ok: false, error: 'Không được dùng dấu chấm (property access)' };
  }

  const tokens = src.match(/\d+(\.\d+)?|[a-zA-Z_]\w*|[+\-*/%(),.?:!<>=&|]+|\s+/g);
  if (!tokens) return { ok: false, error: 'Không phân tích được công thức' };

  const allowedNames = new Set<string>([
    ...FORMULA_VARIABLE_NAMES,
    ...FORMULA_FUNCTION_NAMES,
  ]);

  const unknowns: string[] = [];
  for (const token of tokens) {
    if (/^[a-zA-Z_]/.test(token) && !allowedNames.has(token)) {
      unknowns.push(token);
    }
  }
  if (unknowns.length > 0) {
    const uniq = Array.from(new Set(unknowns));
    return { ok: false, error: `Biến/hàm không hợp lệ: ${uniq.join(', ')}` };
  }

  // Đếm ngoặc
  let parens = 0;
  for (const ch of src) {
    if (ch === '(') parens++;
    else if (ch === ')') parens--;
    if (parens < 0) return { ok: false, error: 'Sai ngoặc đơn' };
  }
  if (parens !== 0) return { ok: false, error: 'Thiếu ngoặc đóng' };

  return { ok: true };
}

/**
 * Evaluator CLIENT-SIDE cho preview. Cực kỳ bảo thủ — khớp với engine server.
 * Nếu lỗi trả về `null`.
 */
export function previewFormula(
  formula: string,
  context: Partial<Record<string, number>> = {},
): number | null {
  const validation = validateFormulaSyntax(formula);
  if (!validation.ok) return null;

  const safeContext: Record<string, unknown> = {
    // Defaults = example values
    ...Object.fromEntries(FORMULA_VARIABLES.map(v => [v.name, v.example])),
    // Override bằng context do user cung cấp
    ...context,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    min: Math.min,
    max: Math.max,
  };

  try {
    const keys = Object.keys(safeContext);
    const values = Object.values(safeContext);
    const fn = new Function(...keys, `"use strict"; return (${formula});`);
    const result = fn(...values);
    return typeof result === 'number' && !isNaN(result) && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}
