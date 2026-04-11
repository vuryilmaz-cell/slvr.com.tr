'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: number
  email: string
  fullName: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      setUsers(data.users || [])
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    if (!confirm(`Bu kullanıcıyı ${currentStatus ? 'devre dışı bırakmak' : 'aktifleştirmek'} istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (res.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ))
        alert('Kullanıcı durumu güncellendi')
      } else {
        alert('Güncelleme başarısız')
      }
    } catch (error) {
      alert('Hata oluştu')
    }
  }

  const filteredUsers = filter === 'all' 
    ? users 
    : filter === 'admin'
    ? users.filter(u => u.role === 'admin')
    : users.filter(u => u.role === 'customer')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Kullanıcılar</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Toplam Kullanıcı</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Müşteriler</p>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === 'customer').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Adminler</p>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <p className="text-sm text-gray-600 mb-1">Aktif</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filtre:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">Tüm Kullanıcılar</option>
            <option value="customer">Müşteriler</option>
            <option value="admin">Adminler</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Müşteri'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className={`${
                        user.isActive
                          ? 'text-red-600 hover:underline'
                          : 'text-green-600 hover:underline'
                      }`}
                    >
                      {user.isActive ? 'Devre Dışı Bırak' : 'Aktifleştir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Kullanıcı bulunamadı.
          </div>
        )}
      </div>
    </div>
  )
}
