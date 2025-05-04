import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// .env.local dosyasını yükle
config({ path: '.env.local' })

// Başlangıç kontrolü
console.log('🔍 Environment değişkenleri kontrol ediliyor...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL tanımlı değil')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY tanımlı değil')
  process.exit(1)
}

console.log('✅ Environment değişkenleri doğrulandı')

// Supabase client'ı oluştur
const supabase = createClient(
  supabaseUrl!,
  supabaseKey!,
  {
    auth: { persistSession: false }
  }
)

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  skills: string[]
}

interface ExperienceData {
  description: string
  experiences: Experience[]
}

async function ensureTables() {
  console.log('🔧 Tablo yapıları kontrol ediliyor...')

  try {
    // experience tablosunu oluştur
    const { error: error1 } = await supabase.from('experience').select().limit(1)
    
    if (error1?.message.includes('relation "experience" does not exist')) {
      console.log('📝 experience tablosu oluşturuluyor...')
      const { error } = await supabase
        .from('experience')
        .insert({ id: 1, description: '' })
        .select()

      if (error && !error.message.includes('already exists')) {
        throw error
      }
      console.log('✅ experience tablosu oluşturuldu')
    }

    // experiences tablosunu oluştur
    const { error: error2 } = await supabase.from('experiences').select().limit(1)
    
    if (error2?.message.includes('relation "experiences" does not exist')) {
      console.log('📝 experiences tablosu oluşturuluyor...')
      const { error } = await supabase
        .from('experiences')
        .insert({
          id: 1,
          title: '',
          company: '',
          period: '',
          description: '',
          skills: []
        })
        .select()

      if (error && !error.message.includes('already exists')) {
        throw error
      }
      console.log('✅ experiences tablosu oluşturuldu')
    }

    console.log('✅ Tablo yapıları hazır')
  } catch (error) {
    console.error('❌ Tablo kontrolü/oluşturma hatası:', error)
    throw error
  }
}

export async function migrateExperienceData() {
  try {
    // Önce tabloların varlığını kontrol et
    await ensureTables()

    console.log('📦 JSON dosyası okunuyor...')
    
    // JSON dosyasını oku
    const experienceFile = join(process.cwd(), 'data/experience.json')
    const jsonData = await fs.readFile(experienceFile, 'utf-8')
    const experienceData = JSON.parse(jsonData) as ExperienceData

    console.log('✅ JSON dosyası başarıyla okundu')
    console.log('🗑️ Mevcut veriler temizleniyor...')

    // Önce experiences tablosunu temizle (foreign key varsa önce child table silinmeli)
    const { error: deleteExpsError } = await supabase
      .from('experiences')
      .delete()
      .not('id', 'is', null)

    if (deleteExpsError) {
      console.error('❌ Deneyimler listesini silme hatası:', deleteExpsError)
      throw deleteExpsError
    }

    console.log('✅ Experiences tablosu temizlendi')

    // Sonra ana experience tablosunu temizle
    const { error: deleteMainError } = await supabase
      .from('experience')
      .delete()
      .not('id', 'is', null)

    if (deleteMainError) {
      console.error('❌ Ana deneyim verilerini silme hatası:', deleteMainError)
      throw deleteMainError
    }

    console.log('✅ Experience tablosu temizlendi')

    console.log('📝 Yeni veriler ekleniyor...')

    // Ana deneyim açıklamasını ekle
    const { error: insertMainError } = await supabase
      .from('experience')
      .insert({
        id: 1,
        description: experienceData.description
      })

    if (insertMainError) {
      console.error('❌ Ana deneyim verisi eklenirken hata:', insertMainError)
      throw insertMainError
    }

    console.log('✅ Ana deneyim açıklaması eklendi')

    // Her bir deneyimi ayrı ayrı ekle
    for (const experience of experienceData.experiences) {
      // ID'yi string'den numbera çevir
      const numericId = parseInt(experience.id)
      
      const { error } = await supabase
        .from('experiences')
        .insert({
          ...experience,
          id: isNaN(numericId) ? undefined : numericId, // Geçersiz ID ise undefined kullan
          skills: experience.skills || [] // skills array'ini doğru şekilde ekle
        })

      if (error) {
        console.error(`❌ '${experience.title}' deneyimi eklenirken hata:`, error)
        throw error
      }

      console.log(`✅ Deneyim başarıyla eklendi: ${experience.title}`)
    }

    console.log('\n✅ Tüm deneyim verileri başarıyla Supabase\'e aktarıldı')
  } catch (error) {
    console.error('❌ Migrasyon hatası:', error)
    throw error // Hatayı yukarı fırlat
  }
}

// Scripti çalıştır
migrateExperienceData().catch(error => {
  console.error('❌ Kritik hata:', error)
  process.exit(1)
})