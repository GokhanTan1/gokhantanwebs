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

interface ContactData {
  email: string
  phone: string
  location: string
  description: string
}

export async function migrateContactData() {
  try {
    // Önce mevcut verileri temizle
    const { error: deleteError } = await supabase
      .from('contact')
      .delete()
      .not('id', 'is', null)

    if (deleteError) {
      console.error('❌ Mevcut verileri silme hatası:', deleteError)
      return
    }

    // JSON dosyasını oku
    const contactFile = join(process.cwd(), 'data/contact.json')
    const jsonData = await fs.readFile(contactFile, 'utf-8')
    const contactData = JSON.parse(jsonData) as ContactData

    console.log('contact verileri:', contactData)
    
    // Supabase'e veriyi aktar
    const { data, error } = await supabase
      .from('contact')
      .upsert({
        id: 1,
        ...contactData
      })
      .select()

    if (error) {
      console.error('❌ Migrasyon hatası:', error)
      return
    }

    console.log('✅ contact verileri başarıyla Supabase\'e aktarıldı:', data)
  } catch (error) {
    console.error('❌ Migrasyon hatası:', error)
  }
}

// ESM'de import.meta.url kullanarak ana modül kontrolü
if (import.meta.url === fileURLToPath(import.meta.resolve('./migrate-contact.ts'))) {
  migrateContactData()
}