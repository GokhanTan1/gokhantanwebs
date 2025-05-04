import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables tanımlanmamış')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// CamelCase'i snake_case'e çeviren yardımcı fonksiyon
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
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

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  imageGallery?: string[]
  tags: string[]
  objectives: string[]
  technologies: string[]
  results: string[]
  link?: string
  githubLink?: string
}

interface ProjectsData {
  projects: Project[]
}

async function ensureTable() {
  console.log('🔧 Tablo yapısı kontrol ediliyor...')

  try {
    const { error } = await supabase.from('projects').select().limit(1)
    
    if (error?.message.includes('relation "projects" does not exist')) {
      console.log('📝 projects tablosu oluşturuluyor...')
      await supabase
        .from('projects')
        .insert({
          id: 'test',
          title: 'Test Project',
          description: 'Test Description',
          image: '/placeholder.jpg',
          image_gallery: ['/placeholder.jpg']
        })
      console.log('✅ projects tablosu oluşturuldu')
    }
  } catch (error) {
    console.error('❌ Tablo kontrolü hatası:', error)
    throw error
  }
}

export async function migrateProjectsData() {
  try {
    // Önce tablo yapısını kontrol et
    await ensureTable()

    console.log('🗑️ Mevcut veriler temizleniyor...')
    
    // Mevcut verileri temizle
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('❌ Mevcut verileri silme hatası:', deleteError)
      throw deleteError
    }

    console.log('✅ Mevcut veriler temizlendi')
    console.log('📦 JSON dosyası okunuyor...')

    // JSON dosyasını oku
    const projectsFile = join(process.cwd(), 'data/projects.json')
    const jsonData = await fs.readFile(projectsFile, 'utf-8')
    const projectsData = JSON.parse(jsonData) as ProjectsData

    console.log(`📊 ${projectsData.projects.length} proje bulundu`)

    // Her projeyi ayrı ayrı ekle
    for (const project of projectsData.projects) {
      console.log(`\n🔄 '${project.title}' projesi işleniyor...`)
      console.log('ID:', project.id)
      
      const snakeCaseProject = convertKeysToSnakeCase(project)
      
      const { data, error } = await supabase
        .from('projects')
        .insert(snakeCaseProject)
        .select()

      if (error) {
        console.error(`❌ '${project.title}' projesi eklenirken hata:`, error)
        throw error
      }

      console.log(`✅ '${project.title}' projesi başarıyla eklendi`)
    }

    // Verileri doğrula
    const { data: verifyData, error: verifyError } = await supabase
      .from('projects')
      .select('*')

    if (verifyError) {
      console.error('❌ Veri doğrulama hatası:', verifyError)
      throw verifyError
    }

    console.log(`\n✅ Toplam ${verifyData.length} proje başarıyla aktarıldı`)
  } catch (error) {
    console.error('❌ Migrasyon hatası:', error)
  }
}

// ESM'de import.meta.url kullanarak ana modül kontrolü
if (import.meta.url === fileURLToPath(import.meta.resolve('./migrate-projects.ts'))) {
  migrateProjectsData()
}