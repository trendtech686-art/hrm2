/**
 * Email Service - Server-side email sending via SMTP
 * Uses nodemailer with SMTP settings from Setting table (group='smtp')
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';

interface SmtpConfig {
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFromName: string;
  smtpFromEmail: string;
}

let cachedConfig: SmtpConfig | null = null;
let configLoadedAt = 0;
const CONFIG_TTL = 5 * 60 * 1000; // 5 minutes

const DEFAULT_SMTP: SmtpConfig = {
  smtpEnabled: false,
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpFromName: '',
  smtpFromEmail: '',
};

/**
 * Load SMTP configuration from Setting table (group='smtp', key='smtp_settings')
 */
async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const now = Date.now();
  if (cachedConfig && now - configLoadedAt < CONFIG_TTL) {
    return cachedConfig;
  }

  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'smtp_settings', group: 'smtp' } },
    });

    if (!setting?.value) {
      cachedConfig = DEFAULT_SMTP;
      configLoadedAt = now;
      return DEFAULT_SMTP;
    }

    const v = setting.value as Record<string, unknown>;
    const config: SmtpConfig = {
      smtpEnabled: Boolean(v.smtpHost), // enabled if host is configured
      smtpHost: String(v.smtpHost || ''),
      smtpPort: Number(v.smtpPort) || 587,
      smtpUser: String(v.smtpUser || ''),
      smtpPassword: String(v.smtpPassword || ''),
      smtpFromName: String(v.smtpFromName || ''),
      smtpFromEmail: String(v.smtpFromEmail || ''),
    };

    cachedConfig = config;
    configLoadedAt = now;
    return config;
  } catch (error) {
    logError('Failed to load SMTP config', error);
    return null;
  }
}

/**
 * Create nodemailer transporter from config
 * Note: nodemailer `secure`:
 *   - true  = implicit TLS (port 465)
 *   - false = STARTTLS upgrade (port 587, 25) — still encrypted if server supports it
 */
function createTransporter(config: SmtpConfig): Transporter {
  // Port 465 → implicit TLS (secure: true)
  // Port 587/25/other → STARTTLS (secure: false)
  const useImplicitTLS = config.smtpPort === 465;

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: useImplicitTLS,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email via configured SMTP
 * Returns true if sent successfully, false otherwise
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const config = await getSmtpConfig();

  if (!config?.smtpEnabled || !config.smtpHost) {
    return false; // SMTP not configured
  }

  try {
    const transporter = createTransporter(config);

    await transporter.sendMail({
      from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    logError('Failed to send email', error);
    return false;
  }
}
