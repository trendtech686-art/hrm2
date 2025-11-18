import { z } from "zod";

export const employeeValidationSchema = z.object({
  // Required fields
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100, "Tên không được quá 100 ký tự"),
  id: z.string().min(3, "Mã nhân viên phải có ít nhất 3 ký tự"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  workEmail: z.string().email("Email công việc không hợp lệ"),
  personalEmail: z.string().email("Email cá nhân không hợp lệ"),
  
  // Optional but validated if provided
  nationalId: z.string().regex(/^[0-9]{9,12}$/, "CCCD/CMND phải có 9-12 chữ số").optional().or(z.literal('')),
  personalTaxId: z.string().regex(/^[0-9]{10,13}$/, "Mã số thuế phải có 10-13 chữ số").optional().or(z.literal('')),
  socialInsuranceNumber: z.string().regex(/^[0-9]{10}$/, "Số BHXH phải có 10 chữ số").optional().or(z.literal('')),
  bankAccountNumber: z.string().min(6, "Số tài khoản phải có ít nhất 6 ký tự").optional().or(z.literal('')),
  
  // Number validations
  baseSalary: z.number().min(0, "Lương cơ bản phải lớn hơn 0"),
  socialInsuranceSalary: z.number().min(0, "Lương BHXH phải lớn hơn 0").optional(),
  positionAllowance: z.number().min(0, "Phụ cấp chức vụ phải lớn hơn 0").optional(),
  mealAllowance: z.number().min(0, "Phụ cấp ăn trưa phải lớn hơn 0").optional(),
  otherAllowances: z.number().min(0, "Phụ cấp khác phải lớn hơn 0").optional(),
  
  // Date validations
  dob: z.date().optional(),
  hireDate: z.date().optional(),
  terminationDate: z.date().optional(),
  nationalIdIssueDate: z.date().optional(),
}).refine(data => {
  // Check if termination date is after hire date
  if (data.terminationDate && data.hireDate) {
    return data.terminationDate > data.hireDate;
  }
  return true;
}, {
  message: "Ngày nghỉ việc phải sau ngày vào làm",
  path: ["terminationDate"]
});

export type EmployeeValidation = z.infer<typeof employeeValidationSchema>;
