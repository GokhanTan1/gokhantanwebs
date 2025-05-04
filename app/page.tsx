'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail, X } from 'lucide-react'
import { formatUrl } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) throw new Error('Veri alınamadı')
        const data = await response.json()
        if (data.success && data.data) {
          setProfileData(data.data)
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="relative flex place-items-center">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-16 w-[300px]" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!profileData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Veriler yüklenirken bir hata oluştu.</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Hero Section */}
      <div className="relative flex place-items-center">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div 
            className="relative w-32 h-32 overflow-hidden rounded-full mb-4 cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={profileData.profilePhoto}
              alt={profileData.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl h-[80vh] flex items-center justify-center p-0">
              <DialogTitle className="sr-only">
                {profileData.title} Profil Fotoğrafı
              </DialogTitle>
              <div className="relative w-full h-full">
                <Image
                  src={profileData.profilePhoto}
                  alt={profileData.title}
                  fill
                  className="object-contain"
                  priority
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {profileData.title}
          </h1>
          <h2 className="text-xl text-muted-foreground sm:text-2xl">
            {profileData.subtitle}
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {profileData.description}
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/about">
                Hakkımda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/contact">İletişime Geç</Link>
            </Button>
          </div>
          <div className="flex gap-4 mt-8">
            <a href={formatUrl(profileData.githubUrl)} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href={formatUrl(profileData.linkedinUrl)} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <Link href={`mailto:${profileData.email}`}>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Login */}
      <div className="absolute bottom-8 opacity-0">
        <Button variant="secondary" asChild>
          <Link href="/admin/login">Giriş</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16">
        <Link href="/about" className="flex flex-col items-center hover:opacity-80 transition-opacity">
          <h3 className="text-2xl font-bold">Eğitim</h3>
          <p className="text-muted-foreground">{profileData.education}</p>
        </Link>
        <Link href="/experience" className="flex flex-col items-center hover:opacity-80 transition-opacity">
          <h3 className="text-2xl font-bold">Deneyim</h3>
          <p className="text-muted-foreground">{profileData.experience}</p>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center hover:opacity-80 transition-opacity">
          <h3 className="text-2xl font-bold">Projeler</h3>
          <p className="text-muted-foreground">{profileData.projects}</p>
        </Link>
      </div>
    </main>
  )
}
