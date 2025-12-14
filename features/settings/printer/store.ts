import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PrintTemplate, TemplateType, PaperSize } from './types';
import { getDefaultTemplate } from './default-templates';

// Key format: "type-size-branchId" e.g. "order-A4-branch1" or "type-size" for all branches
type TemplateKey = string;

interface PrintTemplateState {
  templates: Record<TemplateKey, PrintTemplate>;
  defaultSizes: Record<TemplateType, PaperSize>; // Khổ in mặc định cho mỗi loại mẫu
  
  // Actions
  getTemplate: (type: TemplateType, size: PaperSize, branchId?: string) => PrintTemplate;
  updateTemplate: (type: TemplateType, size: PaperSize, content: string, branchId?: string) => void;
  updateTemplateAllBranches: (type: TemplateType, size: PaperSize, content: string) => void;
  resetTemplate: (type: TemplateType, size: PaperSize, branchId?: string) => void;
  setDefaultSize: (type: TemplateType, size: PaperSize) => void;
  getDefaultSize: (type: TemplateType) => PaperSize;
}

const getTemplateKey = (type: TemplateType, size: PaperSize, branchId?: string): TemplateKey => 
  branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;

export const usePrintTemplateStore = create<PrintTemplateState>()(
  persist(
    (set, get) => ({
      templates: {} as Record<TemplateKey, PrintTemplate>,
      defaultSizes: {} as Record<TemplateType, PaperSize>,

      getTemplate: (type: TemplateType, size: PaperSize, branchId?: string) => {
        const state = get();
        const key = getTemplateKey(type, size, branchId);
        
        // Thử tìm template cho branch cụ thể
        const branchTemplate = state.templates[key];
        if (branchTemplate && branchTemplate.content && branchTemplate.content.trim() !== '') {
          // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
          // - {{#line_items}} : Mustache syntax không được hỗ trợ
          // - {line_index} : biến cũ, phải dùng {line_stt}
          if ((type === 'payroll' || type === 'payslip') && 
              (branchTemplate.content.includes('{{#line_items}}') || branchTemplate.content.includes('{line_index}'))) {
            // Template đang dùng syntax cũ không được hỗ trợ -> reset về mặc định
            return {
              id: `template-${key}`,
              type,
              name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
              content: getDefaultTemplate(type),
              paperSize: size,
              isActive: true,
              updatedAt: new Date().toISOString(),
            };
          }
          return branchTemplate;
        }
        
        // Nếu không có template cho branch, tìm template chung
        const generalKey = getTemplateKey(type, size);
        const generalTemplate = state.templates[generalKey];
        if (branchId && generalTemplate && generalTemplate.content && generalTemplate.content.trim() !== '') {
          // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
          if ((type === 'payroll' || type === 'payslip') && 
              (generalTemplate.content.includes('{{#line_items}}') || generalTemplate.content.includes('{line_index}'))) {
            return {
              id: `template-${key}`,
              type,
              name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
              content: getDefaultTemplate(type),
              paperSize: size,
              isActive: true,
              updatedAt: new Date().toISOString(),
            };
          }
          return generalTemplate;
        }
        
        // Return default template if not exists or empty
        // Đây là điểm quan trọng: nếu chưa có template hoặc template trống
        // thì sử dụng mẫu mặc định của hệ thống
        return {
          id: `template-${key}`,
          type,
          name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
          content: getDefaultTemplate(type),
          paperSize: size,
          isActive: true,
          updatedAt: new Date().toISOString(),
        };
      },

      updateTemplate: (type, size, content, branchId?) => {
        const key = getTemplateKey(type, size, branchId);
        set((state) => {
          const current = state.templates[key] || {
            id: `template-${key}`,
            type,
            name: 'Mẫu in',
            content: getDefaultTemplate(type),
            paperSize: size,
            isActive: true,
            updatedAt: new Date().toISOString(),
          };

          return {
            templates: {
              ...state.templates,
              [key]: {
                ...current,
                content,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      updateTemplateAllBranches: (type, size, content) => {
        // Lưu template chung (không có branchId) - sẽ áp dụng cho tất cả chi nhánh
        const key = getTemplateKey(type, size);
        set((state) => {
          // Xóa tất cả template cụ thể của các branch cho type và size này
          const newTemplates = { ...state.templates };
          Object.keys(newTemplates).forEach((k) => {
            if (k.startsWith(`${type}-${size}-`)) {
              delete newTemplates[k];
            }
          });

          return {
            templates: {
              ...newTemplates,
              [key]: {
                id: `template-${key}`,
                type,
                name: 'Mẫu in',
                content,
                paperSize: size,
                isActive: true,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      resetTemplate: (type, size, branchId?) => {
        const key = getTemplateKey(type, size, branchId);
        set((state) => ({
          templates: {
            ...state.templates,
            [key]: {
              id: `template-${key}`,
              type,
              name: 'Mẫu mặc định',
              content: getDefaultTemplate(type),
              paperSize: size,
              isActive: true,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      setDefaultSize: (type: TemplateType, size: PaperSize) => {
        set((state) => ({
          defaultSizes: {
            ...state.defaultSizes,
            [type]: size,
          },
        }));
      },

      getDefaultSize: (type: TemplateType) => {
        const state = get();
        return state.defaultSizes[type] || 'A4';
      },
    }),
    {
      name: 'print-templates-storage',
    }
  )
);
