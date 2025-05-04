'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageGallery } from "@/components/ui/image-gallery"
import { Github, Link as LinkIcon, FileText } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

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

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (!response.ok) throw new Error('Proje bulunamadı')
        const data = await response.json()
        if (data.success && data.data) {
          setProject(data.data)
        }
      } catch (error) {
        console.error('Proje yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto p-4">
        <p>Proje bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Button variant="secondary" size="sm" asChild className="mb-4">
        <Link href="/portfolio">
          ← Projelere Dön
        </Link>
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          {project.imageGallery && project.imageGallery.length > 0 ? (
            <ImageGallery
              images={project.imageGallery}
              className="mb-6"
            />
          ) : (
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Proje Detayı</h2>
              <p className="text-muted-foreground">{project.longDescription}</p>
            </section>

            {project.objectives.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Hedefler</h2>
                <ul className="list-disc list-inside space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="text-muted-foreground">{objective}</li>
                  ))}
                </ul>
              </section>
            )}

            {project.technologies.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Kullanılan Teknolojiler</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index}>{tech}</Badge>
                  ))}
                </div>
              </section>
            )}

            {project.results.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Sonuçlar</h2>
                <ul className="list-disc list-inside space-y-2">
                  {project.results.map((result, index) => (
                    <li key={index} className="text-muted-foreground">{result}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex gap-3 pt-4">
              {project.link && (
                <Button variant="default" size="default" asChild>
                  <Link href={project.link} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Proje Dosyası
                  </Link>
                </Button>
              )}
              {project.githubLink && (
                <Button variant="outline" size="default" asChild>
                  <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}