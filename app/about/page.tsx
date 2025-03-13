import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Hakkımda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Kişisel Bilgiler</h2>
            <p className="text-muted-foreground mb-6">
              Merhaba! Ben Gökhan Tan. Fizik mühendisliği öğrencisi olarak, bilim ve teknolojinin kesiştiği noktada çalışmalar yapıyorum. 
              Analitik düşünme ve problem çözme yeteneklerimi kullanarak, karmaşık problemlere yenilikçi çözümler üretmeye odaklanıyorum.
            </p>
            <div className="space-y-2">
              <p><strong>Eğitim:</strong> Fizik Mühendisliği</p>
              <p><strong>Konum:</strong> İstanbul, Türkiye</p>
              <p><strong>E-posta:</strong> your.email@example.com</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Yetenekler</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Teknik Beceriler</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>MATLAB</Badge>
                  <Badge>Python</Badge>
                  <Badge>CAD Yazılımları</Badge>
                  <Badge>Veri Analizi</Badge>
                  <Badge>Simülasyon</Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Laboratuvar Becerileri</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Deney Tasarımı</Badge>
                  <Badge variant="secondary">Ölçüm Teknikleri</Badge>
                  <Badge variant="secondary">Veri Toplama</Badge>
                  <Badge variant="secondary">Kalibrasyon</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Problem Çözme</Badge>
                  <Badge variant="outline">Analitik Düşünme</Badge>
                  <Badge variant="outline">Takım Çalışması</Badge>
                  <Badge variant="outline">İletişim</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Eğitim Geçmişi</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Fizik Mühendisliği</h3>
                <p className="text-muted-foreground">Üniversite Adı, 2020 - Devam Ediyor</p>
                <p className="mt-2">
                  • Temel fizik ve mühendislik prensipleri
                  • İleri matematik ve analiz teknikleri
                  • Laboratuvar çalışmaları ve deneysel fizik
                  • Bilgisayar destekli tasarım ve simülasyon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

