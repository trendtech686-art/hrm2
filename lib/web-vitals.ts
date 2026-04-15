/**
 * Web Vitals Reporting
 * 
 * Reports Core Web Vitals (LCP, FID, CLS, TTFB, INP) to the centralized logger.
 * SpeedInsights only works on Vercel — this provides CWV monitoring for any deployment.
 * 
 * Usage: Call `reportWebVitals()` once in the root layout or providers component.
 */

import { logInfo } from './logger'

type WebVitalMetric = {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

/**
 * Initialize Web Vitals reporting.
 * Dynamically imports web-vitals to avoid bundle impact.
 * Logs metrics via the centralized logger in production.
 */
export async function reportWebVitals() {
  if (typeof window === 'undefined') return

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- web-vitals is optional; install with `npm i web-vitals`
    const webVitals = await import('web-vitals')
    const { onCLS, onFID, onLCP, onTTFB, onINP } = webVitals

    const sendMetric = (metric: WebVitalMetric) => {
      // Log to console in dev, to logger (+ Sentry) in production
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`[WebVital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)
      } else {
        logInfo(`[WebVital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`, {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        })
      }
    }

    onCLS(sendMetric)
    onFID(sendMetric)
    onLCP(sendMetric)
    onTTFB(sendMetric)
    onINP(sendMetric)
  } catch {
    // web-vitals not installed — silently skip
  }
}
