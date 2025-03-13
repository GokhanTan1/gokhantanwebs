'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail, X } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
              src="/profile-photo.jpg"
              alt="Gökhan Tan"
              fill
              className="object-cover"
              priority
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl h-[80vh] flex items-center justify-center p-0">
              <DialogTitle className="sr-only">
                Gökhan Tan Profil Fotoğrafı
              </DialogTitle>
              <div className="relative w-full h-full">
                <Image
                  src="/profile-photo.jpg"
                  alt="Gökhan Tan"
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
            Gökhan Tan
          </h1>
          <h2 className="text-xl text-muted-foreground sm:text-2xl">
            Fizik Mühendisliği Öğrencisi
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Bilim ve teknoloji tutkunu, yenilikçi çözümler üreten bir fizik mühendisliği öğrencisi
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/about">
                Hakkımda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">İletişime Geç</Link>
            </Button>
          </div>
          <div className="flex gap-4 mt-8">
            <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="mailto:your.email@example.com">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold">Eğitim</h3>
          <p className="text-muted-foreground">Fizik Mühendisliği</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold">Deneyim</h3>
          <p className="text-muted-foreground">Araştırma & Geliştirme</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold">Projeler</h3>
          <p className="text-muted-foreground">Bilimsel & Teknik</p>
        </div>
      </div>
    </main>
  )
}

