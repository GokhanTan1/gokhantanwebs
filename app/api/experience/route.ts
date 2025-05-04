import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Ana deneyim açıklamasını al
    const { data: experience, error: experienceError } = await supabase
      .from('experience')
      .select('description')
      .single()

    console.log('Ana deneyim verisi:', experience)
    console.log('Ana deneyim hatası:', experienceError)

    if (experienceError) {
      console.error('Deneyim verisi alınırken hata:', experienceError)
      return NextResponse.json(
        { success: false, error: 'Deneyim verisi bulunamadı' },
        { status: 404 }
      )
    }

    // Deneyim listesini al
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .order('id')

    console.log('Deneyimler listesi:', experiences)
    console.log('Deneyimler listesi hatası:', experiencesError)

    if (experiencesError) {
      console.error('Deneyimler listesi alınırken hata:', experiencesError)
      return NextResponse.json(
        { success: false, error: 'Deneyimler listesi bulunamadı' },
        { status: 404 }
      )
    }

    // Snake case'den camel case'e çevir
    const camelCaseData = {
      description: experience.description,
      experiences: experiences.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        skills: exp.skills
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