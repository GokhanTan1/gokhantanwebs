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

// Objenin tüm key'lerini camelCase'e çeviren fonksiyon (nested objeler dahil)
function convertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return convertKeysToCamelCase(item)
      }
      return item
    })
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    const camelKey = toCamelCase(key)
    
    if (typeof value === 'object' && value !== null) {
      acc[camelKey] = convertKeysToCamelCase(value)
    } else {
      acc[camelKey] = value
    }
    
    return acc
  }, {} as Record<string, any>)
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    // Önce ana experience verisini al
    const { data: experienceData, error: experienceError } = await supabaseAdmin
      .from('experience')
      .select('description')
      .single()

    if (experienceError) {
      console.error('Experience verisi alınırken hata:', experienceError)
      return NextResponse.json(
        { success: false, error: 'Deneyim bilgileri bulunamadı' },
        { status: 404 }
      )
    }

    // Sonra experiences listesini al
    const { data: experiences, error: experiencesError } = await supabaseAdmin
      .from('experiences')
      .select('*')
      .order('id')

    if (experiencesError) {
      console.error('Experiences listesi alınırken hata:', experiencesError)
      return NextResponse.json(
        { success: false, error: 'Deneyimler listesi bulunamadı' },
        { status: 404 }
      )
    }

    // Verileri birleştir ve camelCase'e çevir
    const data = {
      description: experienceData?.description || '',
      experiences: experiences || []
    }

    const camelCaseData = convertKeysToCamelCase(data)

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
    
    console.log('Experience güncelleme isteği:', data)

    // Ana deneyim verisini güncelle
    const { error: descriptionError } = await supabaseAdmin
      .from('experience')
      .upsert({
        id: 1,
        description: data.description
      })

    if (descriptionError) {
      console.error('Description güncellenirken hata:', descriptionError)
      throw descriptionError
    }

    // Önce tüm experiences kayıtlarını sil
    const { error: deleteError } = await supabaseAdmin
      .from('experiences')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('Experiences silinirken hata:', deleteError)
      throw deleteError
    }

    // Yeni experiences kayıtlarını ekle
    if (data.experiences && data.experiences.length > 0) {
      for (const exp of data.experiences) {
        const { error: insertError } = await supabaseAdmin
          .from('experiences')
          .insert({
            ...exp,
            skills: exp.skills || []
          })

        if (insertError) {
          console.error(`'${exp.title}' deneyimi eklenirken hata:`, insertError)
          throw insertError
        }

        console.log(`✅ '${exp.title}' deneyimi başarıyla eklendi`)
      }
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
        body: JSON.stringify({ path: '/experience' }),
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
      message: 'Deneyim bilgileri başarıyla güncellendi ve yayınlandı'
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