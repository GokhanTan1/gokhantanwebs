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

// Flat veriyi nested yapıya dönüştüren fonksiyon
function restructureAboutData(flatData: any) {
  const { skills, education, ...personalInfoFields } = flatData

  return {
    personalInfo: {
      name: personalInfoFields.name,
      title: personalInfoFields.title,
      location: personalInfoFields.location,
      email: personalInfoFields.email,
      phone: personalInfoFields.phone,
      linkedin: personalInfoFields.linkedin,
      description: personalInfoFields.description
    },
    skills: {
      technicalPrograms: skills.technical_programs,
      technicalCompetencies: skills.technical_competencies,
      softSkills: skills.soft_skills
    },
    education: education.map((edu: any) => ({
      degree: edu.degree,
      school: edu.school,
      years: edu.years,
      details: edu.details
    }))
  }
}

// Nested veriyi flat yapıya dönüştüren fonksiyon
function flattenAboutData(nestedData: any) {
  const { personalInfo, skills, education } = nestedData

  return {
    ...personalInfo,
    skills: {
      technical_programs: skills.technicalPrograms,
      technical_competencies: skills.technicalCompetencies,
      soft_skills: skills.softSkills
    },
    education: education.map((edu: any) => ({
      degree: edu.degree,
      school: edu.school,
      years: edu.years,
      details: edu.details
    }))
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    
    await verifyToken(token?.value)
    
    const { data: about, error } = await supabaseAdmin
      .from('about')
      .select('*')
      .single()

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Hakkımda verisi bulunamadı' },
        { status: 404 }
      )
    }

    // Flat veriyi nested yapıya dönüştür
    const restructuredData = restructureAboutData(about)

    return NextResponse.json({ success: true, data: restructuredData })
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
    
    console.log('About güncelleme isteği:', data)

    // Nested veriyi flat yapıya dönüştür
    const flattenedData = flattenAboutData(data)

    const { error } = await supabaseAdmin
      .from('about')
      .upsert({
        id: 1,
        ...flattenedData
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
        body: JSON.stringify({ path: '/about' }),
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
      message: 'Hakkımda sayfası başarıyla güncellendi ve yayınlandı'
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