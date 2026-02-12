'use client'

import type { AnswerValue } from '@/db/entities/Answer.entity'

interface FollowUpQuestionsProps {
  followUpQuestions: string | null // JSON string or plain text
  selectedAnswer: AnswerValue | null
}

export function FollowUpQuestions({ followUpQuestions, selectedAnswer }: FollowUpQuestionsProps) {
  // Don't show for N/A or no answer
  if (!selectedAnswer || selectedAnswer === 'na' || !followUpQuestions) {
    return null
  }
  
  // Parse follow-up questions
  let questions: string[] = []
  try {
    const parsed = JSON.parse(followUpQuestions)
    
    // Show based on answer value
    if (selectedAnswer === 'yes') {
      questions = parsed.yes || []
    } else if (selectedAnswer === 'no') {
      questions = parsed.no || []
    } else if (selectedAnswer === 'partly') {
      // Show ALL questions for partly
      questions = [...(parsed.yes || []), ...(parsed.no || []), ...(parsed.partly || [])]
    }
  } catch {
    // If not JSON, try splitting by newline
    questions = followUpQuestions.split('\n').filter(Boolean)
  }
  
  if (questions.length === 0) {
    return null
  }
  
  return (
    <div className="space-y-2">
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
      {/* Future: Add custom topic button */}
      <button className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50">
        <span className="material-symbols-outlined text-sm">add</span> Add your own question
      </button>
    </div>
  )
}
