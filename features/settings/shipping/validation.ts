import { z } from 'zod';

// =============================================
// SHIPPING PARTNER STATUS
// =============================================

export const shippingPartnerStatusSchema = z.enum(['Đang hợp tác', 'Ngừng hợp tác']);

// =============================================
// SHIPPING SERVICE SCHEMAS
// =============================================

export const shippingServiceSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().min(1, 'Mã dịch vụ không được để trống'),
  name: z.string().min(1, 'Tên dịch vụ không được để trống'),
});

export const createShippingServiceSchema = shippingServiceSchema;
export const updateShippingServiceSchema = shippingServiceSchema.partial();

export type ShippingServiceInput = z.infer<typeof shippingServiceSchema>;
export type CreateShippingServiceInput = z.infer<typeof createShippingServiceSchema>;
export type UpdateShippingServiceInput = z.infer<typeof updateShippingServiceSchema>;

// =============================================
// CREDENTIAL FIELD SCHEMAS
// =============================================

export const credentialFieldSchema = z.object({
  id: z.string().min(1, 'Mã trường không được để trống'),
  label: z.string().min(1, 'Nhãn trường không được để trống'),
  placeholder: z.string().default(''),
  required: z.boolean().default(false),
  type: z.enum(['text', 'password', 'email']).optional(),
});

export type CredentialFieldInput = z.infer<typeof credentialFieldSchema>;

// =============================================
// ADDITIONAL SERVICE SCHEMAS
// =============================================

export const additionalServiceSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().min(1, 'Mã dịch vụ bổ sung không được để trống'),
  label: z.string().min(1, 'Nhãn không được để trống'),
  tooltip: z.string().optional(),
  type: z.enum(['checkbox', 'radio', 'select', 'text', 'number', 'date']).optional(),
  options: z.array(
    z.union([
      z.string(),
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ])
  ).optional(),
  placeholder: z.string().optional(),
  buttonLabel: z.string().optional(),
  disabled: z.boolean().optional(),
  gridSpan: z.union([z.literal(1), z.literal(2)]).optional(),
});

export type AdditionalServiceInput = z.infer<typeof additionalServiceSchema>;

// =============================================
// PARTNER CONFIGURATION SCHEMAS
// =============================================

export const partnerConfigurationSchema = z.object({
  credentialFields: z.array(credentialFieldSchema),
  payerOptions: z.array(z.enum(['shop', 'customer'])),
  additionalServices: z.array(additionalServiceSchema),
});

export type PartnerConfigurationInput = z.infer<typeof partnerConfigurationSchema>;

// =============================================
// SHIPPING PARTNER SCHEMAS
// =============================================

export const createShippingPartnerSchema = z.object({
  id: z.string().min(1, 'Mã đối tác vận chuyển không được để trống'),
  name: z.string().min(1, 'Tên đối tác không được để trống'),
  logoUrl: z.string().url('URL logo không hợp lệ').or(z.literal('')),
  description: z.string().default(''),
  phone: z.string().default(''),
  address: z.string().default(''),
  contactPerson: z.string().optional(),
  status: shippingPartnerStatusSchema.default('Đang hợp tác'),
  services: z.array(shippingServiceSchema).default([]),
  isConnected: z.boolean().default(false),
  config: partnerConfigurationSchema.optional(),
  credentials: z.record(z.string(), z.unknown()).default({}),
  configuration: z.record(z.string(), z.unknown()).default({}),
});

export const updateShippingPartnerSchema = createShippingPartnerSchema.partial();

export const shippingPartnerFilterSchema = z.object({
  search: z.string().optional(),
  status: shippingPartnerStatusSchema.optional(),
  isConnected: z.boolean().optional(),
});

export type CreateShippingPartnerInput = z.infer<typeof createShippingPartnerSchema>;
export type UpdateShippingPartnerInput = z.infer<typeof updateShippingPartnerSchema>;
export type ShippingPartnerFilter = z.infer<typeof shippingPartnerFilterSchema>;

// =============================================
// SHIPPING PARTNER CONNECTION SCHEMAS
// =============================================

export const connectShippingPartnerSchema = z.object({
  partnerSystemId: z.string().min(1, 'Đối tác vận chuyển không được để trống'),
  credentials: z.record(z.string(), z.unknown()),
  configuration: z.record(z.string(), z.unknown()).optional(),
});

export const disconnectShippingPartnerSchema = z.object({
  partnerSystemId: z.string().min(1, 'Đối tác vận chuyển không được để trống'),
});

export type ConnectShippingPartnerInput = z.infer<typeof connectShippingPartnerSchema>;
export type DisconnectShippingPartnerInput = z.infer<typeof disconnectShippingPartnerSchema>;

// =============================================
// SHIPPING RATE CALCULATION SCHEMAS
// =============================================

export const calculateShippingRateSchema = z.object({
  partnerSystemId: z.string().min(1, 'Đối tác vận chuyển không được để trống'),
  serviceId: z.string().min(1, 'Dịch vụ vận chuyển không được để trống'),
  fromProvinceCode: z.string().min(1, 'Tỉnh/thành gửi không được để trống'),
  fromDistrictCode: z.string().min(1, 'Quận/huyện gửi không được để trống'),
  toProvinceCode: z.string().min(1, 'Tỉnh/thành nhận không được để trống'),
  toDistrictCode: z.string().min(1, 'Quận/huyện nhận không được để trống'),
  toWardCode: z.string().optional(),
  weight: z.number().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0'),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  codAmount: z.number().min(0).optional(),
  insuranceValue: z.number().min(0).optional(),
});

export type CalculateShippingRateInput = z.infer<typeof calculateShippingRateSchema>;
