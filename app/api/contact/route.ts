import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 3600 // 1 saat boyunca önbelleğe al

export async function GET() {
  try {
    console.log('Contact API çağrıldı')
    
    const { data, error } = await supabaseAdmin
      .from('contact')
      .select('*')
      .single()

    console.log('Supabase yanıtı:', { data, error })

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'İletişim bilgileri bulunamadı',
          details: error.message 
        },
        { status: 404 }
      )
    }

    if (!data) {
      console.error('Veri bulunamadı')
      return NextResponse.json(
        { 
          success: false, 
          error: 'İletişim bilgileri bulunamadı' 
        },
        { status: 404 }
      )
    }

    // Cache-Control header'ı ekle
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    )
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Sunucu hatası',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Contact POST isteği:', body)

    const { data, error } = await supabaseAdmin
      .from('contact')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'İletişim bilgisi eklenemedi',
          details: error.message
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Sunucu hatası',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}