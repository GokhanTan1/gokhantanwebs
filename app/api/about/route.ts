import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: about, error } = await supabase
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

    // Snake case'den camel case'e çevir
    const camelCaseData = {
      personalInfo: {
        name: about.name,
        title: about.title,
        location: about.location,
        email: about.email,
        phone: about.phone,
        linkedin: about.linkedin,
        description: about.description
      },
      skills: {
        technicalPrograms: about.skills.technical_programs,
        technicalCompetencies: about.skills.technical_competencies,
        softSkills: about.skills.soft_skills
      },
      education: about.education.map((edu: any) => ({
        degree: edu.degree,
        school: edu.school,
        years: edu.years,
        details: edu.details
      }))
    }

    return NextResponse.json({ success: true, data: camelCaseData })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Veri alınamadı' },
      { status: 500 }
    )
  }
}