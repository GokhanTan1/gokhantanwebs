import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable tanımlanmamış')
}

const JWT_SECRET = process.env.JWT_SECRET

async function verifyToken(token: string | undefined) {
  if (!token) {
    throw new Error('Token bulunamadı')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    throw new Error('Geçersiz token')
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    await verifyToken(token?.value)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya uzantısını kontrol et
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    const allowedDocTypes = ['application/pdf']
    
    if (fileType === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya türü. Sadece JPG, PNG ve WebP formatları desteklenir.' },
        { status: 400 }
      )
    }

    if (fileType === 'document' && !allowedDocTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya türü. Sadece PDF formatı desteklenir.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını oluştur
    const timestamp = Date.now()
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')
    const fileName = `${timestamp}-${originalName}`

    // Dosyayı kaydet
    const publicPath = join(process.cwd(), 'public')
    const uploadDir = fileType === 'image' ? 'uploads/images' : 'uploads/documents'
    const fullPath = join(publicPath, uploadDir)
    
    await writeFile(join(fullPath, fileName), buffer)

    return NextResponse.json({ 
      success: true, 
      path: `/${uploadDir}/${fileName}`
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}