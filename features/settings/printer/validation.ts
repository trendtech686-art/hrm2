import { z } from 'zod';

// =============================================
// TEMPLATE TYPE & PAPER SIZE
// =============================================

export const templateTypeSchema = z.enum([
  'order',
  'receipt',
  'payment',
  'warranty',
  'inventory-check',
  'stock-transfer',
  'sales-return',
  'purchase-order',
  'packing',
  'quote',
  'delivery',
  'shipping-label',
  'product-label',
  'stock-in',
  'supplier-return',
  'complaint',
  'penalty',
  'leave',
  'cost-adjustment',
  'handover',
  'payroll',
  'payslip',
  'attendance',
]);

export const paperSizeSchema = z.enum(['A4', 'A5', 'A6', 'K80', 'K57']);

// =============================================
// PRINT TEMPLATE SCHEMAS
// =============================================

export const createPrintTemplateSchema = z.object({
  id: z.string().min(1, 'Mã mẫu in không được để trống'),
  type: templateTypeSchema,
  name: z.string().min(1, 'Tên mẫu in không được để trống'),
  content: z.string().min(1, 'Nội dung mẫu in không được để trống'),
  paperSize: paperSizeSchema,
  isActive: z.boolean().default(true),
});

export const updatePrintTemplateSchema = createPrintTemplateSchema.partial();

export const printTemplateFilterSchema = z.object({
  search: z.string().optional(),
  type: templateTypeSchema.optional(),
  paperSize: paperSizeSchema.optional(),
  isActive: z.boolean().optional(),
});

export type CreatePrintTemplateInput = z.infer<typeof createPrintTemplateSchema>;
export type UpdatePrintTemplateInput = z.infer<typeof updatePrintTemplateSchema>;
export type PrintTemplateFilter = z.infer<typeof printTemplateFilterSchema>;

// =============================================
// TEMPLATE VARIABLE SCHEMAS
// =============================================

export const templateVariableSchema = z.object({
  key: z.string().min(1, 'Key biến không được để trống'),
  label: z.string().min(1, 'Nhãn biến không được để trống'),
  description: z.string().optional(),
  group: z.string().optional(),
});

export const createTemplateVariableSchema = templateVariableSchema;
export const updateTemplateVariableSchema = templateVariableSchema.partial();

export type TemplateVariableInput = z.infer<typeof templateVariableSchema>;
export type CreateTemplateVariableInput = z.infer<typeof createTemplateVariableSchema>;
export type UpdateTemplateVariableInput = z.infer<typeof updateTemplateVariableSchema>;

// =============================================
// PRINTER SETTINGS SCHEMAS
// =============================================

export const printerSettingsSchema = z.object({
  defaultPaperSize: paperSizeSchema.default('A4'),
  defaultPrinterName: z.string().optional(),
  showPreviewBeforePrint: z.boolean().default(true),
  autoPrintOnCreate: z.boolean().default(false),
  printCopies: z.number().int().min(1, 'Số bản in phải lớn hơn 0').default(1),
  printMargins: z.object({
    top: z.number().min(0).default(10),
    right: z.number().min(0).default(10),
    bottom: z.number().min(0).default(10),
    left: z.number().min(0).default(10),
  }).optional(),
});

export const updatePrinterSettingsSchema = printerSettingsSchema.partial();

export type PrinterSettingsInput = z.infer<typeof printerSettingsSchema>;
export type UpdatePrinterSettingsInput = z.infer<typeof updatePrinterSettingsSchema>;

// =============================================
// PRINT JOB SCHEMAS
// =============================================

export const createPrintJobSchema = z.object({
  templateId: z.string().min(1, 'Mẫu in không được để trống'),
  templateType: templateTypeSchema,
  documentId: z.string().min(1, 'Mã chứng từ không được để trống'),
  documentType: z.string().min(1, 'Loại chứng từ không được để trống'),
  copies: z.number().int().min(1).default(1),
  printerName: z.string().optional(),
  paperSize: paperSizeSchema.optional(),
});

export type CreatePrintJobInput = z.infer<typeof createPrintJobSchema>;
