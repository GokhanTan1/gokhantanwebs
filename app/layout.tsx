import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { MobileNav } from "@/components/ui/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gökhan Tan - Fizik Mühendisliği Öğrencisi",
  description: "Gökhan Tan'ın kişisel websitesi. Fizik mühendisliği öğrencisi, araştırmacı ve teknoloji tutkunu.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#000000',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Gökhan Tan",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="antialiased">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <MobileNav />
                <Link href="/" className="font-bold text-lg">
                  Gökhan Tan
                </Link>
              </div>
              <div className="hidden md:flex space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/about">Hakkımda</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/experience">Deneyim</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/portfolio">Projeler</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/contact">İletişim</Link>
                </Button>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Gökhan Tan. Tüm hakları saklıdır.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Button variant="link" asChild>
                  <Link href="/about">Hakkımda</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/contact">İletişim</Link>
                </Button>
              </div>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}

import './globals.css'