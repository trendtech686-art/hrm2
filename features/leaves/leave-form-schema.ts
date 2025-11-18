import { z } from "zod";

/**
 * Zod validation schema for Leave Request Form
 * Includes cross-field validation for date logic
 */
export const leaveFormSchema = z.object({
  id: z.string().min(1, "Mã đơn không được để trống"),
  employeeSystemId: z.string().min(1, "Vui lòng chọn nhân viên"),
  leaveTypeName: z.string().min(1, "Vui lòng chọn loại phép"),
  startDate: z.date({ 
    message: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({ 
    message: "Vui lòng chọn ngày kết thúc"
  }),
  reason: z.string().min(10, "Lý do phải có ít nhất 10 ký tự"),
  status: z.enum(['Chờ duyệt', 'Đã duyệt', 'Đã từ chối']),
}).refine(data => {
  // Validate: endDate must be >= startDate
  if (!data.startDate || !data.endDate) return true;
  return data.endDate >= data.startDate;
}, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
  path: ["endDate"],
}).refine(data => {
  // Validate: startDate should not be too far in the past (more than 30 days)
  if (!data.startDate) return true;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return data.startDate >= thirtyDaysAgo;
}, {
  message: "Không thể tạo đơn cho ngày quá 30 ngày trước",
  path: ["startDate"],
});

// Export type for form values
export type LeaveFormSchemaType = z.infer<typeof leaveFormSchema>;
