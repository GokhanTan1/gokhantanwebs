'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Link as LinkIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  objectives: string[]
  technologies: string[]
  results: string[]
  link?: string
  githubLink?: string
}

interface ProjectsData {
  projects: Project[]
}

export default function PortfolioPage() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Veri alınamadı')
        const data = await response.json()
        if (data.success && data.data) {
          setProjectsData(data.data)
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
      <div className="container mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!projectsData) {
    return (
      <div className="container mx-auto p-4">
        <p>Veriler yüklenirken bir hata oluştu.</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Projeler</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/portfolio/${project.id}`}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Detayları Gör
                    </Link>
                  </Button>
                  {project.githubLink && (
                    <Button variant="outline" size="sm" asChild>
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
        ))}
      </div>
    </main>
  )
}
