import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Form validasyonu
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tüm alanların doldurulması zorunludur' 
        },
        { status: 400 }
      )
    }

    // API key kontrolü
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_API_KEY bulunamadı' 
        },
        { status: 500 }
      )
    }

    // Alıcı email kontrolü
    if (!process.env.RESEND_TO_EMAIL) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_TO_EMAIL bulunamadı' 
        },
        { status: 500 }
      )
    }

    console.log('Mail gönderim başlıyor...')
    console.log('API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')
    console.log('Alıcı:', process.env.RESEND_TO_EMAIL)

    // Email gönderimi
    const data = await resend.emails.send({
      from: 'Gökhan Tan <onboarding@resend.dev>',
      to: process.env.RESEND_TO_EMAIL,
      replyTo: email,
      subject: `İletişim Formu: ${subject}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `
    })

    console.log('Mail gönderim sonucu:', data)

    return NextResponse.json(
      { 
        success: true,
        data 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Mail gönderim hatası:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Mesaj gönderilemedi'
      },
      { status: 500 }
    )
  }
}