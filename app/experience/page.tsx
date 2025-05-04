'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ExperiencePage() {
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/experience')
        if (!response.ok) throw new Error('Veri alınamadı')
        const data = await response.json()
        if (data.success && data.data) {
          setExperienceData(data.data)
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-16 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!experienceData) {
    return (
      <div className="container mx-auto p-4">
        <p>Veriler yüklenirken bir hata oluştu.</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Deneyim</h1>
        <p className="text-muted-foreground">
          {experienceData.description}
        </p>
      </section>

      <section className="grid gap-4">
        {experienceData.experiences.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{experience.title}</h2>
                <p className="text-muted-foreground">{experience.company}</p>
                <p className="text-sm text-muted-foreground">{experience.period}</p>
              </div>
              <p>{experience.description}</p>
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
