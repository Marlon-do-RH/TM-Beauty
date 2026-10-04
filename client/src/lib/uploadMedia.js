export async function uploadToCloudinary(file, folder = 'tm-beauty/media') {
  const sigRes = await fetch(`/api/sign-upload?folder=${encodeURIComponent(folder)}`)
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json()
  const form = new FormData()
  form.append('file', file)
  form.append('signature', signature)
  form.append('timestamp', String(timestamp))
  form.append('api_key', api_key)
  form.append('folder', folder)
  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { method: 'POST', body: form })
  const data = await uploadRes.json()
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
  return data.secure_url
}

export async function saveSiteMedia({ section_id, url, caption }) {
  const res = await fetch('/api/site-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section_id, url, caption: caption || null }),
  })
  if (!res.ok) throw new Error('Failed to save photo')
  return res.json()
}

export async function deleteSiteMedia(id) {
  const res = await fetch(`/api/site-media?id=${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete photo')
}

export async function saveGalleryItem(payload) {
  const res = await fetch('/api/gallery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save gallery item')
  return res.json()
}

export async function updateGalleryItem(id, payload) {
  const res = await fetch(`/api/gallery?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update gallery item')
  return res.json()
}

export async function deleteGalleryItem(id) {
  const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete gallery item')
}
