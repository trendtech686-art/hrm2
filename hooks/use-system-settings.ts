/**
 * useSystemSettings - React Query Hook for System Settings
 * 
 * Replaces localStorage storage for:
 * - general-settings
 * - security-settings  
 * - media-settings
 * - integration-settings
 * 
 * All stored via /api/user-preferences endpoint with category 'system-settings'
 * 
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// Query Keys Factory
// ============================================================================

export const systemSettingsKeys = {
  all: ['system-settings'] as const,
  setting: (key: string) => [...systemSettingsKeys.all, key] as const,
};

// ============================================================================
// Types
// ============================================================================

export interface GeneralSettings {
  // Thông tin doanh nghiệp
  companyName: string;
  companyAddress: string;
  taxCode: string;
  phoneNumber: string;
  website: string;
  email: string;
  legalRepresentative: string;
  adminEmail: string;
  defaultRole: string;
  // Branding
  logoUrl: string;
  faviconUrl: string;
  // Định dạng hệ thống
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  // Hiển thị
  defaultPageSize: number;
  thousandSeparator: string;
  decimalSeparator: string;
  // Ngôn ngữ
  language: string;
}

export interface SecuritySettings {
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requireStrongPassword: boolean;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays: number;
  enableAuditLog: boolean;
  enableIpWhitelist: boolean;
  ipWhitelist: string[];
}

export interface MediaSettings {
  maxUploadSize: number;
  allowedImageTypes: string[];
  allowedDocumentTypes: string[];
  imageCompressionQuality: number;
  enableWatermark: boolean;
  watermarkText: string;
  watermarkPosition: string;
  generateThumbnails: boolean;
  thumbnailSize: number;
  storagePath: string;
}

export interface IntegrationSettings {
  // Email SMTP
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  smtpFromName: string;
  smtpFromEmail: string;
  // SMS
  smsEnabled: boolean;
  smsProvider: string;
  smsApiKey: string;
  smsApiSecret: string;
  smsSenderName: string;
  // Webhook
  webhookEnabled: boolean;
  webhookUrl: string;
  webhookSecret: string;
  webhookEvents: string[];
}

// ============================================================================
// Defaults
// ============================================================================

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  companyName: '',
  companyAddress: '',
  taxCode: '',
  phoneNumber: '',
  website: '',
  email: '',
  legalRepresentative: '',
  adminEmail: '',
  defaultRole: 'employee',
  logoUrl: '',
  faviconUrl: '',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'VND',
  defaultPageSize: 20,
  thousandSeparator: '.',
  decimalSeparator: ',',
  language: 'vi',
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  enableTwoFactor: false,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  requireStrongPassword: true,
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  passwordExpiryDays: 90,
  enableAuditLog: true,
  enableIpWhitelist: false,
  ipWhitelist: [],
};

export const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  maxUploadSize: 10,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  imageCompressionQuality: 80,
  enableWatermark: false,
  watermarkText: '',
  watermarkPosition: 'bottom-right',
  generateThumbnails: true,
  thumbnailSize: 200,
  storagePath: 'uploads',
};

export const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  smtpEnabled: false,
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: true,
  smtpUser: '',
  smtpPassword: '',
  smtpFromName: '',
  smtpFromEmail: '',
  smsEnabled: false,
  smsProvider: 'twilio',
  smsApiKey: '',
  smsApiSecret: '',
  smsSenderName: '',
  webhookEnabled: false,
  webhookUrl: '',
  webhookSecret: '',
  webhookEvents: [],
};

// ============================================================================
// Generic Settings Hook Factory (React Query)
// ============================================================================

function createSystemSettingsHook<T extends object>(
  preferenceKey: string,
  defaultSettings: T
) {
  return function useSystemSettings() {
    const queryClient = useQueryClient();
    const queryKey = systemSettingsKeys.setting(preferenceKey);

    // Query for fetching settings
    const { data: settings = defaultSettings, isLoading, error } = useQuery({
      queryKey,
      queryFn: async (): Promise<T> => {
        const response = await fetch(
          `/api/user-preferences?category=system-settings&key=${preferenceKey}`
        );
        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        return data.value ? { ...defaultSettings, ...data.value } : defaultSettings;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });

    // Mutation for saving settings with optimistic updates
    const mutation = useMutation({
      mutationFn: async (newSettings: T) => {
        const response = await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'system-settings',
            key: preferenceKey,
            value: newSettings,
          }),
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return newSettings;
      },
      onMutate: async (newSettings) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });
        
        // Snapshot previous value
        const previousSettings = queryClient.getQueryData<T>(queryKey);
        
        // Optimistic update
        queryClient.setQueryData<T>(queryKey, newSettings);
        
        return { previousSettings };
      },
      onError: (_err, _newSettings, context) => {
        // Rollback on error
        if (context?.previousSettings) {
          queryClient.setQueryData<T>(queryKey, context.previousSettings);
        }
      },
      onSettled: () => {
        // Refetch to ensure sync
        queryClient.invalidateQueries({ queryKey });
      },
    });

    // Update settings
    const setSettings = useCallback((newSettings: T) => {
      mutation.mutate(newSettings);
    }, [mutation]);

    // Update single field
    const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
      const newSettings = { ...settings, [key]: value };
      mutation.mutate(newSettings);
    }, [settings, mutation]);

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
      mutation.mutate(defaultSettings);
    }, [mutation]);

    // Force save immediately (same as setSettings with React Query)
    const saveImmediately = useCallback(async () => {
      try {
        await mutation.mutateAsync(settings);
        return true;
      } catch {
        return false;
      }
    }, [mutation, settings]);

    return {
      settings,
      setSettings,
      updateField,
      isLoading,
      isSaving: mutation.isPending,
      error: error?.message || null,
      resetToDefaults,
      saveImmediately,
    };
  };
}

// ============================================================================
// Exported Hooks
// ============================================================================

export const useGeneralSettings = createSystemSettingsHook<GeneralSettings>(
  'general-settings',
  DEFAULT_GENERAL_SETTINGS
);

export const useSecuritySettings = createSystemSettingsHook<SecuritySettings>(
  'security-settings',
  DEFAULT_SECURITY_SETTINGS
);

export const useMediaSettings = createSystemSettingsHook<MediaSettings>(
  'media-settings',
  DEFAULT_MEDIA_SETTINGS
);

export const useIntegrationSettings = createSystemSettingsHook<IntegrationSettings>(
  'integration-settings',
  DEFAULT_INTEGRATION_SETTINGS
);

// ============================================================================
// Deprecated Functions - For backward compatibility
// ============================================================================

/**
 * @deprecated Use useGeneralSettings() hook instead
 */
