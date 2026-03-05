'use client'

import Loader from '@/components/ui/Loader'
import { useRouter } from 'next/navigation'

const RedirectToPreparation = ({
  assessmentId,
  step,
}: {
  assessmentId: string
  step: string
}) => {
  const router = useRouter()

  if (typeof window !== 'undefined') {
    router.replace(`/assessment/${assessmentId}/preparation/${step}`)
  }

  return (
    <div className='bg-gradient-to-t from-white to-primary-200 flex items-center justify-center h-[calc(100vh-48px-56px)]'>
      <Loader />
    </div>
  )
}

export default RedirectToPreparation
