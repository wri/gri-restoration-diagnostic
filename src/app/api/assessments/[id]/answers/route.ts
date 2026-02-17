import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Lazy load database modules to avoid circular dependency issues
  const { saveAnswer } = await import('@/db/queries/assessment-queries')
  
  try {
    const body = await request.json()
    const { questionId, value, rationale, notes } = body
    
    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'questionId is required' },
        { status: 400 }
      )
    }
    
    const answer = await saveAnswer(
      params.id,
      questionId,
      value || undefined,
      rationale || undefined,
      notes || undefined
    )
    
    return NextResponse.json({ 
      success: true, 
      answer,
      savedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to save answer:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save answer',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint for fetching answers (optional, for refresh)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { getQuestionsWithAnswers } = await import('@/db/queries/assessment-queries')
  
  try {
    console.log("🚀 ~ GET ~ params:", params)
    const answers = await getQuestionsWithAnswers(params.id)
    return NextResponse.json({ success: true, answers })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}