export function loadGeneralSettings(): GeneralSettings {
  return DEFAULT_GENERAL_SETTINGS;
}

/**
 * @deprecated Use useGeneralSettings().setSettings() instead
 */
export function saveGeneralSettings(_settings: GeneralSettings): void {
}

/**
 * @deprecated Use useSecuritySettings() hook instead
 */
export function loadSecuritySettings(): SecuritySettings {
  return DEFAULT_SECURITY_SETTINGS;
}

/**
 * @deprecated Use useSecuritySettings().setSettings() instead
 */
export function saveSecuritySettings(_settings: SecuritySettings): void {
}

/**
 * @deprecated Use useMediaSettings() hook instead
 */
export function loadMediaSettings(): MediaSettings {
  return DEFAULT_MEDIA_SETTINGS;
}

/**
 * @deprecated Use useMediaSettings().setSettings() instead
 */
export function saveMediaSettings(_settings: MediaSettings): void {
}

/**
 * @deprecated Use useIntegrationSettings() hook instead
 */
export function loadIntegrationSettings(): IntegrationSettings {
  return DEFAULT_INTEGRATION_SETTINGS;
}

/**
 * @deprecated Use useIntegrationSettings().setSettings() instead
 */
export function saveIntegrationSettings(_settings: IntegrationSettings): void {
}
