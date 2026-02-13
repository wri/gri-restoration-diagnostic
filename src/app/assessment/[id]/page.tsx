import Scope from '@/components/assessment/Overview/Scope'
import KeySuccessFactors from '@/components/assessment/Overview/KeySuccessFactors'

const data = {
  keySuccessFactors: {
    questions: [
      {
        id: 1,
        section: 'benefits',
        question: 'Restoration generates economic benefits',
        status: 'complete',
        response: 'partly',
        rationale: 1,
        strategies: 1,
      },
      {
        section: 'benefits',
        question: 'Restoration generates social benefits',
        status: 'complete',
        response: 'yes',
        rationale: 1,
        strategies: 1,
      },
      {
        section: 'benefits',
        question: 'Restoration generates environmental benefits',
        status: 'incomplete',
        response: 'partly',
        rationale: 1,
        strategies: 0,
      },
      {
        section: 'awareness',
        question: 'Benefits of restoration are publicly communicated',
        status: 'complete',
        response: 'partly',
        rationale: 1,
        strategies: 2,
      },
      {
        section: 'awareness',
        question: 'Opportunities for restoration are identified',
        status: 'not-started',
        response: '',
        rationale: 0,
        strategies: 0,
      },
    ],
  },
}

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { getAssessmentById } = await import('@/db/queries/assessment-queries')

  const assessment = await getAssessmentById(id)

  const scopeData = {
    title: assessment?.diagnostic?.title,
    diagnosticLead: {
      name: assessment?.lead?.name,
      email: assessment?.lead?.email,
      organization: assessment?.lead?.organization,
      role: assessment?.lead?.role,
    },
    diagnosticScope: {
      geography: {
        country: assessment?.region?.countries,
        geographyType: assessment?.region?.geographyType,
        subRegion: assessment?.region?.subRegion,
        gisUrl: assessment?.region?.gisUrl,
      },
      timeHorizon: {
        completionYear: assessment?.diagnosticYear,
      },
      restorationGoals: {
        goals: ['Biodiversity conservation', 'Water security'],
        ecosystems: assessment?.region?.ecosystems
          ? (JSON.parse(assessment?.region?.ecosystems) as string[])
          : ([] as string[]),
      },
    },
  }

  return (
    <div className='pb-20'>
      <div className='py-2 px-4 border-b border-neutral-400 mb-16'>
        <h1 className='text-lg font-bold text-neutral-800'>Overview</h1>
      </div>

      <div className='w-full max-w-screen-1100 p-4 mx-auto flex flex-col gap-10'>
        <Scope data={scopeData} />
        <KeySuccessFactors data={data.keySuccessFactors} />
      </div>
    </div>
  )
}
