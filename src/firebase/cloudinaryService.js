export async function uploadToCloudinary(file) {
  if (!file) return null

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dl1lswlpb'
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'azhar-collection'

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
