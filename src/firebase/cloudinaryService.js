export async function uploadToCloudinary(file) {
  if (!file) return null

  const cloudName = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || 'dl1lswlpb'
  const uploadPreset = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'azhar-collection'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Gagal mengunggah foto ke Cloudinary')
  }

  const data = await res.json()
  if (!data.secure_url) {
    throw new Error('Tidak menerima URL gambar dari Cloudinary')
  }

  return data.secure_url
}

export function extractPublicId(url) {
  if (!url || typeof url !== 'string') return null
  if (!url.includes('res.cloudinary.com') && !url.includes('cloudinary.com')) return null

  const uploadIndex = url.indexOf('/image/upload/')
  if (uploadIndex === -1) return null

  let path = url.slice(uploadIndex + '/image/upload/'.length)
  path = path.split('?')[0]

  const versionMatch = path.match(/(?:^|\/)v\d+\/(.+)$/)
  if (versionMatch) {
    path = versionMatch[1]
  } else {
    const segments = path.split('/')
    while (segments.length > 1 && /^[a-z]{1,3}_/.test(segments[0])) {
      segments.shift()
    }
    path = segments.join('/')
  }

  const lastDot = path.lastIndexOf('.')
  if (lastDot !== -1) {
    path = path.slice(0, lastDot)
  }

  return path || null
}

export async function deleteFromCloudinary(imageUrlOrPublicId) {
  if (!imageUrlOrPublicId || typeof imageUrlOrPublicId !== 'string') return false

  const publicId = extractPublicId(imageUrlOrPublicId) || (!imageUrlOrPublicId.includes('://') ? imageUrlOrPublicId : null)
  if (!publicId) return false

  const cloudName = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || 'dl1lswlpb'
  const apiKey = import.meta.env?.VITE_CLOUDINARY_API_KEY || '498637479124293'
  const apiSecret = import.meta.env?.VITE_CLOUDINARY_API_SECRET || 'HXNbvKr8WFmjLzrYyiQG4IPILnM'

  if (!apiKey || !apiSecret) {
    console.warn('VITE_CLOUDINARY_API_KEY atau VITE_CLOUDINARY_API_SECRET belum dikonfigurasi di file .env')
    return false
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToSign)
    const cryptoObj = globalThis.crypto || window.crypto
    const hashBuffer = await cryptoObj.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    const formData = new FormData()
    formData.append('public_id', publicId)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    )

    const result = await res.json().catch(() => ({}))
    return result.result === 'ok'
  } catch (err) {
    console.error('Gagal menghapus gambar dari Cloudinary:', err)
    return false
  }
}
