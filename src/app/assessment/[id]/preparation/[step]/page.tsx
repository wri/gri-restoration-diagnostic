'use client'

import DefineEngagement from '@/components/assessment/DiagnosticPreparation/DefineEngagement'
import GatherMaterials from '@/components/assessment/DiagnosticPreparation/GatherMaterials'
import Guidance from '@/components/assessment/DiagnosticPreparation/Guidance'
import RestorationGoals from '@/components/assessment/DiagnosticPreparation/RestorationGoals'
import Steps from '@/components/assessment/DiagnosticPreparation/Steps'
import TargetGeography from '@/components/assessment/DiagnosticPreparation/TargetGeography'
import TimeHorizon from '@/components/assessment/DiagnosticPreparation/TimeHorizon'
import { Button } from '@worldresources/wri-design-systems'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const steps = [
  {
    title: 'Target geography',
    section: 'scope',
    guidance: [
      {
        title: 'Why set the target geography',
        content:
          'The geographic area determines which ecosystems/landscapes and scales are assessed, which stakeholders are involved and which restoration options are considered.',
      },
      {
        title: 'How to do it',
        content:
          'Group areas with similar ecological and socio-economic conditions. Avoid splitting ecologically similar areas into separate diagnostics, instead separating areas that differ clearly in ecology, land use, or governance.',
      },
    ],
    component: <TargetGeography />,
  },
  {
    title: 'Time horizon',
    section: 'scope',
    guidance: [
      {
        title: 'Why set the time horizon',
        content:
          'Restoration outcomes often take several years to fully materialise. A clear time horizon helps set realistic expectations, choose appropriate restoration approaches, and align the diagnostic with relevant policy and planning processes.',
      },
      {
        title: 'How to do it',
        content:
          'Use a long-term vision for restoration, while recognising that implementation may occur in phases. Where possible, align the timeframe with existing national or sub-national plans to support coordination and uptake.',
      },
    ],
    component: <TimeHorizon />,
  },
  {
    title: 'Restoration goals',
    section: 'scope',
    guidance: [
      {
        title: 'Why set restoration goals',
        content:
          'Clear restoration goals guide which restoration options are assessed, help manage trade-offs, and define what success looks like for the diagnostic.',
      },
      {
        title: 'How to do it',
        content:
          'Agree on goals early with key stakeholders and keep them specific enough to inform decisions. Where helpful, use the ROAM methodology to support goal-setting and alignment.',
      },
    ],
    component: <RestorationGoals />,
  },
  {
    title: 'Define engagement',
    section: 'approach',
    guidance: [
      {
        title: 'Designing stakeholder engagement',
        content:
          'Start by mapping the social landscape around restoration: who the users are, who is affected, and who has influence. Identify stakeholder needs, motivations, and relationships to understand where friction or alignment may occur. Use this insight to design engagement touchpoints—workshops, interviews, feedback loops—that are inclusive, iterative, and responsive to context. Treat stakeholders as co-designers, not just data sources, to improve usability, relevance, and adoption of the tool.',
      },
      {
        title: 'Ensuring inclusion and equity',
        content: `
          <p>
            Some participants may hesitate to share in group settings, and local social/gender dynamics can exclude marginalized groups.
            The coordinating team should adapt engagement methods to ensure diverse perspectives are captured. This can be done by:
          </p>
          <ul>
            <li>holding separate focus groups for women and/or Indigenous communities</li>
            <li>using local languages</li>
            <li>including trusted intermediaries</li>
            <li>providing travel/compensation where needed</li>
            <li>creating safe space agreements</li>
            <li>allowing anonymous written input for sensitive questions</li>
          </ul>
          `,
      },
    ],
    component: <DefineEngagement />,
  },
  {
    title: 'Gather materials',
    section: 'approach',
    guidance: [
      {
        title: 'Preparing your evidence',
        content:
          'The diagnostic asks you to assess whether key enabling conditions are in place. To answer confidently and consistently, you will need to refer to existing documents, data sources, and policy materials.',
      },
      {
        title: 'Organising access to documents',
        content:
          'Add links to a shared folder or individual documents stored online (for example, in a shared drive or document platform). This ensures that everyone involved can quickly access the same information during workshops or distributed completion.',
      },
    ],
    component: <GatherMaterials />,
  },
]

const PreparationPage = () => {
  const params = useParams()

  const assessmentId = params.id as string
  const activeStep = Number(params.step)

  const stepData = steps[activeStep - 1]

  if (!stepData)
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-48px-56px)] gap-4'>
        Step not found
        <Link href={`/assessment/${assessmentId}/preparation/1`}>
          <Button>Back to first step</Button>
        </Link>
      </div>
    )

  return (
    <div className='mx-auto flex max-w-[1280px] overflow-hidden'>
      <aside className='w-[240px] flex-shrink-0 pt-8 ml-12'>
        <Steps
          steps={steps}
          activeStep={activeStep}
          assessmentId={assessmentId}
        />
      </aside>
      <main className='flex-1 overflow-y-auto pt-8 w-[560px] px-14 max-h-[calc(100vh-48px-56px)]'>
        {steps[activeStep - 1]?.component}
      </main>
      <aside className='w-[320px] flex-shrink-0'>
        <Guidance steps={steps} activeStep={activeStep} />
      </aside>
    </div>
  )
}

export default PreparationPage
