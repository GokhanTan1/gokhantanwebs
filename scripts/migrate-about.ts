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

interface Education {
  degree: string
  school: string
  years: string
  details: string[]
}

interface Skills {
  technicalPrograms: string[]
  technicalCompetencies: string[]
  softSkills: string[]
}

interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  phone: string
  linkedin: string
  description: string
}

interface AboutData {
  personalInfo: PersonalInfo
  skills: Skills
  education: Education[]
}

export async function migrateAboutData() {
  try {
    // Önce mevcut verileri temizle
    const { error: deleteError } = await supabase
      .from('about')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('❌ Mevcut verileri silme hatası:', deleteError)
      return
    }

    // JSON dosyasını oku
    const aboutFile = join(process.cwd(), 'data/about.json')
    const jsonData = await fs.readFile(aboutFile, 'utf-8')
    const aboutData = JSON.parse(jsonData) as AboutData

    console.log('About verileri:', aboutData)

    // Nested veriyi flat yapıya dönüştür
    const flattenedData = flattenAboutData(aboutData)
    
    // Supabase'e veriyi aktar
    const { data, error } = await supabase
      .from('about')
      .upsert({
        id: 1,
        ...flattenedData
      })
      .select()

    if (error) {
      console.error('❌ Migrasyon hatası:', error)
      return
    }

    console.log('✅ About verileri başarıyla Supabase\'e aktarıldı:', data)
  } catch (error) {
    console.error('❌ Migrasyon hatası:', error)
  }
}

// ESM'de import.meta.url kullanarak ana modül kontrolü
if (import.meta.url === fileURLToPath(import.meta.resolve('./migrate-about.ts'))) {
  migrateAboutData()
}