module.exports = [
"[project]/features/attendance/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAttendanceStore",
    ()=>useAttendanceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
// API sync helper
async function syncToAPI(action, data) {
    try {
        const endpoint = '/api/attendance';
        const method = action === 'save' ? 'POST' : 'PATCH';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                ...data
            })
        });
        if (!response.ok) {
            console.error(`[Attendance API] ${action} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Attendance API] ${action} error:`, error);
        return false;
    }
}
async function fetchFromAPI(monthKey) {
    try {
        const [year, month] = monthKey.split('-');
        const fromDate = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const toDate = `${year}-${month}-${lastDay}`;
        // Attendance is filtered by month, so 500 records should cover most cases
        const response = await fetch(`/api/attendance?fromDate=${fromDate}&toDate=${toDate}&limit=500`);
        if (!response.ok) return null;
        const json = await response.json();
        return json.data || null;
    } catch (error) {
        console.error('[Attendance API] fetch error:', error);
        return null;
    }
}
const useAttendanceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        lockedMonths: {},
        initialized: false,
        lockMonth: (monthYear)=>{
            set((state)=>({
                    lockedMonths: {
                        ...state.lockedMonths,
                        [monthYear]: true
                    }
                }));
            // Sync to API
            syncToAPI('lock', {
                monthYear
            }).catch(console.error);
        },
        unlockMonth: (monthYear)=>{
            set((state)=>{
                if (!state.lockedMonths[monthYear]) {
                    return state;
                }
                const nextLocked = {
                    ...state.lockedMonths
                };
                delete nextLocked[monthYear];
                return {
                    lockedMonths: nextLocked
                };
            });
            // Sync to API
            syncToAPI('unlock', {
                monthYear
            }).catch(console.error);
        },
        toggleLock: (monthYear)=>{
            const isLocked = Boolean(get().lockedMonths[monthYear]);
            if (isLocked) {
                get().unlockMonth(monthYear);
            } else {
                get().lockMonth(monthYear);
            }
        },
        // Data management
        attendanceData: {},
        saveAttendanceData: (monthKey, data)=>{
            set((state)=>({
                    attendanceData: {
                        ...state.attendanceData,
                        [monthKey]: data
                    }
                }));
            // Sync to API
            syncToAPI('save', {
                monthKey,
                data
            }).catch(console.error);
        },
        getAttendanceData: (monthKey)=>{
            return get().attendanceData[monthKey] || null;
        },
        updateEmployeeRecord: (monthKey, employeeSystemId, dayKey, record)=>{
            set((state)=>{
                const monthData = state.attendanceData[monthKey];
                if (!monthData) return state;
                const updatedData = monthData.map((emp)=>{
                    if (emp.employeeSystemId === employeeSystemId) {
                        return {
                            ...emp,
                            [dayKey]: record
                        };
                    }
                    return emp;
                });
                return {
                    attendanceData: {
                        ...state.attendanceData,
                        [monthKey]: updatedData
                    }
                };
            });
            // Sync single record to API
            syncToAPI('save', {
                monthKey,
                employeeSystemId,
                dayKey,
                record
            }).catch(console.error);
        },
        // Load from API
        loadFromAPI: async (monthKey)=>{
            const apiData = await fetchFromAPI(monthKey);
            if (apiData && apiData.length > 0) {
                set((state)=>({
                        attendanceData: {
                            ...state.attendanceData,
                            [monthKey]: apiData
                        },
                        initialized: true
                    }));
            }
        }
    }));
}),
"[project]/features/attendance/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateOvertimePay",
    ()=>calculateOvertimePay,
    "calculateOvertimePayFromRow",
    ()=>calculateOvertimePayFromRow,
    "excelSerialToTime",
    ()=>excelSerialToTime,
    "initializeEmptyAttendance",
    ()=>initializeEmptyAttendance,
    "recalculateSummary",
    ()=>recalculateSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
