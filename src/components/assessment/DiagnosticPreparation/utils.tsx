import TargetGeography from './TargetGeography'
import TimeHorizon from './TimeHorizon'
import RestorationGoals from './RestorationGoals'
import DefineEngagement from './DefineEngagement'
import GatherMaterials from './GatherMaterials'
import { PREPARATION_STEPS } from '@/constants'
import type { createTranslator } from '@/i18n/utils'

type TranslationFunction = ReturnType<typeof createTranslator>

export const preparationStepOrder = [
  PREPARATION_STEPS.TARGET_GEOGRAPHY,
  PREPARATION_STEPS.TIME_HORIZON,
  PREPARATION_STEPS.RESTORATION_GOALS,
  PREPARATION_STEPS.DEFINE_ENGAGEMENT,
  PREPARATION_STEPS.GATHER_MATERIALS,
]

export const getPreparationSteps = (t: TranslationFunction) => [
  {
    id: PREPARATION_STEPS.TARGET_GEOGRAPHY,
    title: t('scoping.sidebar.steps.targetGeography'),
    section: 'scope',
    guidance: [
      {
        title: t('scoping.guidance.step1.whySetTargetGeography.title'),
        content: t('scoping.guidance.step1.whySetTargetGeography.content'),
      },
      {
        title: t('scoping.guidance.step1.howToDoIt.title'),
        content: t('scoping.guidance.step1.howToDoIt.content'),
      },
    ],
    component: <TargetGeography />,
  },
  {
    id: PREPARATION_STEPS.TIME_HORIZON,
    title: t('scoping.sidebar.steps.timeHorizon'),
    section: 'scope',
    guidance: [
      {
        title: t('scoping.guidance.step2.whySetTimeHorizon.title'),
        content: t('scoping.guidance.step2.whySetTimeHorizon.content'),
      },
      {
        title: t('scoping.guidance.step2.howToDoIt.title'),
        content: t('scoping.guidance.step2.howToDoIt.content'),
      },
    ],
    component: <TimeHorizon />,
  },
  {
    id: PREPARATION_STEPS.RESTORATION_GOALS,
    title: t('scoping.sidebar.steps.restorationGoals'),
    section: 'scope',
    guidance: [
      {
        title: t('scoping.guidance.step3.whySetRestorationGoals.title'),
        content: t('scoping.guidance.step3.whySetRestorationGoals.content'),
      },
      {
        title: t('scoping.guidance.step3.howToDoIt.title'),
        content: t('scoping.guidance.step3.howToDoIt.content'),
      },
    ],
    component: <RestorationGoals />,
  },
  {
    id: PREPARATION_STEPS.DEFINE_ENGAGEMENT,
    title: t('scoping.sidebar.steps.engagement'),
    section: 'approach',
    guidance: [
      {
        title: t('scoping.guidance.step4.designingEngagement.title'),
        content: t('scoping.guidance.step4.designingEngagement.content'),
      },
      {
        title: t('scoping.guidance.step4.ensuringInclusion.title'),
        content: t('scoping.guidance.step4.ensuringInclusion.content'),
      },
    ],
    component: <DefineEngagement />,
  },
  {
    id: PREPARATION_STEPS.GATHER_MATERIALS,
    title: t('scoping.sidebar.steps.materials'),
    section: 'approach',
    guidance: [
      {
        title: t('scoping.guidance.step5.preparingEvidence.title'),
        content: t('scoping.guidance.step5.preparingEvidence.content'),
      },
      {
        title: t('scoping.guidance.step5.organizingAccess.title'),
        content: t('scoping.guidance.step5.organizingAccess.content'),
      },
    ],
    component: <GatherMaterials />,
  },
]

type EcosystemOption = {
  children: string
  name: string
  value: string
}

export const terrestrialEcosystems: EcosystemOption[] = [
  {
    children: 'Tropical-subtropical forests',
    name: 'tropical-subtropical-forests',
    value: 'tropical-subtropical-forests',
  },
  {
    children: 'Temperate-boreal forests and woodlands',
    name: 'temperate-boreal-forests-and-woodlands',
    value: 'temperate-boreal-forests-and-woodlands',
  },
  {
    children: 'Shrublands and shrubby woodlands',
    name: 'shrublands-and-shrubby-woodlands',
    value: 'shrublands-and-shrubby-woodlands',
  },
  {
    children: 'Savannas and grasslands',
    name: 'savannas-and-grasslands',
    value: 'savannas-and-grasslands',
  },
  {
    children: 'Deserts and semi-deserts',
    name: 'deserts-and-semi-deserts',
    value: 'deserts-and-semi-deserts',
  },
  {
    children: 'Polar-alpine',
    name: 'polar-alpine',
    value: 'polar-alpine',
  },
  {
    children: 'Productive and agricultural systems',
    name: 'productive-and-agricultural-systems',
    value: 'productive-and-agricultural-systems',
  },
  {
    children: 'Urban Landscapes',
    name: 'urban-landscapes',
    value: 'urban-landscapes',
  },
]

export const freshwaterEcosystems: EcosystemOption[] = [
  {
    children: 'Peatlands',
    name: 'peatlands',
    value: 'peatlands',
  },
  {
    children: 'Wetlands',
    name: 'wetlands',
    value: 'wetlands',
  },
  {
    children: 'Riparian ecosystems',
    name: 'riparian-ecosystems',
    value: 'riparian-ecosystems',
  },
  {
    children: 'Catchments',
    name: 'catchments',
    value: 'catchments',
  },
  {
    children: 'Artificial fresh waters',
    name: 'artificial-fresh-waters',
    value: 'artificial-fresh-waters',
  },
]

export const marineEcosystems: EcosystemOption[] = [
  {
    children: 'Marine shelfs',
    name: 'marine-shelfs',
    value: 'marine-shelfs',
  },
  {
    children: 'Mangroves and shoreline systems',
    name: 'mangroves-and-shoreline-systems',
    value: 'mangroves-and-shoreline-systems',
  },
  {
    children: 'Deep-sea floors',
    name: 'deep-sea-floors',
    value: 'deep-sea-floors',
  },
]
