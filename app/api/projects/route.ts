import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    // Tüm projeleri al
    const { data: projects, error } = await supabase
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
      projects: projects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        longDescription: project.long_description,
        image: project.image,
        imageGallery: project.image_gallery || [project.image], // Galeri yoksa ana resmi kullan
        tags: project.tags,
        objectives: project.objectives,
        technologies: project.technologies,
        results: project.results,
        link: project.link,
        githubLink: project.github_link
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