function initializeEmptyAttendance(employees, year, month, settings) {
    const daysInMonth = new Date(year, month, 0).getDate();
    return employees.map((emp)=>{
        const row = {
            systemId: emp.systemId,
            employeeSystemId: emp.systemId,
            employeeId: emp.id,
            fullName: emp.fullName,
            department: emp.department,
            workDays: 0,
            leaveDays: 0,
            absentDays: 0,
            lateArrivals: 0,
            earlyDepartures: 0,
            otHours: 0,
            otHoursWeekday: 0,
            otHoursWeekend: 0,
            otHoursHoliday: 0
        };
        // Initialize each day with default status
        for(let d = 1; d <= daysInMonth; d++){
            const workDate = new Date(year, month - 1, d);
            const dayOfWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(workDate);
            const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
            row[`day_${d}`] = {
                status: isWorkingDay ? 'absent' : 'weekend'
            };
        }
        return row;
    });
}
function excelSerialToTime(serial) {
    if (typeof serial === 'string') {
        // If it's already a time string, just ensure format
        const parts = serial.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return '';
    }
    if (typeof serial !== 'number' || serial < 0 || serial > 1) {
        // It might be a Date object from cellDates:true
        if (serial instanceof Date) {
            // Use local time (getHours/getMinutes) for Vietnam timezone GMT+7
            const hours = serial.getHours();
            const minutes = serial.getMinutes();
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return ''; // Invalid time serial
    }
    const totalSeconds = Math.round(serial * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
function recalculateSummary(row, year, month, settings) {
    let totalWorkMinutes = 0; // Tổng phút làm việc trong giờ hành chính (8:30-18:00)
    let leaveDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;
    // OT theo loại ngày
    let otMinutesWeekday = 0; // Làm thêm ngày thường (sau 18h)
    let otMinutesWeekend = 0; // Làm thêm cuối tuần
    let otMinutesHoliday = 0; // Làm thêm ngày lễ
    const daysInMonth = new Date(year, month, 0).getDate();
    // Tính số giờ làm việc tiêu chuẩn 1 ngày (trừ nghỉ trưa)
    // VD: 8:30-18:00 = 9.5h, trừ nghỉ trưa 1.5h = 8h
    const workStartParts = settings.workStartTime.split(':').map(Number);
    const workEndParts = settings.workEndTime.split(':').map(Number);
    const workStartMinutes = workStartParts[0] * 60 + workStartParts[1];
    const workEndMinutes = workEndParts[0] * 60 + workEndParts[1];
    const standardDayMinutes = workEndMinutes - workStartMinutes - settings.lunchBreakDuration;
    // Lấy giờ nghỉ trưa từ settings (nếu có), fallback về hardcode
    const lunchStartParts = (settings.lunchBreakStart || '12:00').split(':').map(Number);
    const lunchEndParts = (settings.lunchBreakEnd || '13:30').split(':').map(Number);
    const lunchStartMinutes = lunchStartParts[0] * 60 + lunchStartParts[1];
    const lunchEndMinutes = lunchEndParts[0] * 60 + lunchEndParts[1];
    for(let d = 1; d <= daysInMonth; d++){
        const record = row[`day_${d}`];
        const workDate = new Date(year, month - 1, d);
        const dayOfWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(workDate);
        const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // CN = 0, T7 = 6
        const isHoliday = record?.status === 'holiday';
        if (record) {
            // Xử lý cho ngày làm việc (thứ 2-6)
            if (isWorkingDay) {
                // Tính giờ làm việc thực tế từ checkIn/checkOut
                if (record.checkIn && record.checkOut) {
                    const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkInTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkOutTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkOutTime, checkInTime)) {
                        const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                        const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                        // ===== TÍNH GIỜ CÔNG (trong giờ hành chính 8:30-18:00) =====
                        // Giờ vào tính công = max(checkIn, workStart)
                        const effectiveStartMins = Math.max(checkInMins, workStartMinutes);
                        // Giờ ra tính công = min(checkOut, workEnd)
                        const effectiveEndMins = Math.min(checkOutMins, workEndMinutes);
                        let workedMinutes = effectiveEndMins - effectiveStartMins;
                        // Trừ nghỉ trưa nếu làm qua giờ nghỉ trưa
                        if (effectiveStartMins < lunchStartMinutes && effectiveEndMins > lunchEndMinutes) {
                            workedMinutes -= settings.lunchBreakDuration;
                        } else if (effectiveStartMins < lunchEndMinutes && effectiveEndMins > lunchStartMinutes) {
                            // Nếu chỉ chạm 1 phần giờ nghỉ trưa
                            const overlapStart = Math.max(effectiveStartMins, lunchStartMinutes);
                            const overlapEnd = Math.min(effectiveEndMins, lunchEndMinutes);
                            workedMinutes -= Math.max(0, overlapEnd - overlapStart);
                        }
                        totalWorkMinutes += Math.max(0, workedMinutes);
                        // ===== TÍNH GIỜ LÀM THÊM (sau giờ tan làm 18:00) =====
                        if (checkOutMins > workEndMinutes) {
                            const otMinutes = checkOutMins - workEndMinutes;
                            if (isHoliday) {
                                otMinutesHoliday += otMinutes;
                            } else {
                                otMinutesWeekday += otMinutes;
                            }
                        }
                        // Early departure calculation - ra trước giờ tan làm
                        if (checkOutMins < workEndMinutes) {
                            earlyDepartures++;
                        }
                    }
                }
                // Đếm ngày nghỉ phép
                if (record.status === 'leave') {
                    leaveDays += 1;
                }
                // Late arrival calculation
                if (record.checkIn) {
                    const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                    const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                    const workStartTime = new Date(`${workDateStr}T${settings.workStartTime}`);
                    const allowedLateTime = new Date(workStartTime.getTime() + settings.allowedLateMinutes * 60000);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkInTime, allowedLateTime)) {
                        lateArrivals++;
                    }
                }
            }
            // ===== XỬ LÝ LÀM THÊM CUỐI TUẦN / NGÀY LỄ =====
            // Nếu là cuối tuần hoặc ngày lễ mà có checkIn/checkOut → tính toàn bộ là OT
            if ((isWeekend || isHoliday) && record.checkIn && record.checkOut) {
                const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
                const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkInTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(checkOutTime) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(checkOutTime, checkInTime)) {
                    let otMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / 60000;
                    // Trừ nghỉ trưa nếu làm qua trưa
                    const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
                    const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
                    if (checkInMins < lunchStartMinutes && checkOutMins > lunchEndMinutes) {
                        otMinutes -= settings.lunchBreakDuration;
                    }
                    if (isHoliday) {
                        otMinutesHoliday += Math.max(0, otMinutes);
                    } else {
                        otMinutesWeekend += Math.max(0, otMinutes);
                    }
                }
            }
            // OT từ cột overtimeCheckIn/overtimeCheckOut riêng (nếu có)
            if (record.overtimeCheckIn && record.overtimeCheckOut) {
                const workDateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])(workDate);
                const otStartDate = new Date(`${workDateStr}T${record.overtimeCheckIn}`);
                const otEndDate = new Date(`${workDateStr}T${record.overtimeCheckOut}`);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(otStartDate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidDate"])(otEndDate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDateAfter"])(otEndDate, otStartDate)) {
                    const diffInMinutes = (otEndDate.getTime() - otStartDate.getTime()) / 60000;
                    if (isHoliday) {
                        otMinutesHoliday += diffInMinutes;
                    } else if (isWeekend) {
                        otMinutesWeekend += diffInMinutes;
                    } else {
                        otMinutesWeekday += diffInMinutes;
                    }
                }
            }
        }
    }
    // Tính số công = Tổng giờ làm / Giờ tiêu chuẩn 1 ngày (tối đa = số ngày làm việc trong tháng)
    const workDays = standardDayMinutes > 0 ? parseFloat((totalWorkMinutes / standardDayMinutes).toFixed(2)) : 0;
    // Tính ngày vắng = Tổng ngày làm việc trong tháng - ngày có công - ngày phép
    const totalWorkingDaysInMonth = Array.from({
        length: daysInMonth
    }, (_, i)=>{
        const d = new Date(year, month - 1, i + 1);
        const dow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDayOfWeek"])(d);
        return dow !== null && settings.workingDays.includes(dow) ? 1 : 0;
    }).reduce((a, b)=>a + b, 0);
    absentDays = Math.max(0, totalWorkingDaysInMonth - Math.ceil(workDays) - leaveDays);
    // Convert OT từ phút sang giờ
    const otHoursWeekday = parseFloat((otMinutesWeekday / 60).toFixed(2));
    const otHoursWeekend = parseFloat((otMinutesWeekend / 60).toFixed(2));
    const otHoursHoliday = parseFloat((otMinutesHoliday / 60).toFixed(2));
    const otHours = parseFloat((otHoursWeekday + otHoursWeekend + otHoursHoliday).toFixed(2));
    return {
        workDays,
        leaveDays,
        absentDays,
        lateArrivals,
        earlyDepartures,
        otHours,
        otHoursWeekday,
        otHoursWeekend,
        otHoursHoliday
    };
}
function calculateOvertimePay(otHoursWeekday, otHoursWeekend, otHoursHoliday, settings) {
    const hourlyRate = settings.otHourlyRate || 0;
    // Ngày thường: tiền/giờ * số giờ
    const weekdayPay = otHoursWeekday * hourlyRate;
    // Cuối tuần: tiền/giờ * hệ số cuối tuần * số giờ
    const weekendPay = otHoursWeekend * hourlyRate * (settings.otRateWeekend || 1.5);
    // Ngày lễ: tiền/giờ * hệ số ngày lễ * số giờ  
    const holidayPay = otHoursHoliday * hourlyRate * (settings.otRateHoliday || 3);
    const totalOtPay = weekdayPay + weekendPay + holidayPay;
    return {
        weekdayPay: Math.round(weekdayPay),
        weekendPay: Math.round(weekendPay),
        holidayPay: Math.round(holidayPay),
        totalOtPay: Math.round(totalOtPay)
    };
}
function calculateOvertimePayFromRow(row, settings) {
    return calculateOvertimePay(row.otHoursWeekday || 0, row.otHoursWeekend || 0, row.otHoursHoliday || 0, settings);
}
}),
"[project]/features/payroll/payroll-batch-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePayrollBatchStore",
    ()=>usePayrollBatchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
