import type { MetadataRoute } from 'next'

/**
 * Dynamic sitemap generation for SEO
 * 
 * Only includes public-facing pages. Authenticated routes are excluded
 * because they're blocked by robots.txt and require login to access.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      // Public warranty tracking page
      url: `${baseUrl}/warranty/tracking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      // Public complaint tracking page
      url: `${baseUrl}/complaint-tracking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]
}
