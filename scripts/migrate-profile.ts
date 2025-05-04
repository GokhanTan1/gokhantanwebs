import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
import { formatUrl } from '@/lib/utils'
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

// Objenin tüm key'lerini snake_case'e çeviren fonksiyon
function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    const snakeKey = toSnakeCase(key)
    acc[snakeKey] = value
    return acc
  }, {} as Record<string, any>)
}

interface ProfileData {
  title: string
  subtitle: string
  description: string
  education: string
  experience: string
  projects: string
  githubUrl: string
  linkedinUrl: string
  email: string
  profilePhoto: string
}

export async function migrateProfileData() {
  try {
    // Önce mevcut verileri temizle
    const { error: deleteError } = await supabase
      .from('profile')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('❌ Mevcut verileri silme hatası:', deleteError)
      return
    }

    // JSON dosyasını oku
    const profileFile = join(process.cwd(), 'data/profile.json')
    const jsonData = await fs.readFile(profileFile, 'utf-8')
    const profileData = JSON.parse(jsonData) as ProfileData

    console.log('profile verileri:', profileData)

    // URL'leri formatla
    profileData.linkedinUrl = formatUrl(profileData.linkedinUrl)
    profileData.githubUrl = formatUrl(profileData.githubUrl)

    // Profile verilerini snake_case formatına çevir
    const snakeCaseData = convertKeysToSnakeCase(profileData)
    
    // Supabase'e veriyi aktar
    const { data, error } = await supabase
      .from('profile')
      .upsert({
        id: 1,
        ...snakeCaseData
      })
      .select()

    if (error) {
      console.error('❌ Migrasyon hatası:', error)
      return
    }

    console.log('✅ profile verileri başarıyla Supabase\'e aktarıldı:', data)
  } catch (error) {
    console.error('❌ Migrasyon hatası:', error)
  }
}

// ESM'de import.meta.url kullanarak ana modül kontrolü
if (import.meta.url === fileURLToPath(import.meta.resolve('./migrate-profile.ts'))) {
  migrateProfileData()
}