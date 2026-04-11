'use client'

import { useState } from 'react'

interface ImageItem {
  id?: number
  imageUrl: string
  isPrimary: boolean
  displayOrder: number
}

interface MultiImageUploadProps {
  images: ImageItem[]
  onImagesChange: (images: ImageItem[]) => void
}

export default function MultiImageUpload({ images, onImagesChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newImages: ImageItem[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'products')
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
          newImages.push({
            imageUrl: data.imageUrl,
            isPrimary: images.length === 0 && i === 0, // İlk resim primary
            displayOrder: images.length + i
          })
        }
      }

      onImagesChange([...images, ...newImages])
    } catch (error) {
      alert('Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    onImagesChange(newImages)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
    
    // Update display order
    newImages.forEach((img, i) => {
      img.displayOrder = i
    })

    onImagesChange(newImages)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Ürün Görselleri
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Ana Görsel
                </div>
              )}

              {/* Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    title="Ana Görsel Yap"
                  >
                    ⭐
                  </button>
                )}
                
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    title="Yukarı Taşı"
                  >
                    ↑
                  </button>
                )}
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    title="Aşağı Taşı"
                  >
                    ↓
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                {uploading ? 'Yükleniyor...' : 'Görselleri seçin'}
              </span>
              {' veya sürükleyip bırakın'}
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP, GIF - Max 5MB - Çoklu seçim yapabilirsiniz
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          En az bir görsel ekleyin. İlk eklenen görsel otomatik olarak ana görsel olur.
        </p>
      )}
    </div>
  )
}
