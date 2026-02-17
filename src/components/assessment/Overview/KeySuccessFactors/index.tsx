'use client'

import SectionTitle from '../SectionTitle'
import { Questions } from '@/types/questions.types'
import { Theme } from '@/db/entities'
import KeySuccessFactorsSection from './KeySuccessFactorsSection'

interface KeySuccessFactorsProps {
  assessmentId: string
  questions: Questions[]
}

const KeySuccessFactors = ({
  assessmentId,
  questions,
}: KeySuccessFactorsProps) => {
  const motivateQuestions = questions.filter((q) => q.theme === Theme.MOTIVATE)

  const enableQuestions = questions.filter((q) => q.theme === Theme.ENABLE)

  const implementQuestions = questions.filter(
    (q) => q.theme === Theme.IMPLEMENT,
  )

  return (
    <div>
      <SectionTitle
        index={2}
        title='Key success factors'
        onProgressClick={() => {}}
        onResponsesClick={() => {}}
      />

      <KeySuccessFactorsSection
        questions={motivateQuestions}
        assessmentId={assessmentId}
        theme={Theme.MOTIVATE}
        title='Motivate'
        caption='Factors that create incentives and demand for restoration among investors, policymakers, and implementers.'
      />

      <KeySuccessFactorsSection
        questions={enableQuestions}
        assessmentId={assessmentId}
        theme={Theme.ENABLE}
        title='Enable'
        caption='Policies, institutions, finance, and land tenure conditions.'
      />

      <KeySuccessFactorsSection
        questions={implementQuestions}
        assessmentId={assessmentId}
        theme={Theme.IMPLEMENT}
        title='Implement'
        caption='Technical capacity, knowledge, and operational readiness.'
      />
    </div>
  )
}

export default KeySuccessFactors
