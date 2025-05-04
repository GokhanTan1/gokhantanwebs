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

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    const { data: contact, error } = await supabaseAdmin
      .from('contact')
      .select('*')
      .single()

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { success: false, error: 'İletişim bilgileri bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: contact })
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

    console.log('Contact güncelleme isteği:', data)

    const { error } = await supabaseAdmin
      .from('contact')
      .upsert(data, { onConflict: 'id' })

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
        body: JSON.stringify({ path: '/contact' }),
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
      message: 'İletişim bilgileri başarıyla güncellendi ve yayınlandı'
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