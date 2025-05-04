'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface AboutData {
  personalInfo: {
    name: string
    title: string
    location: string
    email: string
    phone: string
    linkedin: string
    description: string
  }
  skills: {
    technicalPrograms: string[]
    technicalCompetencies: string[]
    softSkills: string[]
  }
  education: {
    degree: string
    school: string
    years: string
    details: string[]
  }[]
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/about')
        if (!response.ok) throw new Error('Veri alınamadı')
        const data = await response.json()
        if (data.success && data.data) {
          setAboutData(data.data)
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
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className="container mx-auto p-4">
        <p>Veriler yüklenirken bir hata oluştu.</p>
      </div>
    )
  }

  const { personalInfo, skills, education } = aboutData

  return (
    <main className="container mx-auto p-4 space-y-8">
      {/* Kişisel Bilgiler */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
        <h2 className="text-xl text-muted-foreground">{personalInfo.title}</h2>
        <div className="prose max-w-none dark:prose-invert">
          {personalInfo.description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Yetenekler */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Yetenekler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Teknik Programlar</h3>
              <ul className="list-disc pl-4 space-y-1">
                {skills.technicalPrograms.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Teknik Yetkinlikler</h3>
              <ul className="list-disc pl-4 space-y-1">
                {skills.technicalCompetencies.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Kişisel Yetkinlikler</h3>
              <ul className="list-disc pl-4 space-y-1">
                {skills.softSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Eğitim */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Eğitim</h2>
        <div className="grid gap-4">
          {education.map((edu, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-muted-foreground">{edu.school}</p>
                <p className="text-sm text-muted-foreground">{edu.years}</p>
                {edu.details.length > 0 && (
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {edu.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
