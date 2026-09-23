import { useEffect } from 'react'

const DEFAULT_SITE_URL = 'https://sa-group-hostels.vercel.app'
const DEFAULT_SITE_NAME = 'SA Group of Hotels & Hostels'

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, String(value))
    }
  })

  return element
}

function ensureLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
  return element
}

export default function SEO({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  schema,
}) {
  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
    const canonicalPath = path || window.location.pathname
    const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`
    const socialImage = image || `${siteUrl}/og-image.png`

    document.title = title

    ensureMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })

    ensureMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    })

    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    })

    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })

    ensureMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    })

    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    })

    ensureMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: DEFAULT_SITE_NAME,
    })

    ensureMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: 'en_PK',
    })

    ensureMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: socialImage,
    })

    ensureMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: DEFAULT_SITE_NAME,
    })

    ensureMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })

    ensureMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })

    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })

    ensureMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: socialImage,
    })

    ensureLink('canonical', canonicalUrl)

    const existingSchema = document.getElementById('page-structured-data')
    existingSchema?.remove()

    if (schema) {
      const script = document.createElement('script')
      script.id = 'page-structured-data'
      script.type = 'application/ld+json'

      const resolvedSchema = Array.isArray(schema)
        ? schema.map((item) => ({
            ...item,
            url: item.url || canonicalUrl,
          }))
        : {
            ...schema,
            url: schema.url || canonicalUrl,
          }

      script.textContent = JSON.stringify(resolvedSchema)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById('page-structured-data')?.remove()
    }
  }, [title, description, path, image, type, noIndex, schema])

  return null
}
