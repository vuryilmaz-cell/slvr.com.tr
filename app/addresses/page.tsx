'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Address {
  id: number
  title: string
  firstName: string
  lastName: string
  phone: string
  addressLine: string
  city: string
  district: string
  postalCode: string | null
  isDefault: boolean
}

export default function AddressesPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  const [formData, setFormData] = useState({
    title: 'Ev',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && token) {
      fetchAddresses()
    }
  }, [user, token, authLoading])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Fetch addresses error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(editingId ? 'Adres güncellendi!' : 'Adres eklendi!')
        setShowForm(false)
        setEditingId(null)
        resetForm()
        await fetchAddresses()
      } else {
        setErrorMessage(data.error || 'İşlem başarısız')
      }
    } catch (error) {
      setErrorMessage('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return

    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Adres silindi!')
        await fetchAddresses()
      } else {
        setErrorMessage(data.error || 'Silme işlemi başarısız')
      }
    } catch (error) {
      setErrorMessage('Silme işlemi başarısız')
    }
  }

  const resetForm = () => {
    setFormData({
      title: 'Ev',
      firstName: '',
      lastName: '',
      phone: '',
      addressLine: '',
      city: '',
      district: '',
      postalCode: '',
      isDefault: false,
    })
    setEditingId(null)
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Adres Defterim</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            {showForm ? 'İptal' : '+ Yeni Adres'}
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adres Başlığı</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  >
                    <option value="Ev">Ev</option>
                    <option value="İş">İş</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Varsayılan adres yap</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ad</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Soyad</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="0555 123 45 67"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adres</label>
                <textarea
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">İl</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">İlçe</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Posta Kodu</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {loading ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kaydet'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="border px-6 py-3 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz bulunmuyor.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              İlk Adresini Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{address.title}</h3>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    
                    <div className="text-gray-700 space-y-1">
                      <p className="font-medium">{address.firstName} {address.lastName}</p>
                      <p>{address.addressLine}</p>
                      <p>{address.district} / {address.city} {address.postalCode}</p>
                      <p className="text-sm">{address.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
