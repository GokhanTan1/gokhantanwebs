import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    console.log('ENV values:', {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    })

    const { username, password } = body

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET || '',
        { expiresIn: '1d' }
      )

      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      )

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/'
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}