// API sync helpers
async function syncToAPI(action, entityType, data) {
    try {
        const basePath = entityType === 'batch' ? '/api/payroll/batches' : '/api/payroll/payslips';
        const endpoint = action === 'create' ? basePath : `${basePath}/${data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : 'DELETE';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.error(`[Payroll API] ${action} ${entityType} failed:`, await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[Payroll API] ${action} ${entityType} error:`, error);
        return false;
    }
}
const AUDIT_ACTION_FOR_STATUS = {
    draft: 'run',
    reviewed: 'review',
    locked: 'lock',
    cancelled: 'run'
};
const resolveActorSystemId = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])() || 'SYSTEM00000000');
const initialCounters = {
    payroll: {
        systemId: 0,
        businessId: 0
    },
    payslips: {
        systemId: 0,
        businessId: 0
    },
    'payroll-audit-log': {
        systemId: 0,
        businessId: 0
    }
};
const collectBusinessIds = (items)=>items.map((item)=>item.id?.toUpperCase()).filter((id)=>Boolean(id));
const buildDualIds = (entityType, counter, existingIds)=>{
    const nextSystemCounter = counter.systemId + 1;
    const systemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, nextSystemCounter));
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType), existingIds, counter.businessId);
    return {
        systemId,
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId),
        counter: {
            systemId: nextSystemCounter,
            businessId: updatedCounter
        }
    };
};
const usePayrollBatchStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        batches: [],
        payslips: [],
        auditLogs: [],
        counters: initialCounters,
        getBatchBySystemId: (systemId)=>get().batches.find((batch)=>batch.systemId === systemId),
        getPayslipsByBatch: (batchSystemId)=>get().payslips.filter((payslip)=>payslip.batchSystemId === batchSystemId),
        getPayslipBySystemId: (systemId)=>get().payslips.find((payslip)=>payslip.systemId === systemId),
        createBatch: (input)=>{
            set((state)=>{
                const actor = resolveActorSystemId();
                const now = new Date().toISOString();
                const dualIds = buildDualIds('payroll', state.counters.payroll, collectBusinessIds(state.batches));
                const batch = {
                    systemId: dualIds.systemId,
                    id: dualIds.id,
                    title: input.title,
                    status: 'draft',
                    templateSystemId: input.templateSystemId,
                    payPeriod: input.payPeriod,
                    payrollDate: input.payrollDate,
                    referenceAttendanceMonthKeys: input.referenceAttendanceMonthKeys?.length ? input.referenceAttendanceMonthKeys : [
                        input.payPeriod.monthKey
                    ],
                    payslipSystemIds: [],
                    totalGross: 0,
                    totalNet: 0,
                    notes: input.notes,
                    createdAt: now,
                    updatedAt: now,
                    createdBy: actor,
                    updatedBy: actor
                };
                const countersAfterBatch = {
                    ...state.counters,
                    payroll: dualIds.counter
                };
                const auditResult = createAuditLogEntry({
                    batchSystemId: batch.systemId,
                    action: 'run',
                    payload: {
                        title: batch.title
                    },
                    actorSystemId: actor
                })({
                    ...state,
                    counters: countersAfterBatch
                });
                return {
                    ...state,
                    batches: [
                        ...state.batches,
                        batch
                    ],
                    auditLogs: auditResult.auditLogs,
                    counters: auditResult.counters
                };
            });
            const createdBatch = get().batches.at(-1);
            if (!createdBatch) {
                throw new Error('Không thể tạo batch lương mới.');
            }
            return createdBatch;
        },
        createBatchWithResults: (input, generatedPayslips)=>{
            const batch = get().createBatch(input);
            if (generatedPayslips.length) {
                get().addPayslips(batch.systemId, generatedPayslips.map((payload)=>({
                        employeeSystemId: payload.employeeSystemId,
                        employeeId: payload.employeeId,
                        departmentSystemId: payload.departmentSystemId,
                        periodMonthKey: payload.periodMonthKey,
                        components: payload.components,
                        totals: payload.totals,
                        attendanceSnapshotSystemId: payload.attendanceSnapshotSystemId,
                        deductedPenaltySystemIds: payload.deductedPenaltySystemIds
                    })));
            }
            return get().getBatchBySystemId(batch.systemId) ?? batch;
        },
        updateBatchStatus: (systemId, status, note)=>{
            const actor = resolveActorSystemId();
            const now = new Date().toISOString();
            let monthsToLock = [];
            set((state)=>{
                const batches = state.batches.map((batch)=>{
                    if (batch.systemId !== systemId) return batch;
                    if (status === 'locked') {
                        monthsToLock = batch.referenceAttendanceMonthKeys;
                    }
                    return {
                        ...batch,
                        status,
                        reviewedAt: status === 'reviewed' ? now : batch.reviewedAt,
                        reviewedBy: status === 'reviewed' ? actor : batch.reviewedBy,
                        lockedAt: status === 'locked' ? now : batch.lockedAt,
                        lockedBy: status === 'locked' ? actor : batch.lockedBy,
                        updatedAt: now,
                        updatedBy: actor,
                        notes: note ?? batch.notes
                    };
                });
                const { auditLogs, counters } = createAuditLogEntry({
                    batchSystemId: systemId,
                    action: AUDIT_ACTION_FOR_STATUS[status],
                    payload: note ? {
                        note
                    } : undefined,
                    actorSystemId: actor
                })(state);
                return {
                    ...state,
                    batches,
                    auditLogs,
                    counters
                };
            });
            if (status === 'locked' && monthsToLock.length) {
                const attendanceStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAttendanceStore"].getState();
                monthsToLock.forEach((monthKey)=>attendanceStore.lockMonth(monthKey));
            }
        },
        addPayslips: (batchSystemId, inputs)=>{
            if (!inputs.length) return;
            set((state)=>{
                const actor = resolveActorSystemId();
                const now = new Date().toISOString();
                const batch = state.batches.find((b)=>b.systemId === batchSystemId);
                if (!batch) {
                    throw new Error('Không tìm thấy batch lương.');
                }
                let nextCounters = {
                    ...state.counters
                };
                const existingPayslipIds = collectBusinessIds(state.payslips);
                const newPayslips = inputs.map((payload)=>{
                    const ids = buildDualIds('payslips', nextCounters.payslips, existingPayslipIds);
                    nextCounters = {
                        ...nextCounters,
                        payslips: ids.counter
                    };
                    existingPayslipIds.push(ids.id);
                    return {
                        systemId: ids.systemId,
                        id: ids.id,
                        batchSystemId,
                        employeeSystemId: payload.employeeSystemId,
                        employeeId: payload.employeeId,
                        departmentSystemId: payload.departmentSystemId,
                        periodMonthKey: payload.periodMonthKey,
                        attendanceSnapshotSystemId: payload.attendanceSnapshotSystemId,
                        components: payload.components,
                        totals: payload.totals,
                        deductedPenaltySystemIds: payload.deductedPenaltySystemIds,
                        createdAt: now,
                        updatedAt: now,
                        createdBy: actor,
                        updatedBy: actor
                    };
                });
                const payslips = [
                    ...state.payslips,
                    ...newPayslips
                ];
                const payslipSystemIds = [
                    ...new Set([
                        ...batch.payslipSystemIds,
                        ...newPayslips.map((p)=>p.systemId)
                    ])
                ];
                const batchPayslips = payslips.filter((slip)=>payslipSystemIds.includes(slip.systemId));
                const totalGross = batchPayslips.reduce((sum, slip)=>sum + slip.totals.earnings, 0);
                const totalNet = batchPayslips.reduce((sum, slip)=>sum + slip.totals.netPay, 0);
                const batches = state.batches.map((b)=>b.systemId === batchSystemId ? {
                        ...b,
                        payslipSystemIds,
                        totalGross,
                        totalNet,
                        updatedAt: now,
                        updatedBy: actor
                    } : b);
                const { auditLogs, counters } = createAuditLogEntry({
                    batchSystemId,
                    action: 'recalculate',
                    payload: {
                        added: newPayslips.length
                    },
                    actorSystemId: actor
                })({
                    ...state,
                    counters: nextCounters
                });
                return {
                    ...state,
                    batches,
                    payslips,
                    auditLogs,
                    counters
                };
            });
        },
        updatePayslip: (payslipSystemId, updates)=>{
            const state = get();
            const payslip = state.payslips.find((p)=>p.systemId === payslipSystemId);
            if (!payslip) {
                return {
                    success: false,
                    error: 'Không tìm thấy phiếu lương.'
                };
            }
            const batch = state.batches.find((b)=>b.systemId === payslip.batchSystemId);
            if (!batch) {
                return {
                    success: false,
                    error: 'Không tìm thấy bảng lương.'
                };
            }
            if (batch.status === 'locked') {
                return {
                    success: false,
                    error: 'Bảng lương đã khóa, không thể sửa.'
                };
            }
            const actor = resolveActorSystemId();
            const now = new Date().toISOString();
            set((state)=>{
                // Update the payslip
                const updatedPayslips = state.payslips.map((p)=>p.systemId === payslipSystemId ? {
                        ...p,
                        components: updates.components ?? p.components,
                        totals: updates.totals ?? p.totals,
                        updatedAt: now,
                        updatedBy: actor
                    } : p);
                // Recalculate batch totals
                const batchPayslipIds = batch.payslipSystemIds;
                const batchPayslips = updatedPayslips.filter((p)=>batchPayslipIds.includes(p.systemId));
                const totalGross = batchPayslips.reduce((sum, p)=>sum + p.totals.earnings, 0);
                const totalNet = batchPayslips.reduce((sum, p)=>sum + p.totals.netPay, 0);
                const updatedBatches = state.batches.map((b)=>b.systemId === batch.systemId ? {
                        ...b,
                        totalGross,
                        totalNet,
                        updatedAt: now,
                        updatedBy: actor
                    } : b);
                // Log the action
                const { auditLogs, counters } = createAuditLogEntry({
                    batchSystemId: batch.systemId,
                    action: 'recalculate',
                    payload: {
                        payslipSystemId,
                        employeeId: payslip.employeeId,
                        previousNet: payslip.totals.netPay,
                        newNet: updates.totals?.netPay ?? payslip.totals.netPay
                    },
                    actorSystemId: actor
                })(state);
                return {
                    ...state,
                    payslips: updatedPayslips,
                    batches: updatedBatches,
                    auditLogs,
                    counters
                };
            });
            return {
                success: true
            };
        },
        removePayslipFromBatch: (payslipSystemId)=>{
            const state = get();
            const payslip = state.payslips.find((p)=>p.systemId === payslipSystemId);
            if (!payslip) {
                return {
                    success: false,
                    error: 'Không tìm thấy phiếu lương.'
                };
            }
            const batch = state.batches.find((b)=>b.systemId === payslip.batchSystemId);
            if (!batch) {
                return {
                    success: false,
                    error: 'Không tìm thấy bảng lương.'
                };
            }
            if (batch.status === 'locked') {
                return {
                    success: false,
                    error: 'Bảng lương đã khóa, không thể xóa phiếu lương.'
                };
            }
            const actor = resolveActorSystemId();
            const now = new Date().toISOString();
            set((state)=>{
                // Remove from payslips
                const updatedPayslips = state.payslips.filter((p)=>p.systemId !== payslipSystemId);
                // Update batch
                const newPayslipIds = batch.payslipSystemIds.filter((id)=>id !== payslipSystemId);
                const batchPayslips = updatedPayslips.filter((p)=>newPayslipIds.includes(p.systemId));
                const totalGross = batchPayslips.reduce((sum, p)=>sum + p.totals.earnings, 0);
                const totalNet = batchPayslips.reduce((sum, p)=>sum + p.totals.netPay, 0);
                const updatedBatches = state.batches.map((b)=>b.systemId === batch.systemId ? {
                        ...b,
                        payslipSystemIds: newPayslipIds,
                        totalGross,
                        totalNet,
                        updatedAt: now,
                        updatedBy: actor
                    } : b);
                // Log the action
                const { auditLogs, counters } = createAuditLogEntry({
                    batchSystemId: batch.systemId,
                    action: 'recalculate',
                    payload: {
                        removed: payslipSystemId,
                        employeeId: payslip.employeeId
                    },
                    actorSystemId: actor
                })(state);
                return {
                    ...state,
                    payslips: updatedPayslips,
                    batches: updatedBatches,
                    auditLogs,
                    counters
                };
            });
            return {
                success: true
            };
        },
        cancelBatch: (systemId, reason)=>{
            const state = get();
            const batch = state.batches.find((b)=>b.systemId === systemId);
            if (!batch) {
                return {
                    success: false,
                    error: 'Không tìm thấy bảng lương.'
                };
            }
            if (batch.status === 'locked') {
                return {
                    success: false,
                    error: 'Bảng lương đã khóa, không thể hủy.'
                };
            }
            if (batch.status === 'cancelled') {
                return {
                    success: false,
                    error: 'Bảng lương đã được hủy trước đó.'
                };
            }
            const actor = resolveActorSystemId();
            const now = new Date().toISOString();
            set((state)=>{
                // Update batch status to cancelled
                const updatedBatches = state.batches.map((b)=>b.systemId === systemId ? {
                        ...b,
                        status: 'cancelled',
                        notes: reason ? `[Hủy] ${reason}` : b.notes,
                        updatedAt: now,
                        updatedBy: actor
                    } : b);
                // Log the action
                const { auditLogs, counters } = createAuditLogEntry({
                    batchSystemId: systemId,
                    action: 'recalculate',
                    payload: {
                        cancelled: true,
                        reason: reason,
                        title: batch.title,
                        payslipCount: batch.payslipSystemIds.length
                    },
                    actorSystemId: actor
                })(state);
                return {
                    ...state,
                    batches: updatedBatches,
                    auditLogs,
                    counters
                };
            });
            return {
                success: true
            };
        },
        logAction: (input)=>{
            let createdLog;
            set((state)=>{
                const { auditLogs, counters } = createAuditLogEntry(input)(state);
                createdLog = auditLogs[auditLogs.length - 1];
                return {
                    ...state,
                    auditLogs,
                    counters
                };
            });
            if (!createdLog) {
                throw new Error('Không thể ghi nhật ký payroll.');
            }
            return createdLog;
        },
        // Load from API
        loadFromAPI: async ()=>{
            try {
                // NOTE: Use React Query hooks for paginated payroll data. This only loads initial batch.
                const [batchesRes, payslipsRes] = await Promise.all([
                    fetch('/api/payroll/batches?limit=100'),
                    fetch('/api/payroll/payslips?limit=100')
                ]);
                if (batchesRes.ok && payslipsRes.ok) {
                    const batchesJson = await batchesRes.json();
                    const payslipsJson = await payslipsRes.json();
                    const batches = batchesJson.data || [];
                    const payslips = payslipsJson.data || [];
                    if (batches.length > 0 || payslips.length > 0) {
                        set({
                            batches,
                            payslips,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Payroll API] loadFromAPI error:', error);
            }
        },
        initialized: false
    }));
