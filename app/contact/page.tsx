'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface ContactData {
  email: string
  phone: string
  location: string
  description: string
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isContactLoading, setIsContactLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [contactData, setContactData] = useState<ContactData>({
    email: '',
    phone: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const loadContactData = async () => {
      try {
        setIsContactLoading(true)
        setError(null)
        const response = await fetch('/api/contact', { signal })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setContactData(data.data)
          } else {
            setError('Veriler yüklenemedi')
          }
        } else {
          setError('Sunucu hatası')
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('İletişim bilgileri yüklenirken hata:', error)
          setError('Veriler yüklenemedi')
        }
      } finally {
        setIsContactLoading(false)
      }
    }

    loadContactData()

    return () => {
      controller.abort()
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Mesajınız gönderildi",
          description: "En kısa sürede size dönüş yapacağım.",
        })
        // Form'u temizle
        event.currentTarget.reset()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const ContactInfoSkeleton = () => (
    <div className="h-[72px] flex items-center space-x-4">
      <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )

  if (error) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Hata!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              {isContactLoading ? (
                <ContactInfoSkeleton />
              ) : (
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">E-posta</h3>
                    <p className="text-muted-foreground">{contactData.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {isContactLoading ? (
                <ContactInfoSkeleton />
              ) : (
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Telefon</h3>
                    <p className="text-muted-foreground">{contactData.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {isContactLoading ? (
                <ContactInfoSkeleton />
              ) : (
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Konum</h3>
                    <p className="text-muted-foreground">{contactData.location}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bana Ulaşın</CardTitle>
            <CardDescription>
              {isContactLoading ? (
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              ) : (
                contactData.description
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  İsim
                </label>
                <Input id="name" name="name" placeholder="Adınız Soyadınız" required />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-posta
                </label>
                <Input id="email" name="email" type="email" placeholder="ornek@email.com" required />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Konu
                </label>
                <Input id="subject" name="subject" placeholder="Mesajınızın konusu" required />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mesaj
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Mesajınızı buraya yazın..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
