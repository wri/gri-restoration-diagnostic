'use client'

import type { AnswerValue } from '@/db/entities/Answer.entity'
import { YesAnswerIcon, PartlyAnswerIcon, NoAnswerIcon } from '@/components/icons'

interface AnswerOptionsProps {
  value: AnswerValue | null
  onChange: (value: AnswerValue) => void
  disabled?: boolean
}

const answerConfig: Record<AnswerValue, { 
  label: string
  icon: React.ReactNode
  selectedColor: string
  unselectedColor: string
  bgColor: string
  borderColor: string
  borderColorNA?: string
}> = {
  yes: {
    label: 'Yes',
    icon: <YesAnswerIcon className="w-8 h-8" />,
    selectedColor: '#009E77',
    unselectedColor: '#C9C9C9',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-600'
  },
  partly: {
    label: 'Partly',
    icon: <PartlyAnswerIcon className="w-8 h-8" />,
    selectedColor: '#A88100',
    unselectedColor: '#C9C9C9',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500'
  },
  no: {
    label: 'No',
    icon: <NoAnswerIcon className="w-8 h-8" />,
    selectedColor: '#C11101',
    unselectedColor: '#C9C9C9',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500'
  },
  na: {
    label: 'N/A',
    icon: <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: '#3D3B3B' }} />,
    selectedColor: '#3D3B3B',
    unselectedColor: '#C9C9C9',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-400',
    borderColorNA: '#3D3B3B'
  }
}

export function AnswerOptions({ value, onChange, disabled }: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {(Object.entries(answerConfig) as [AnswerValue, typeof answerConfig[AnswerValue]][]).map(([answerValue, config]) => {
        const isSelected = value === answerValue
        
        return (
          <button
            key={answerValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(answerValue)}
            className={`group p-6 rounded-lg flex flex-col items-center justify-center gap-4 transition-all hover:shadow-lg border border-slate-200 ${
              isSelected
                ? `${config.bgColor} border-[${config.selectedColor}] border-3 ${config.borderColor} ring-${answerValue === 'yes' ? 'emerald' : answerValue === 'partly' ? 'amber' : answerValue === 'no' ? 'red' : 'slate'}-600`
                : 'bg-white border border-slate-200 hover:border-slate-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              borderWidth: isSelected ? '4px' : '1px',
              borderColor: isSelected ? config.selectedColor : 'inherit'
            }}
          >
            <div style={{ color: isSelected ? config.selectedColor : config.unselectedColor }}>
              {config.icon}
            </div>
            <span className={`font-bold ${
              isSelected ? 'text-slate-900' : 'text-slate-600'
            }`}>
              {config.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
