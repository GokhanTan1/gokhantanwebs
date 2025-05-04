'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
    }

    try {
      console.log('Form data:', data)
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Giriş başarılı",
          description: "Admin paneline yönlendiriliyorsunuz.",
        })
        router.push('/admin/dashboard')
      } else {
        toast({
          variant: "destructive",
          title: "Hata!",
          description: result.message || "Giriş başarısız.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Girişi</CardTitle>
          <CardDescription>
            Websiteyi yönetmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Kullanıcı Adı
              </label>
              <Input
                id="username"
                name="username"
                required
                placeholder="Kullanıcı adınızı girin"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Şifre
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Şifrenizi girin"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}