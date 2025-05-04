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

// Objenin tüm key'lerini snake_case'e çeviren fonksiyon (nested objeler dahil)
function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return convertKeysToSnakeCase(item)
      }
      return item
    })
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    const snakeKey = toSnakeCase(key)
    
    if (typeof value === 'object' && value !== null) {
      acc[snakeKey] = convertKeysToSnakeCase(value)
    } else {
      acc[snakeKey] = value
    }
    
    return acc
  }, {} as Record<string, any>)
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('id')

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Projeler bulunamadı' },
        { status: 404 }
      )
    }

    // Snake case'den camel case'e çevir
    const camelCaseData = {
      projects: convertKeysToCamelCase(projects)
    }

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
    
    console.log('Projects güncelleme isteği:', data)

    // Önce tüm projeleri sil
    const { error: deleteError } = await supabaseAdmin
      .from('projects')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('Projeleri silme hatası:', deleteError)
      throw deleteError
    }

    // Yeni projeleri ekle
    if (data.projects && data.projects.length > 0) {
      for (const project of data.projects) {
        // Her projeyi snake_case'e çevir
        const snakeCaseProject = convertKeysToSnakeCase(project)
        
        const { error: insertError } = await supabaseAdmin
          .from('projects')
          .insert(snakeCaseProject)

        if (insertError) {
          console.error(`'${project.title}' projesi eklenirken hata:`, insertError)
          throw insertError
        }

        console.log(`✅ '${project.title}' projesi başarıyla eklendi`)
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
        body: JSON.stringify({ path: '/portfolio' }),
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
      message: 'Projeler başarıyla güncellendi ve yayınlandı'
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