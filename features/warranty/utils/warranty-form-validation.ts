import { toast } from 'sonner';
import type { WarrantyFormValues, WarrantyTicket } from '../types';

/**
 * Validate form data cho warranty form
 * 
 * @param data - Form values
 * @param isEditing - Đang ở chế độ edit hay không
 * @param allTickets - Tất cả tickets để check duplicate
 * @returns true nếu valid, false nếu không
 */
export function validateWarrantyFormData(
  data: WarrantyFormValues,
  isEditing: boolean,
  allTickets: WarrantyTicket[]
): boolean {
  // Check customer
  if (!data.customer) {
    toast.error('Thiếu thông tin khách hàng', { 
      description: 'Vui lòng chọn khách hàng từ danh sách',
      duration: 4000
    });
    return false;
  }
  if (!data.customer.name || data.customer.name.trim() === '') {
    toast.error('Thiếu tên khách hàng', { 
      description: 'Tên khách hàng không được để trống',
      duration: 4000
    });
    return false;
  }
  if (!data.customer.phone || data.customer.phone.trim() === '') {
    toast.error('Thiếu số điện thoại', { 
      description: 'Số điện thoại khách hàng không được để trống',
      duration: 4000
    });
    return false;
  }
  
  // Check branch
  if (!data.branchSystemId) {
    toast.error('Thiếu chi nhánh', { 
      description: 'Vui lòng chọn chi nhánh xử lý',
      duration: 4000
    });
    return false;
  }
  
  // Check employee
  if (!data.employeeSystemId) {
    toast.error('Thiếu nhân viên', { 
      description: 'Vui lòng chọn nhân viên xử lý',
      duration: 4000
    });
    return false;
  }
  
  // Check warranty ID duplicate (only if provided)
  if (!isEditing && data.id && data.id.trim() !== '') {
    const idToCheck = data.id.trim();
    const existingTicket = allTickets.find(t => t.id === idToCheck);
    if (existingTicket) {
      toast.error('Mã phiếu đã tồn tại', { 
        description: `Mã "${data.id}" đã được sử dụng. Vui lòng nhập mã khác hoặc để trống để tự động tạo.`,
        duration: 5000
      });
      return false;
    }
  }
  
  // Check tracking code
  if (!data.trackingCode || data.trackingCode.trim() === '') {
    toast.error('Thiếu mã vận đơn', { 
      description: 'Vui lòng nhập mã vận đơn',
      duration: 4000
    });
    return false;
  }
  
  // Check images
  if (!data.receivedImages || data.receivedImages.length === 0) {
    toast.error('Thiếu hình ảnh', { 
      description: 'Vui lòng chụp hình đơn hàng lúc nhận (tối thiểu 1 ảnh)',
      duration: 4000
    });
    return false;
  }
  
  // Check notes for "return" resolution products
  const returnProducts = data.products.filter(p => p.resolution === 'return');
  const returnProductsWithoutNotes = returnProducts.filter(p => !p.issueDescription || p.issueDescription.trim() === '');
  if (returnProductsWithoutNotes.length > 0) {
    toast.error('Thiếu ghi chú cho sản phẩm trả lại', { 
      description: `Có ${returnProductsWithoutNotes.length} sản phẩm có kết quả "Trả lại" nhưng chưa ghi rõ lý do. Vui lòng bổ sung ghi chú.`,
      duration: 5000
    });
    return false;
  }
  
  return true;
}

/**
 * Validate branch và employee existence
 */
export function validateBranchAndEmployee(
  branchSystemId: string,
  employeeSystemId: string,
  branches: Array<{ systemId: string; name: string }>,
  employees: Array<{ systemId: string; fullName: string }>
): { branch: { systemId: string; name: string } | null; employee: { systemId: string; fullName: string } | null } {
  const branch = branches.find(b => b.systemId === branchSystemId);
  const employee = employees.find(e => e.systemId === employeeSystemId);
  
  if (!branch) {
    toast.error('Lỗi dữ liệu', { 
      description: `Không tìm thấy chi nhánh với ID: ${branchSystemId}`,
      duration: 5000
    });
  }
  if (!employee) {
    toast.error('Lỗi dữ liệu', { 
      description: `Không tìm thấy nhân viên với ID: ${employeeSystemId}`,
      duration: 5000
    });
  }
  
  return { branch: branch || null, employee: employee || null };
}
