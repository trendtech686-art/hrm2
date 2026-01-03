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

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

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
// Generic Settings Hook Factory
// ============================================================================

const DEBOUNCE_DELAY = 500;

function createSystemSettingsHook<T>(
  preferenceKey: string,
  defaultSettings: T
) {
  return function useSystemSettings() {
    const [settings, setSettings] = useState<T>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from API on mount
    useEffect(() => {
      const loadFromAPI = async () => {
        try {
          const response = await fetch(
            `/api/user-preferences?category=system-settings&key=${preferenceKey}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.value) {
              setSettings({ ...defaultSettings, ...data.value });
            }
          }
          setError(null);
        } catch (err) {
          console.error(`[useSystemSettings:${preferenceKey}] Failed to load:`, err);
          setError('Failed to load settings');
        } finally {
          setIsLoading(false);
        }
      };

      loadFromAPI();
    }, []);

    // Debounced save to API
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
      debounce(async (newSettings: T) => {
        setIsSaving(true);
        try {
          await fetch('/api/user-preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: 'system-settings',
              key: preferenceKey,
              value: newSettings,
            }),
          });
          setError(null);
        } catch (err) {
          console.error(`[useSystemSettings:${preferenceKey}] Failed to save:`, err);
          setError('Failed to save settings');
        } finally {
          setIsSaving(false);
        }
      }, DEBOUNCE_DELAY),
      []
    );

    // Update settings and save
    const updateSettings = useCallback((newSettings: T) => {
      setSettings(newSettings);
      debouncedSave(newSettings);
    }, [debouncedSave]);

    // Update single field
    const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
      setSettings(prev => {
        const newSettings = { ...prev, [key]: value };
        debouncedSave(newSettings);
        return newSettings;
      });
    }, [debouncedSave]);

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
      updateSettings(defaultSettings);
    }, [updateSettings]);

    // Force save immediately (cancel debounce)
    const saveImmediately = useCallback(async () => {
      debouncedSave.cancel();
      setIsSaving(true);
      try {
        await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'system-settings',
            key: preferenceKey,
            value: settings,
          }),
        });
        setError(null);
        return true;
      } catch (err) {
        console.error(`[useSystemSettings:${preferenceKey}] Failed to save:`, err);
        setError('Failed to save settings');
        return false;
      } finally {
        setIsSaving(false);
      }
    }, [debouncedSave, settings]);

    return {
      settings,
      setSettings: updateSettings,
      updateField,
      isLoading,
      isSaving,
      error,
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
  console.warn('[DEPRECATED] loadGeneralSettings() - Use useGeneralSettings() hook instead');
  return DEFAULT_GENERAL_SETTINGS;
}

/**
 * @deprecated Use useGeneralSettings().setSettings() instead
 */
export function saveGeneralSettings(_settings: GeneralSettings): void {
  console.warn('[DEPRECATED] saveGeneralSettings() - Use useGeneralSettings() hook instead');
}

/**
 * @deprecated Use useSecuritySettings() hook instead
 */
export function loadSecuritySettings(): SecuritySettings {
  console.warn('[DEPRECATED] loadSecuritySettings() - Use useSecuritySettings() hook instead');
  return DEFAULT_SECURITY_SETTINGS;
}

/**
 * @deprecated Use useSecuritySettings().setSettings() instead
 */
export function saveSecuritySettings(_settings: SecuritySettings): void {
  console.warn('[DEPRECATED] saveSecuritySettings() - Use useSecuritySettings() hook instead');
}

/**
 * @deprecated Use useMediaSettings() hook instead
 */
export function loadMediaSettings(): MediaSettings {
  console.warn('[DEPRECATED] loadMediaSettings() - Use useMediaSettings() hook instead');
  return DEFAULT_MEDIA_SETTINGS;
}

/**
 * @deprecated Use useMediaSettings().setSettings() instead
 */
export function saveMediaSettings(_settings: MediaSettings): void {
  console.warn('[DEPRECATED] saveMediaSettings() - Use useMediaSettings() hook instead');
}

/**
 * @deprecated Use useIntegrationSettings() hook instead
 */
export function loadIntegrationSettings(): IntegrationSettings {
  console.warn('[DEPRECATED] loadIntegrationSettings() - Use useIntegrationSettings() hook instead');
  return DEFAULT_INTEGRATION_SETTINGS;
}

/**
 * @deprecated Use useIntegrationSettings().setSettings() instead
 */
export function saveIntegrationSettings(_settings: IntegrationSettings): void {
  console.warn('[DEPRECATED] saveIntegrationSettings() - Use useIntegrationSettings() hook instead');
}
