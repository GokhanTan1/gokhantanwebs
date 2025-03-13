import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    title: "Araştırma Asistanı",
    company: "Üniversite Fizik Laboratuvarı",
    period: "2023 - Devam Ediyor",
    description: "Parçacık fiziği deneylerinde veri toplama ve analiz süreçlerinde aktif rol alıyorum. MATLAB ve Python kullanarak deney sonuçlarını işliyor ve raporluyorum.",
    skills: ["Veri Analizi", "MATLAB", "Python", "Laboratuvar Teknikleri"]
  },
  {
    title: "Stajyer Fizik Mühendisi",
    company: "XYZ Araştırma Merkezi",
    period: "2023 Yaz",
    description: "Yüksek enerji fiziği laboratuvarında staj yaptım. Deney düzeneklerinin kurulumu ve kalibrasyonunda görev aldım.",
    skills: ["Deney Tasarımı", "Kalibrasyon", "Veri Toplama"]
  },
  {
    title: "Proje Asistanı",
    company: "Üniversite Fizik Kulübü",
    period: "2022 - 2023",
    description: "Öğrenci projelerinde mentörlük yaparak, teorik fizik ve programlama konularında destek sağladım.",
    skills: ["Mentorluk", "Proje Yönetimi", "Fizik Eğitimi"]
  }
]

export default function ExperiencePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Deneyim</h1>
      <p className="text-muted-foreground mb-12 max-w-2xl">
        Akademik ve profesyonel alanda edindiğim deneyimler. Her deneyim, fizik ve mühendislik
        alanındaki bilgi ve becerilerimi geliştirmeme katkı sağladı.
      </p>

      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{experience.title}</CardTitle>
                  <CardDescription>{experience.company}</CardDescription>
                </div>
                <Badge variant="outline">{experience.period}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {experience.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

