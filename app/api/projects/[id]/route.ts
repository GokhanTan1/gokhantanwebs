import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Admin client'ı kullan
    const supabase = supabaseAdmin
    
    console.log('Aranan proje ID:', params.id)

    // ID'yi string olarak işle
    const searchId = params.id.toString()
    console.log('Aranacak ID:', searchId, 'Tip:', typeof searchId)

    // Tüm projeleri getir ve client tarafında filtrele
    const { data: allProjects, error: listError } = await supabase
      .from('projects')
      .select('*')

    console.log('Tüm projeler:', allProjects)

    if (listError) {
      console.error('Projeler listelenirken hata:', listError)
      return NextResponse.json(
        { success: false, error: 'Projeler alınamadı' },
        { status: 500 }
      )
    }

    // ID'ye göre projeyi bul
    const project = allProjects?.find(p => p.id.toString() === searchId)
    console.log('Bulunan proje:', project)

    if (!project) {
      console.error('Proje bulunamadı. ID:', params.id)
      return NextResponse.json(
        { success: false, error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    // Snake case'den camel case'e çevir
    const camelCaseProject = {
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
    }

    return NextResponse.json({ success: true, data: camelCaseProject })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Veri alınamadı' },
      { status: 500 }
    )
  }
}