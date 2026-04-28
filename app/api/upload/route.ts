import { NextResponse, NextRequest } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Yetkiniz yok' } },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'
    
    if (!file) {
      return NextResponse.json(
        { error: { message: 'Dosya bulunamadı' } },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: { message: 'Sadece resim dosyaları yüklenebilir (JPG, PNG, WebP, GIF)' } },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: { message: 'Dosya boyutu 5MB\'dan küçük olmalıdır' } },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

 

        // Return public URL with folder
    const imageUrl = `/uploads/${folder}/${filename}`
    
    return NextResponse.json({
      message: 'Resim yüklendi',
      imageUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: { message: 'Resim yüklenirken hata oluştu' } },
      { status: 500 }
    )
  }
}
