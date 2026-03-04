import 'reflect-metadata'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/assessments/[id]/answers/[answerId]/contributors
 * Get contributors for a specific answer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  const { initializeDatabase } = await import('@/db/data-source')
  await initializeDatabase()
  const { getContributorsByAnswer } = await import('@/db/queries/assessment-queries')
  
  const { answerId } = await params
  
  try {
    const contributors = await getContributorsByAnswer(answerId)
    return NextResponse.json({ success: true, contributors })
  } catch (error) {
    console.error('Failed to fetch answer contributors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch answer contributors' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/assessments/[id]/answers/[answerId]/contributors
 * Set contributors for an answer (replaces existing)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  const { initializeDatabase } = await import('@/db/data-source')
  await initializeDatabase()
  const { setAnswerContributors } = await import('@/db/queries/assessment-queries')
  
  const { answerId } = await params
  
  try {
    const body = await request.json()
    const { contributorIds } = body
    
    if (!Array.isArray(contributorIds)) {
      return NextResponse.json(
        { success: false, error: 'contributorIds must be an array' },
        { status: 400 }
      )
    }
    
    await setAnswerContributors(answerId, contributorIds)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to set answer contributors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to set answer contributors' },
      { status: 500 }
    )
  }
}