const createAuditLogEntry = (input)=>(state)=>{
        const actor = input.actorSystemId ?? resolveActorSystemId();
        const now = new Date().toISOString();
        const ids = buildDualIds('payroll-audit-log', state.counters['payroll-audit-log'], collectBusinessIds(state.auditLogs));
        const entry = {
            systemId: ids.systemId,
            id: ids.id,
            batchSystemId: input.batchSystemId,
            action: input.action,
            actorSystemId: actor ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM00000000'),
            actorDisplayName: input.actorDisplayName,
            payload: input.payload,
            createdAt: now
        };
        return {
            auditLogs: [
                ...state.auditLogs,
                entry
            ],
            counters: {
                ...state.counters,
                'payroll-audit-log': ids.counter
            }
        };
    };
}),
"[project]/features/payroll/components/status-badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayrollStatusBadge",
    ()=>PayrollStatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const STATUS_LABEL = {
    draft: 'Nháp',
    reviewed: 'Đang duyệt',
    locked: 'Đã khóa',
    cancelled: 'Đã hủy'
};
const STATUS_VARIANT = {
    draft: 'secondary',
    reviewed: 'warning',
    locked: 'success',
    cancelled: 'destructive'
};
function PayrollStatusBadge({ status, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        variant: STATUS_VARIANT[status],
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-body-xs font-medium', className),
        children: STATUS_LABEL[status]
    }, void 0, false, {
        fileName: "[project]/features/payroll/components/status-badge.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/payroll/components/payslip-print-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BatchPrintButton",
    ()=>BatchPrintButton,
    "PayslipPrintButton",
    ()=>PayslipPrintButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/store-info-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payroll/payroll-batch-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/departments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/payroll-print-helper.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/payroll.mapper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
function PayslipPrintButton({ payslipSystemId, payslipData, batchData, variant = 'outline', size = 'sm', className, showText = true }) {
    // Stores - chỉ query nếu không có data truyền vào
    const storePayslip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePayrollBatchStore"])((state)=>payslipSystemId ? state.payslips.find((p)=>p.systemId === payslipSystemId) : undefined);
    const storeBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePayrollBatchStore"])((state)=>{
        const slip = payslipData || storePayslip;
        return slip ? state.batches.find((b)=>b.systemId === slip.batchSystemId) : undefined;
    });
    // Ưu tiên data truyền vào
    const payslip = payslipData || storePayslip;
    const batch = batchData || storeBatch;
    const { data: employees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"])();
    const { data: departments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDepartmentStore"])();
    const { info: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfoStore"])();
    // Print hook
    const { print } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    // Lookups
    const employeeLookup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return employees.reduce((acc, emp)=>{
            acc[emp.systemId] = emp;
            return acc;
        }, {});
    }, [
        employees
    ]);
    const departmentLookup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return departments.reduce((acc, dept)=>{
            acc[dept.systemId] = dept;
            return acc;
        }, {});
    }, [
        departments
    ]);
    // Handler
    const handlePrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!payslip || !batch) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể in', {
                description: 'Không tìm thấy dữ liệu phiếu lương.'
            });
            return;
        }
        // Get employee info
        const employee = employeeLookup[payslip.employeeSystemId];
        const departmentName = payslip.departmentSystemId ? departmentLookup[payslip.departmentSystemId]?.name : employee?.department;
        const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
        const payslipForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPayslipForPrint"])(payslip, batch, {
            employee: employee ? {
                fullName: employee.fullName,
                id: employee.id,
                department: employee.department,
                position: employee.positionName
            } : undefined,
            departmentName
        });
        // In phiếu lương cá nhân (template 'payslip')
        print('payslip', {
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPayslipToPrintData"])(payslipForPrint, storeSettings),
            lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPayslipComponentLineItems"])(payslipForPrint.components)
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đang chuẩn bị in...', {
            description: 'Phiếu lương sẽ được in ra.'
        });
    }, [
        payslip,
        batch,
        storeInfo,
        employeeLookup,
        departmentLookup,
        print
    ]);
    if (!payslip) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
        variant: variant,
        size: size,
        className: className,
        onClick: handlePrint,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                className: showText ? 'h-4 w-4 mr-2' : 'h-4 w-4'
            }, void 0, false, {
                fileName: "[project]/features/payroll/components/payslip-print-button.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            showText && 'In phiếu lương'
        ]
    }, void 0, true, {
        fileName: "[project]/features/payroll/components/payslip-print-button.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
function BatchPrintButton({ batchSystemId, variant = 'outline', size = 'sm', className, showText = true }) {
    // Stores
    const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePayrollBatchStore"])((state)=>state.batches.find((b)=>b.systemId === batchSystemId));
    const payslips = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePayrollBatchStore"])((state)=>batch ? state.payslips.filter((p)=>p.batchSystemId === batch.systemId) : []);
    const { data: employees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"])();
    const { data: departments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDepartmentStore"])();
    const { info: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfoStore"])();
    const { print } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    // Lookups
    const employeeLookup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return employees.reduce((acc, emp)=>{
            acc[emp.systemId] = emp;
            return acc;
        }, {});
    }, [
        employees
    ]);
    const departmentLookup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return departments.reduce((acc, dept)=>{
            acc[dept.systemId] = dept;
            return acc;
        }, {});
    }, [
        departments
    ]);
    // Handler
    const handlePrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!batch || payslips.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không thể in', {
                description: 'Không tìm thấy dữ liệu bảng lương.'
            });
            return;
        }
        const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
        const batchForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPayrollBatchForPrint"])(batch, payslips, {
            employeeLookup: employeeLookup,
            departmentLookup: departmentLookup
        });
        print('payroll', {
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPayrollBatchToPrintData"])(batchForPrint, storeSettings),
            lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPayrollBatchLineItems"])(batchForPrint.payslips)
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đang chuẩn bị in...', {
            description: `In ${payslips.length} phiếu lương.`
        });
    }, [
        batch,
        payslips,
        storeInfo,
        employeeLookup,
        departmentLookup,
        print
    ]);
    if (!batch) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
        variant: variant,
        size: size,
        className: className,
        onClick: handlePrint,
        disabled: payslips.length === 0,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                className: showText ? 'h-4 w-4 mr-2' : 'h-4 w-4'
            }, void 0, false, {
                fileName: "[project]/features/payroll/components/payslip-print-button.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            showText && `In bảng lương (${payslips.length})`
        ]
    }, void 0, true, {
        fileName: "[project]/features/payroll/components/payslip-print-button.tsx",
        lineNumber: 242,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/leaves/leave-sync-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "leaveAttendanceSync",
    ()=>leaveAttendanceSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const LEAVE_NOTE_PREFIX = '[LEAVE:';
const buildMonthKey = (date)=>`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const buildLeaveNote = (leave)=>{
    const description = `${LEAVE_NOTE_PREFIX}${leave.systemId}] ${leave.leaveTypeName}`;
    return leave.reason ? `${description} - ${leave.reason}` : description;
};
const isSameLeaveNote = (record, leave)=>{
    if (!record?.notes) return false;
    return record.notes.includes(`${LEAVE_NOTE_PREFIX}${leave.systemId}]`);
};
const cloneDate = (input)=>new Date(input.getFullYear(), input.getMonth(), input.getDate());
const parseLeaveBoundary = (value)=>{
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};
const collectWorkingDays = (leave)=>{
    const workingDays = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings.workingDays);
    if (!leave.startDate || !leave.endDate) return new Map();
    let start = parseLeaveBoundary(leave.startDate);
    let end = parseLeaveBoundary(leave.endDate);
    if (start > end) {
        const temp = start;
        start = end;
        end = temp;
    }
    const monthMap = new Map();
    for(let cursor = cloneDate(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)){
        const dayOfWeek = cursor.getDay();
        if (!workingDays.has(dayOfWeek)) {
            continue;
        }
        const monthKey = buildMonthKey(cursor);
        const entry = {
            date: cloneDate(cursor),
            dayOfMonth: cursor.getDate()
        };
        const existing = monthMap.get(monthKey);
        if (existing) {
            existing.push(entry);
        } else {
            monthMap.set(monthKey, [
                entry
            ]);
        }
    }
    return monthMap;
};
const buildLeaveRecord = (leave)=>({
        status: 'leave',
        notes: buildLeaveNote(leave)
    });
const buildRevertedRecord = (context)=>{
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])();
    if (context.date > today) {
        return {
            status: 'future'
        };
    }
    return {
        status: 'absent'
    };
};
const applyUpdatesForMonth = (monthKey, days, leave, mode)=>{
    if (days.length === 0) return;
    const attendanceStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAttendanceStore"].getState();
    const monthData = attendanceStore.getAttendanceData(monthKey);
    if (!monthData?.length) return;
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr) || new Date().getFullYear();
    const month = Number(monthStr) || new Date().getMonth() + 1;
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    let didChange = false;
    const updatedRows = monthData.map((row)=>{
        if (row.employeeSystemId !== leave.employeeSystemId) {
            return row;
        }
        let rowChanged = false;
        const mutableRow = {
            ...row
        };
        days.forEach((ctx)=>{
            const dayKey = `day_${ctx.dayOfMonth}`;
            const currentRecord = mutableRow[dayKey];
            if (mode === 'apply') {
                mutableRow[dayKey] = buildLeaveRecord(leave);
                rowChanged = true;
                return;
            }
            if (mode === 'clear' && currentRecord && isSameLeaveNote(currentRecord, leave)) {
                mutableRow[dayKey] = buildRevertedRecord(ctx);
                rowChanged = true;
            }
        });
        if (!rowChanged) {
            return row;
        }
        didChange = true;
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recalculateSummary"])(mutableRow, year, month, settings);
        return {
            ...mutableRow,
            ...summary
        };
    });
    if (didChange) {
        attendanceStore.saveAttendanceData(monthKey, updatedRows);
    }
};
const leaveAttendanceSync = {
    apply (leave) {
        const monthMap = collectWorkingDays(leave);
        monthMap.forEach((days, monthKey)=>applyUpdatesForMonth(monthKey, days, leave, 'apply'));
    },
    clear (leave) {
        const monthMap = collectWorkingDays(leave);
        monthMap.forEach((days, monthKey)=>applyUpdatesForMonth(monthKey, days, leave, 'clear'));
    }
};
}),
"[project]/features/leaves/leave-quota-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "leaveQuotaSync",
    ()=>leaveQuotaSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
;
const clampNonNegative = (value)=>Number.isFinite(value) && value > 0 ? value : 0;
const resolveDelta = (leave)=>{
    const days = Number(leave.numberOfDays) || 0;
    return days > 0 ? days : 0;
};
const isAnnualLeaveType = (leaveType)=>{
    if (!leaveType) return false;
    const normalizedName = leaveType.name?.toLowerCase() ?? '';
    const annualKeywords = [
        'phép năm',
        'phep nam',
        'annual'
    ];
    return annualKeywords.some((keyword)=>normalizedName.includes(keyword));
};
const resolveLeaveTypeMetadata = (leave)=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    const matchedType = settings.leaveTypes.find((type)=>{
        if (leave.leaveTypeSystemId && type.systemId === leave.leaveTypeSystemId) return true;
        if (leave.leaveTypeId && type.id === leave.leaveTypeId) return true;
        return false;
    });
    const isPaid = typeof leave.leaveTypeIsPaid === 'boolean' ? leave.leaveTypeIsPaid : matchedType?.isPaid ?? true;
    const countsTowardsAnnual = matchedType ? isAnnualLeaveType(matchedType) : isPaid;
    return {
        isPaid,
        countsTowardsAnnual
    };
};
const getServiceYears = (hireDate)=>{
    if (!hireDate) return 0;
    const parsed = new Date(hireDate);
    if (Number.isNaN(parsed.getTime())) return 0;
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])();
    let years = today.getFullYear() - parsed.getFullYear();
    const hasNotReachedAnniversary = today.getMonth() < parsed.getMonth() || today.getMonth() === parsed.getMonth() && today.getDate() < parsed.getDate();
    if (hasNotReachedAnniversary) {
        years -= 1;
    }
    return Math.max(years, 0);
};
const computeAnnualQuota = (employeeHireDate)=>{
    const { baseAnnualLeaveDays, annualLeaveSeniorityBonus } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings;
    const base = baseAnnualLeaveDays ?? 0;
    if (!annualLeaveSeniorityBonus) {
        return clampNonNegative(base);
    }
    const years = getServiceYears(employeeHireDate);
    const bonusInterval = annualLeaveSeniorityBonus.years || 0;
    const bonusValue = annualLeaveSeniorityBonus.additionalDays || 0;
    const bonusMultiplier = bonusInterval > 0 ? Math.floor(years / bonusInterval) : 0;
    const bonus = bonusMultiplier * bonusValue;
    return clampNonNegative(base + bonus);
};
const adjustLeaveUsage = (leave, delta)=>{
    if (!delta) return;
    const employeeStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState();
    const employee = employeeStore.findById(leave.employeeSystemId);
    if (!employee) return;
    const { isPaid, countsTowardsAnnual } = resolveLeaveTypeMetadata(leave);
    const totalDelta = delta;
    const paidDelta = isPaid ? delta : 0;
    const unpaidDelta = isPaid ? 0 : delta;
    const annualDelta = countsTowardsAnnual ? delta : 0;
    const nextLeaveTaken = clampNonNegative((employee.leaveTaken ?? 0) + totalDelta);
    const nextPaid = clampNonNegative((employee.paidLeaveTaken ?? 0) + paidDelta);
    const nextUnpaid = clampNonNegative((employee.unpaidLeaveTaken ?? 0) + unpaidDelta);
    const nextAnnual = clampNonNegative((employee.annualLeaveTaken ?? 0) + annualDelta);
    const quota = computeAnnualQuota(employee.hireDate);
    const nextBalance = clampNonNegative(quota - nextAnnual);
    const hasChanges = nextLeaveTaken !== (employee.leaveTaken ?? 0) || nextPaid !== (employee.paidLeaveTaken ?? 0) || nextUnpaid !== (employee.unpaidLeaveTaken ?? 0) || nextAnnual !== (employee.annualLeaveTaken ?? 0) || nextBalance !== (employee.annualLeaveBalance ?? quota);
    if (!hasChanges) return;
    employeeStore.update(leave.employeeSystemId, {
        ...employee,
        leaveTaken: nextLeaveTaken,
        paidLeaveTaken: nextPaid,
        unpaidLeaveTaken: nextUnpaid,
        annualLeaveTaken: nextAnnual,
        annualLeaveBalance: nextBalance
    });
};
const leaveQuotaSync = {
    apply (leave) {
        const delta = resolveDelta(leave);
        if (!delta) return;
        adjustLeaveUsage(leave, delta);
    },
    clear (leave) {
        const delta = resolveDelta(leave);
        if (!delta) return;
        adjustLeaveUsage(leave, -delta);
    }
};
}),
"[project]/features/leaves/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLeaveStore",
    ()=>useLeaveStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/leaves/leave-sync-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/leaves/leave-quota-service.ts [app-ssr] (ecmascript)");
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'leaves', {
    businessIdField: 'id',
    apiEndpoint: '/api/leaves'
});
const isApproved = (leave)=>Boolean(leave && leave.status === 'Đã duyệt');
const snapshotLeave = (leave)=>leave ? {
        ...leave
    } : undefined;
const syncApprovedLeave = {
    apply: (leave)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveAttendanceSync"].apply(leave);
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveQuotaSync"].apply(leave);
    },
    clear: (leave)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$sync$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveAttendanceSync"].clear(leave);
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$leave$2d$quota$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveQuotaSync"].clear(leave);
    }
};
const syncAwareActions = {
    add: (payload)=>{
        const created = baseStore.getState().add(payload);
        if (isApproved(created)) {
            syncApprovedLeave.apply(created);
        }
        return created;
    },
    update: (systemId, next)=>{
        const store = baseStore.getState();
        const previous = snapshotLeave(store.findById(systemId));
        store.update(systemId, next);
        const updated = snapshotLeave(baseStore.getState().findById(systemId));
        if (isApproved(previous)) {
            syncApprovedLeave.clear(previous);
        }
        if (isApproved(updated)) {
            syncApprovedLeave.apply(updated);
        }
    },
    remove: (systemId)=>{
        const store = baseStore.getState();
        const target = snapshotLeave(store.findById(systemId));
        store.remove(systemId);
        if (isApproved(target)) {
            syncApprovedLeave.clear(target);
        }
    },
    restore: (systemId)=>{
        const store = baseStore.getState();
        store.restore(systemId);
        const restored = snapshotLeave(baseStore.getState().findById(systemId));
        if (isApproved(restored)) {
            syncApprovedLeave.apply(restored);
        }
    },
    hardDelete: (systemId)=>{
        const store = baseStore.getState();
        const target = snapshotLeave(store.findById(systemId));
        store.hardDelete(systemId);
        if (isApproved(target)) {
            syncApprovedLeave.clear(target);
        }
    }
};
const withSync = (state)=>({
        ...state,
        ...syncAwareActions
    });
const useLeaveStore = ()=>withSync(baseStore());
useLeaveStore.getState = ()=>withSync(baseStore.getState());
}),
"[project]/features/tasks/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTaskStore",
    ()=>useTaskStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/active-timer-sync.ts [app-ssr] (ecmascript)");
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'internal-tasks', {
    apiEndpoint: '/api/tasks'
});
// Migrate existing tasks to multiple assignees format
const migrateTasksToMultipleAssignees = (tasks)=>{
    return tasks.map((task)=>{
        // Ensure startDate exists for all tasks
        const taskWithStartDate = {
            ...task,
            startDate: task.startDate || task.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
        };
        // Skip if already has assignees array
        if (taskWithStartDate.assignees && taskWithStartDate.assignees.length > 0) {
            return taskWithStartDate;
        }
        // Migrate single assignee to array format
        if (taskWithStartDate.assigneeId && taskWithStartDate.assigneeName) {
            const assignee = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`assignee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                employeeSystemId: taskWithStartDate.assigneeId,
                employeeName: taskWithStartDate.assigneeName,
                role: 'owner',
                assignedAt: taskWithStartDate.createdAt || new Date().toISOString(),
                assignedBy: taskWithStartDate.assignerId || taskWithStartDate.createdBy || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
            };
            return {
                ...taskWithStartDate,
                assignees: [
                    assignee
                ]
            };
        }
        // No assignee
        return {
            ...taskWithStartDate,
            assignees: []
        };
    });
};
// Run migration on store initialization
const migratedData = []; // Database is source of truth
// Initialize store with migrated data
const taskStoreInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(migratedData, 'internal-tasks', {
    apiEndpoint: '/api/tasks'
});
// Helper to create activity log
const createActivity = (taskId, action, details)=>{
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    return {
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        taskId,
        userId: user.systemId,
        userName: user.name,
        action,
        timestamp: new Date().toISOString(),
        ...details
    };
};
// Helper to generate human-readable description
const getActivityDescription = (activity)=>{
    const { action, userName, oldValue, newValue, fieldName } = activity;
    switch(action){
        case 'created':
            return `${userName} đã tạo công việc`;
        case 'assigned':
            return `${userName} đã giao việc cho ${newValue}`;
        case 'assignee_added':
            return `${userName} đã thêm ${newValue} vào công việc`;
        case 'assignee_removed':
            return `${userName} đã xóa ${newValue} khỏi công việc`;
        case 'status_changed':
            return `${userName} đã thay đổi trạng thái từ "${oldValue}" sang "${newValue}"`;
        case 'priority_changed':
            return `${userName} đã thay đổi độ ưu tiên từ "${oldValue}" sang "${newValue}"`;
        case 'progress_updated':
            return `${userName} đã cập nhật tiến độ: ${newValue}%`;
        case 'timer_started':
            return `${userName} đã bắt đầu đếm giờ`;
        case 'timer_stopped':
            return `${userName} đã dừng đếm giờ (${newValue})`;
        case 'subtask_completed':
            return `${userName} đã hoàn thành: "${newValue}"`;
        case 'subtask_uncompleted':
            return `${userName} đã bỏ hoàn thành: "${newValue}"`;
        case 'completed':
            return `${userName} đã hoàn thành công việc`;
        case 'commented':
            return `${userName} đã thêm bình luận`;
        case 'evidence_submitted':
            return `${userName} đã gửi bằng chứng hoàn thành`;
        case 'evidence_approved':
            return `${userName} đã phê duyệt công việc`;
        case 'evidence_rejected':
            return `${userName} đã yêu cầu làm lại`;
        case 'updated':
            return fieldName ? `${userName} đã cập nhật ${fieldName}` : `${userName} đã cập nhật công việc`;
        default:
            return `${userName} đã thực hiện hành động`;
    }
};
const useTaskStore = ()=>{
    const store = taskStoreInstance();
    // Auto timer management helper
    const autoManageTimer = (task, updates)=>{
        const newStatus = updates.status || task.status;
        const newSubtasks = updates.subtasks || task.subtasks || [];
        const activities = [
            ...task.activities || []
        ];
        // Check if all subtasks completed
        const allSubtasksCompleted = newSubtasks.length > 0 && newSubtasks.every((s)=>s.completed);
        // Track status change
        if (updates.status && updates.status !== task.status) {
            const activity = createActivity(task.systemId, 'status_changed', {
                oldValue: task.status,
                newValue: updates.status
            });
            activity.description = getActivityDescription(activity);
            activities.push(activity);
        }
        // Track priority change
        if (updates.priority && updates.priority !== task.priority) {
            const activity = createActivity(task.systemId, 'priority_changed', {
                oldValue: task.priority,
                newValue: updates.priority
            });
            activity.description = getActivityDescription(activity);
            activities.push(activity);
        }
        // Track subtask completion
        if (updates.subtasks) {
            const oldSubtasks = task.subtasks || [];
            updates.subtasks.forEach((newSub, idx)=>{
                const oldSub = oldSubtasks[idx];
                if (oldSub && newSub.completed !== oldSub.completed) {
                    const activity = createActivity(task.systemId, newSub.completed ? 'subtask_completed' : 'subtask_uncompleted', {
                        newValue: newSub.title
                    });
                    activity.description = getActivityDescription(activity);
                    activities.push(activity);
                }
            });
        }
        // Auto start timer: status = "Đang thực hiện" và chưa có timer
        if (newStatus === 'Đang thực hiện' && !task.timerRunning) {
            const activity = createActivity(task.systemId, 'timer_started');
            activity.description = getActivityDescription(activity);
            activities.push(activity);
            return {
                ...updates,
                timerRunning: true,
                timerStartedAt: new Date().toISOString(),
                activities
            };
        }
        // Auto stop timer: Hoàn thành hết subtasks hoặc status = "Hoàn thành"
        if (task.timerRunning && (allSubtasksCompleted || newStatus === 'Hoàn thành')) {
            const elapsed = task.timerStartedAt ? Math.floor((Date.now() - new Date(task.timerStartedAt).getTime()) / 1000) : 0;
            const newTotalSeconds = (task.totalTrackedSeconds || 0) + elapsed;
            const actualHours = (newTotalSeconds / 3600).toFixed(1);
            const timerActivity = createActivity(task.systemId, 'timer_stopped', {
                newValue: `${actualHours}h`
            });
            timerActivity.description = getActivityDescription(timerActivity);
            activities.push(timerActivity);
            // Log completion if all subtasks done
            if (allSubtasksCompleted) {
                const completedActivity = createActivity(task.systemId, 'completed');
                completedActivity.description = getActivityDescription(completedActivity);
                activities.push(completedActivity);
            }
            return {
                ...updates,
                timerRunning: false,
                timerStartedAt: undefined,
                totalTrackedSeconds: newTotalSeconds,
                actualHours: newTotalSeconds / 3600,
                status: allSubtasksCompleted ? 'Hoàn thành' : newStatus,
                progress: allSubtasksCompleted ? 100 : updates.progress || task.progress,
                completedDate: allSubtasksCompleted ? new Date().toISOString().split('T')[0] : task.completedDate,
                activities
            };
        }
        return {
            ...updates,
            activities
        };
    };
    return {
        ...store,
        // Override add to log creation activity
        add: (newTask)=>{
            // Ensure startDate is always set
            const taskWithDefaults = {
                ...newTask,
                startDate: newTask.startDate || new Date().toISOString().split('T')[0]
            };
            const result = store.add(taskWithDefaults);
            if (result) {
                const activity = createActivity(result.systemId, 'created');
                activity.description = getActivityDescription(activity);
                // Log assignment if assignee exists
                if (result.assigneeName) {
                    const assignActivity = createActivity(result.systemId, 'assigned', {
                        newValue: result.assigneeName
                    });
                    assignActivity.description = getActivityDescription(assignActivity);
                    store.update(result.systemId, {
                        ...result,
                        activities: [
                            activity,
                            assignActivity
                        ]
                    });
                } else {
                    store.update(result.systemId, {
                        ...result,
                        activities: [
                            activity
                        ]
                    });
                }
            }
            return result;
        },
        // Override update to include auto timer logic and activity logging
        update: (id, updates)=>{
            console.log('[STORE] Update called with id:', id, 'updates:', updates);
            const task = store.findById(id);
            if (!task) {
                console.log('[STORE] Task not found!');
                return;
            }
            const enhancedUpdates = autoManageTimer(task, updates);
            console.log('[STORE] Enhanced updates:', enhancedUpdates);
            store.update(id, {
                ...task,
                ...enhancedUpdates
            });
            console.log('[STORE] Base store.update called');
            // Manage active timer - sync with database
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
            if (enhancedUpdates.timerRunning && enhancedUpdates.timerStartedAt) {
                // Save to both localStorage (cache) and database
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveActiveTimer"])(user.systemId, task.systemId, enhancedUpdates.timerStartedAt, task.title).catch(console.error);
            } else if (enhancedUpdates.timerRunning === false) {
                // Remove from both localStorage and database
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeActiveTimer"])(user.systemId).catch(console.error);
            }
        },
        // Get tasks assigned to specific user
        getMyTasks: (userId)=>{
            return store.data.filter((task)=>task.assignees?.some((a)=>a.employeeSystemId === userId) || task.assigneeId === userId // Backward compatibility
            );
        },
        // Get tasks created by specific user (assigner)
        getCreatedByMe: (userId)=>{
            return store.data.filter((task)=>task.assignerId === userId);
        },
        // Add assignee to task
        addAssignee: (taskId, employeeId, employeeName, role = 'contributor')=>{
            const task = store.findById(taskId);
            if (!task) return;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
            const assignees = task.assignees || [];
            // Check if already assigned
            if (assignees.some((a)=>a.employeeSystemId === employeeId)) {
                return;
            }
            const newAssignee = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`assignee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                employeeSystemId: employeeId,
                employeeName,
                role,
                assignedAt: new Date().toISOString(),
                assignedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(user.systemId)
            };
            const updatedAssignees = [
                ...assignees,
                newAssignee
            ];
            const activities = [
                ...task.activities || []
            ];
            const activity = createActivity(taskId, 'assignee_added', {
                newValue: `${employeeName} (${role})`
            });
            activity.description = getActivityDescription(activity);
            activities.push(activity);
            // Update backward compatibility fields
            const owner = updatedAssignees.find((a)=>a.role === 'owner') || updatedAssignees[0];
            store.update(taskId, {
                ...task,
                assignees: updatedAssignees,
                assigneeId: owner?.employeeSystemId ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                assigneeName: owner?.employeeName || '',
                activities
            });
        },
        // Remove assignee from task
        removeAssignee: (taskId, employeeId)=>{
            const task = store.findById(taskId);
            if (!task) return;
            const assignees = task.assignees || [];
            const removedAssignee = assignees.find((a)=>a.employeeSystemId === employeeId);
            if (!removedAssignee) return;
            const updatedAssignees = assignees.filter((a)=>a.employeeSystemId !== employeeId);
            const activities = [
                ...task.activities || []
            ];
            const activity = createActivity(taskId, 'assignee_removed', {
                newValue: removedAssignee.employeeName
            });
            activity.description = getActivityDescription(activity);
            activities.push(activity);
            // Update backward compatibility fields
            const owner = updatedAssignees.find((a)=>a.role === 'owner') || updatedAssignees[0];
            store.update(taskId, {
                ...task,
                assignees: updatedAssignees,
                assigneeId: owner?.employeeSystemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                assigneeName: owner?.employeeName || '',
                activities
            });
        },
        // Update assignee role
        updateAssigneeRole: (taskId, employeeId, newRole)=>{
            const task = store.findById(taskId);
            if (!task) return;
            const assignees = task.assignees || [];
            const assigneeIndex = assignees.findIndex((a)=>a.employeeSystemId === employeeId);
            if (assigneeIndex === -1) return;
            const updatedAssignees = [
                ...assignees
            ];
            updatedAssignees[assigneeIndex] = {
                ...updatedAssignees[assigneeIndex],
                role: newRole
            };
            // Update backward compatibility fields if owner changed
            const owner = updatedAssignees.find((a)=>a.role === 'owner') || updatedAssignees[0];
            store.update(taskId, {
                ...task,
                assignees: updatedAssignees,
                assigneeId: owner?.employeeSystemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(''),
                assigneeName: owner?.employeeName || ''
            });
        },
        // Restore running timer on page load
        restoreTimer: ()=>{
            const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getActiveTimerSync"])();
            if (!stored) return;
            try {
                const { taskId, startedAt } = stored;
                const task = store.findById(taskId);
                if (!task) {
                    // Task not found, clean up
                    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeActiveTimer"])(user.systemId).catch(console.error);
                    return;
                }
                // Calculate elapsed time
                const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
                store.update(taskId, {
                    ...task,
                    timerRunning: true,
                    timerStartedAt: startedAt,
                    totalTrackedSeconds: task.totalTrackedSeconds || 0
                });
            } catch (e) {
                // Clean up on error
                const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$active$2d$timer$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeActiveTimer"])(user.systemId).catch(console.error);
            }
        },
        // Approve task completion
        approveTask: (taskId)=>{
            const task = store.findById(taskId);
            if (!task) return;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
            const activity = createActivity(taskId, 'evidence_approved', {
                description: `${user.name} đã phê duyệt công việc`
            });
            const approvalRecord = {
                id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: 'approved',
                reviewedBy: user.systemId,
                reviewedByName: user.name,
                reviewedAt: new Date().toISOString()
            };
            store.update(taskId, {
                ...task,
                status: 'Hoàn thành',
                completedDate: new Date().toISOString(),
                approvalStatus: 'approved',
                rejectionReason: undefined,
                approvalHistory: [
                    ...task.approvalHistory || [],
                    approvalRecord
                ],
                activities: [
                    ...task.activities || [],
                    activity
                ]
            });
        },
        // Reject task completion
        rejectTask: (taskId, reason)=>{
            const task = store.findById(taskId);
            if (!task) return;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
            const activity = createActivity(taskId, 'evidence_rejected', {
                description: `${user.name} đã yêu cầu làm lại: ${reason}`
            });
            const approvalRecord = {
                id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: 'rejected',
                reviewedBy: user.systemId,
                reviewedByName: user.name,
                reviewedAt: new Date().toISOString(),
                reason
            };
            store.update(taskId, {
                ...task,
                status: 'Đang thực hiện',
                approvalStatus: 'rejected',
                rejectionReason: reason,
                approvalHistory: [
                    ...task.approvalHistory || [],
                    approvalRecord
                ],
                activities: [
                    ...task.activities || [],
                    activity
                ]
            });
        }
    };
};
}),
];

//# sourceMappingURL=features_4ff26e82._.js.map