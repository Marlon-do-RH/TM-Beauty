import { useEffect } from 'react'
import { CONTACT_WHATSAPP } from '../../../lib/social'

// Bookings from the landing pages go to the site's own booking page (Square).
export const BOOKING_PATH = '/booking'

export const whatsappUrl = service =>
  `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(`Hi Thalita, I'd like to know if ${service} is right for my hair.`)}`

/** Sets the tab title and meta description while the page is mounted. */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    let meta = document.querySelector('meta[name="description"]')
    const created = !meta
    if (created) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDesc = meta.content
    document.title = title
    meta.content = description
    return () => {
      document.title = prevTitle
      if (created) meta.remove()
      else meta.content = prevDesc
    }
  }, [title, description])
}
