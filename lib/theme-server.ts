/**
 * Server-side theme utilities
 * Used in RSC (React Server Components) to read theme from database
 * and inject CSS variables into HTML at SSR time
 */

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

const PREFERENCE_KEY = 'appearance'

export type ServerThemeData = {
    colorMode: 'light' | 'dark'
    fontSize: 'sm' | 'base' | 'lg'
    customThemeConfig: Record<string, string>
}

/**
 * Get theme data from database for the current authenticated user
 * Returns null if not authenticated or no theme saved
 */
export async function getServerTheme(): Promise<ServerThemeData | null> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return null
        }

        const preference = await prisma.userPreference.findUnique({
            where: {
                userId_key: {
                    userId: session.user.id,
                    key: PREFERENCE_KEY,
                },
            },
        })

        if (!preference?.value) {
            return null
        }

        const value = preference.value as Record<string, unknown>

        // Parse customThemeConfig
        const customThemeConfig: Record<string, string> = {}
        if (value.customThemeConfig && typeof value.customThemeConfig === 'object') {
            const raw = value.customThemeConfig as Record<string, unknown>
            for (const [key, val] of Object.entries(raw)) {
                if (typeof val === 'string' && val.length > 0) {
                    customThemeConfig[key] = val
                }
            }
        }

        return {
            colorMode: (value.colorMode as 'light' | 'dark') || 'light',
            fontSize: (value.fontSize as 'sm' | 'base' | 'lg') || 'base',
            customThemeConfig,
        }
    } catch (error) {
        console.error('[getServerTheme] Error:', error)
        return null
    }
}

/**
 * Generate inline CSS from theme config
 * Returns CSS string like: --primary: oklch(...); --background: oklch(...);
 */
export function generateThemeCSS(config: Record<string, string>): string {
    const lines: string[] = []
    for (const [key, value] of Object.entries(config)) {
        if (key.startsWith('--') && value) {
            lines.push(`${key}: ${value};`)
        }
    }
    return lines.join(' ')
}
