'use client'

import type { AnswerValue } from '@/db/entities/Answer.entity'
import { CheckIcon as Check, CloseIcon as Close, RemoveIcon as Remove } from '@/components/icons'

interface AnswerOptionsProps {
  value: AnswerValue | null
  onChange: (value: AnswerValue) => void
  disabled?: boolean
}

const answerConfig: Record<AnswerValue, { 
  label: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  iconBg: string
  iconBgSelected: string
}> = {
  yes: {
    label: 'Yes',
    icon: <Check className="w-6 h-6" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-600',
    iconBg: 'bg-slate-100',
    iconBgSelected: 'bg-emerald-600'
  },
  partly: {
    label: 'Partly',
    icon: <Remove className="w-6 h-6" />,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    iconBg: 'bg-slate-100',
    iconBgSelected: 'bg-amber-500'
  },
  no: {
    label: 'No',
    icon: <Close className="w-6 h-6" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    iconBg: 'bg-slate-100',
    iconBgSelected: 'bg-red-500'
  },
  na: {
    label: 'N/A',
    icon: <div className="w-3 h-3" />,
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-400',
    iconBg: 'bg-white border-2 border-slate-300',
    iconBgSelected: 'bg-slate-400'
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
            className={`group p-6 rounded flex flex-col items-center justify-center gap-4 transition-all hover:shadow-lg ring-offset-2 focus:ring-2 ${
              isSelected
                ? `${config.bgColor} border-2 ${config.borderColor} ring-${answerValue === 'yes' ? 'emerald' : answerValue === 'partly' ? 'amber' : answerValue === 'no' ? 'red' : 'slate'}-600`
                : 'bg-white border border-slate-200 hover:border-slate-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSelected
                ? `${config.iconBgSelected} text-white`
                : `${config.iconBg} text-slate-400`
            }`}>
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
