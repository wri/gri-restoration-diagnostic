'use client'

import Link from 'next/link'
import { Navbar, Footer, Menu } from '@worldresources/wri-design-systems'
import { SubNavbar } from './SubNavbar'
import { QuestionView } from './QuestionView'
import { WriLogoIcon } from '@/components/icons'
import type { AnswerValue } from '@/db/entities/Answer.entity'
import type { Theme } from '@/db/entities/Question.entity'

// Plain object interfaces for data passed from server
export interface PlainQuestion {
  id: string
  questionCode: string
  theme: Theme
  enablingCondition: string
  keySuccessFactor: string
  definition: string | null
  questionText: string
  considerations: string | null
  followUpQuestions: any
  strategyExamples: string | null
  sortOrder: number
  diagnosticId: string
  createdAt: Date
}

export interface PlainAnswer {
  id: string
  value: AnswerValue | null
  rationale: string | null
  notes: string | null
  assessmentId: string
  questionId: string
  createdAt: Date
  updatedAt: Date
}

interface ThemePageLayoutProps {
  assessmentId: string
  assessmentTitle: string
  theme: 'Motivate' | 'Enable' | 'Implement'
  pathname: string
  language: string
  questions: PlainQuestion[]
  initialAnswers: Map<string, PlainAnswer>
  focusQuestionCode: string
  canGoPrev: boolean
  canGoNext: boolean
  prevTheme: string | null
  nextTheme: string | null
}

const languages = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Spanish',
    value: 'es',
  },
]

export function ThemePageLayout({
  assessmentId,
  assessmentTitle,
  theme,
  pathname,
  language,
  questions,
  initialAnswers,
  focusQuestionCode,
  canGoPrev,
  canGoNext,
  prevTheme,
  nextTheme,
}: ThemePageLayoutProps) {
  // Partner logo for footer
  const partnerLogos = [
    <img 
      key="partner-1"
      src="/images/IUCN-logo.png" 
      alt="Assessment Partner" 
      height="32px" 
    />
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-light gradient-bg">
      
      {/* Sub-navbar - Custom */}
      <header className="border-b border-slate-200 sticky top-0 bg-white z-40">
        <SubNavbar
          assessmentTitle={assessmentTitle}
          assessmentId={assessmentId}
        />
      </header>
      
      {/* Main content with gradient background */}
      <div className="flex mx-auto w-full relative flex-1">
        <QuestionView
          assessmentId={assessmentId}
          theme={theme}
          questions={questions}
          initialAnswers={initialAnswers}
          focusQuestionCode={focusQuestionCode}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          prevTheme={prevTheme}
          nextTheme={nextTheme}
        />
      </div>
      
      <Footer additionalLogos={partnerLogos}>{''}</Footer>
    </div>
  )
}
