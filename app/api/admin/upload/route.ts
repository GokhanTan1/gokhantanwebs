import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Dosyayı Supabase'e yükle
    const bucketName = fileType === 'image' ? 'images' : 'documents'
    
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      })

    if (error) {
      console.error('Supabase yükleme hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Dosya yüklenemedi: ' + error.message },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin
      .storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      path: urlData.publicUrl
    })

  } catch (error) {
    console.error('Upload hatası:', error)
    let errorMessage = 'Bilinmeyen hata'
    
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('Hata detayı:', error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Dosya yüklenirken bir hata oluştu: ' + errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}