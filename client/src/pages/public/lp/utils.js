import { useEffect } from 'react'
import { CONTACT_WHATSAPP } from '../../../lib/social'

// Bookings from the landing pages go to Thalita's JotForm consultation form.
// `selectA7` pre-ticks the service checkbox on the form.
const JOTFORM_URL = 'https://form.jotform.com/263010596024853'

export const bookingUrl = service => `${JOTFORM_URL}?selectA7=${encodeURIComponent(service)}`

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
