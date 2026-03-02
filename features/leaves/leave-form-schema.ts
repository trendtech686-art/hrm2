import { z } from "zod";

// Form schema - used for useForm
export const leaveFormSchema = z.object({
  id: z.string(), // Required string, empty = auto-generate từ API
  employeeSystemId: z.string().min(1, "Vui lòng chọn nhân viên"),
  leaveTypeSystemId: z.string().min(1, "Vui lòng chọn loại phép"),
  startDate: z.date({ 
    message: "Vui lòng chọn ngày bắt đầu"
  }),
  endDate: z.date({ 
    message: "Vui lòng chọn ngày kết thúc"
  }),
  reason: z.string().min(10, "Lý do phải có ít nhất 10 ký tự"),
  status: z.enum(['Chờ duyệt', 'Đã duyệt', 'Đã từ chối']),
});

// Export type for form values
export type LeaveFormSchemaType = z.infer<typeof leaveFormSchema>;

// Validation helper for submit (not used in useForm, called manually)
export function validateLeaveFormData(data: LeaveFormSchemaType): string | null {
  // Validate: endDate must be >= startDate
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    return "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu";
  }
  
  // Validate: startDate should not be too far in the past (more than 30 days)
  if (data.startDate) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (data.startDate < thirtyDaysAgo) {
      return "Không thể tạo đơn cho ngày quá 30 ngày trước";
    }
  }
  
  return null; // Valid
}
