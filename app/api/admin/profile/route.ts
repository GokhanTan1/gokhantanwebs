import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable tanımlanmamış')
}

const JWT_SECRET = process.env.JWT_SECRET

// Token doğrulama middleware
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

// Snake case'den camel case'e çeviren yardımcı fonksiyon
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// CamelCase'den snake_case'e çeviren yardımcı fonksiyon
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

// Objeyi camelCase'e çevir
function convertToCamelCase(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = toCamelCase(key)
      newObj[camelKey] = obj[key]
    }
  }
  return newObj
}

// Objeyi snake_case'e çevir
function convertToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = toSnakeCase(key)
      newObj[snakeKey] = obj[key]
    }
  }
  return newObj
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    const { data: profile, error } = await supabaseAdmin
      .from('profile')
      .select('*')
      .single()

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Profil bulunamadı' },
        { status: 404 }
      )
    }

    // Snake case'den camel case'e çevir
    const camelCaseData = convertToCamelCase(profile)

    return NextResponse.json({ success: true, data: camelCaseData })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Yetkisiz erişim' },
      { status: 401 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    const data = await request.json()
    
    console.log('Profil güncelleme isteği:', data)

    // CamelCase'den snake_case'e çevir
    const snakeCaseData = convertToSnakeCase(data)

    const { error } = await supabaseAdmin
      .from('profile')
      .upsert({
        id: 1,
        ...snakeCaseData
      })

    if (error) {
      console.error('Supabase hatası:', error)
      throw error
    }

    // Sayfayı revalidate et
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${request.headers.get('host')}`
      console.log('Revalidate isteği gönderiliyor:', `${baseUrl}/api/revalidate`)
      
      const revalidateResponse = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/' }), // Ana sayfa revalidate ediliyor
      })

      if (!revalidateResponse.ok) {
        console.error('Revalidate hatası:', await revalidateResponse.text())
        throw new Error('Revalidate başarısız')
      }

      console.log('Revalidate başarılı')
    } catch (error) {
      console.error('Revalidate hatası:', error)
      throw new Error('Sayfa yenilenirken hata oluştu')
    }

    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi ve yayınlandı'
    })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Yetkisiz erişim veya geçersiz veri'
      },
      { status: 401 }
    )
  }
}
