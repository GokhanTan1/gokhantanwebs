import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { path } = await request.json()
    console.log('Revalidate request for path:', path)
    
    if (!path) {
      console.error('No path provided for revalidation')
      return NextResponse.json(
        { success: false, message: 'Path is required' },
        { status: 400 }
      )
    }

    // Kök dizini revalidate et - tüm layout ve paylaşılan bileşenler için
    revalidatePath('/', 'layout')
    console.log('Revalidated layout')

    // Ana sayfayı revalidate et
    revalidatePath('/')
    console.log('Revalidated root path /')

    // İstenen sayfayı revalidate et
    if (path !== '/') {
      revalidatePath(path)
      console.log('Revalidated path:', path)
    }

    // Layout değişikliklerinin etkili olması için tüm sayfaları revalidate et
    const paths = ['/about', '/contact', '/portfolio', '/experience']
    for (const p of paths) {
      revalidatePath(p)
      console.log('Revalidated additional path:', p)
    }
    
    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: ['/', path, ...paths]
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { success: false, message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}