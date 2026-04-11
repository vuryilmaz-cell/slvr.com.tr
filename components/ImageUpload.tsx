'use client'

import { useState } from 'react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  label?: string
}

export default function ImageUpload({ currentImage, onImageChange, label = 'Ürün Görseli' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'categories') 

      const token = localStorage.getItem('token')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        console.log('✅ Upload başarılı:', data)
        console.log('🔗 imageUrl:', data.imageUrl)
        console.log('🔄 onImageChange çağrılıyor...')
        onImageChange(data.imageUrl)
        console.log('✔️ onImageChange tamamlandı')
      } else {
        const data = await res.json()
        alert(data.error?.message || 'Yükleme başarısız')
        setPreview(currentImage || '')
      }
    } catch (error) {
      alert('Yükleme hatası')
      setPreview(currentImage || '')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-cover"
            />
            <div className="flex gap-2 justify-center">
              <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {uploading ? 'Yükleniyor...' : 'Değiştir'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setPreview('')
                  onImageChange('')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Kaldır
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:underline">
                  {uploading ? 'Yükleniyor...' : 'Resim seçin'}
                </span>
                {' veya sürükleyip bırakın'}
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP, GIF - Max 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  )
}
