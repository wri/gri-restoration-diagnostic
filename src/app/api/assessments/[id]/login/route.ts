import 'reflect-metadata'
import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Initialize database FIRST
    const { initializeDatabase } = await import('@/db/data-source')
    await initializeDatabase()

    // 2. THEN import query functions
    const { getAssessmentById } = await import('@/db/queries/assessment-queries')

    // 3. Import session utilities
    const { createSessionCookie } = await import('@/utils/session')

    // 4. Parse request body and params
    const { id } = await params
    const body = await request.json()
    const { password } = body

    // 5. Validate password field
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // 6. Fetch assessment with passwordHash field
    const assessment = await getAssessmentById(id)

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // 7. Verify password with bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(password, assessment.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'The password is incorrect or does not match this diagnostic. If the issue persists, please contact our team.'
        },
        { status: 401 }
      )
    }

    // 8. Set cookie and return response
    const cookie = createSessionCookie(id)
    const response = NextResponse.json({ success: true })

    response.cookies.set('assessment_session', cookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Error in password login:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
