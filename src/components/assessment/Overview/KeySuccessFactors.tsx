'use client'

import SectionTitle from './SectionTitle'
import CardContainer from './CardContainer'
import { CheckCircleIcon } from '../../icons'

interface KeySuccessFactorsProps {
  data: {
    questions: {
      section: string
      question: string
      status: string
      response: string
      rationale: number
      strategies: number
    }[]
  }
}

const KeySuccessFactors = ({ data }: KeySuccessFactorsProps) => {
  const complete = data.questions.filter((q) => q.status === 'complete').length
  const incomplete = data.questions.filter(
    (q) => q.status === 'incomplete',
  ).length
  const notStarted = data.questions.filter(
    (q) => q.status === 'not-started',
  ).length
  const total = data.questions.length

  return (
    <div>
      <SectionTitle index={2} title='Key success factors' />
      <CardContainer
        title='Motivate'
        hideLabel='Hide table'
        onContinue={() => {}}
      >
        <p className='text-neutral-800 w-full max-w-[560px] mb-2'>
          Factors that create incentives and demand for restoration among
          investors, policymakers, and implementers.
        </p>

        <div className='flex items-center gap-2'>
          <p className='text-neutral-700 text-sm'>
            {complete}/{total} complete
          </p>
          <div className='w-[1px] h-5 bg-neutral-300' />
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-0.5'>
              <CheckCircleIcon className='text-success-500 h-4 w-4' />
              <p className='text-neutral-700 text-sm'>{complete}</p>
            </div>
            <div className='flex items-center gap-0.5'>
              <CheckCircleIcon className='text-success-500 h-4 w-4' />
              <p className='text-neutral-700 text-sm'>{incomplete}</p>
            </div>
            <div className='flex items-center gap-0.5'>
              <CheckCircleIcon className='text-success-500 h-4 w-4' />
              <p className='text-neutral-700 text-sm'>2</p>
            </div>
            <div className='flex items-center gap-0.5'>
              <CheckCircleIcon className='text-success-500 h-4 w-4' />
              <p className='text-neutral-700 text-sm'>{notStarted}</p>
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
  )
}

export default KeySuccessFactors
