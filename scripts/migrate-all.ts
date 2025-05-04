import { migrateProfileData } from './migrate-profile.js'
import { migrateAboutData } from './migrate-about.js'
import { migrateExperienceData } from './migrate-experience.js'
import { migrateContactData } from './migrate-contact.js'
import { migrateProjectsData } from './migrate-projects.js'
import { config } from 'dotenv'

// Önce environment değişkenlerini yükle
config({ path: '.env.local' })

console.log('🔧 Environment değişkenleri yüklendi')

async function migrateAll() {
  try {
    console.log('🚀 Tüm veriler migrate ediliyor...\n')

    console.log('1️⃣ Profile verileri...')
    await migrateProfileData()
    console.log('✅ Profile migrate edildi\n')

    console.log('2️⃣ About verileri...')
    await migrateAboutData()
    console.log('✅ About migrate edildi\n')

    console.log('3️⃣ Experience verileri...')
    await migrateExperienceData()
    console.log('✅ Experience migrate edildi\n')

    console.log('4️⃣ Projects verileri...')
    await migrateProjectsData()
    console.log('✅ Projects migrate edildi\n')

    console.log('5️⃣ Contact verileri...')
    await migrateContactData()
    console.log('✅ Contact migrate edildi\n')

    console.log('🎉 Tüm veriler başarıyla migrate edildi!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Migrasyon hatası:')
    if (error instanceof Error) {
      console.error('Hata mesajı:', error.message)
      console.error('Stack trace:', error.stack)
    } else {
      console.error('Beklenmeyen hata:', error)
    }
    process.exit(1)
  }
}

// Ana fonksiyonu çalıştır ve hataları yakala
migrateAll().catch(error => {
  console.error('❌ Kritik hata:', error)
  process.exit(1)
})