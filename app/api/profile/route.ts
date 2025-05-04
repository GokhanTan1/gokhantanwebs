import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { formatUrl } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .single()

    if (error) {
      console.error('Supabase hatası:', error)
      return NextResponse.json(
        { success: false, error: 'Profil verisi bulunamadı' },
        { status: 404 }
      )
    }

    // Snake case'den camel case'e çevir ve URL'leri formatla
    const camelCaseData = {
      title: profile.title,
      subtitle: profile.subtitle,
      description: profile.description,
      education: profile.education,
      experience: profile.experience,
      projects: profile.projects,
      githubUrl: formatUrl(profile.github_url),
      linkedinUrl: formatUrl(profile.linkedin_url),
      email: profile.email,
      profilePhoto: profile.profile_photo
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