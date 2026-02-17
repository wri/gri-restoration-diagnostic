'use client'

import { useState } from 'react'
import { Collapsible } from '@/components/assessment/Collapsible'
import { ChakraRichTextEditor } from '@/components/assessment/ChakraRichTextEditor'
import { GuidanceTabIcon, NotesTabIcon } from '@/components/icons'
import type { PlainQuestion } from './ThemePageLayout'

interface GuidanceSidebarProps {
  question: PlainQuestion
  notes: string
  onNotesChange: (notes: string) => void
}

type TabType = 'guidance' | 'notes'

export function GuidanceSidebar({ question, notes, onNotesChange }: GuidanceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('guidance')
  
  return (
    <aside className="bg-white w-80 flex-shrink-0 border-l border-slate-200 sticky top-[47px] h-[calc(100vh-47px)] overflow-y-auto">
      {/* Tab Navigation */}
      <div className="flex">
        <button
          onClick={() => setActiveTab('guidance')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'guidance'
              ? 'text-grey-700 border-0'
              : 'cursor-pointer text-slate-500 bg-slate-100 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <GuidanceTabIcon className="w-4 h-4" />
          Guidance
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'notes'
              ? 'text-grey-700 border-0'
              : 'cursor-pointer text-slate-500 bg-slate-100 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <NotesTabIcon className="w-4 h-4" />
          Notes
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'guidance' ? (
        <div className="collapsibles-container">
          <Collapsible title="Definition" defaultOpen>
            {question.definition ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: question.definition }} 
              />
            ) : (
              <p className="text-slate-400 italic">No definition available.</p>
            )}
          </Collapsible>
          
          <Collapsible title="Considerations">
            {question.considerations ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: question.considerations }} 
              />
            ) : (
              <p className="text-slate-400 italic">No considerations available.</p>
            )}
          </Collapsible>
          
          <Collapsible title="Example Strategies">
            {question.strategyExamples ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: question.strategyExamples }} 
              />
            ) : (
              <p className="text-slate-400 italic">No example strategies available.</p>
            )}
          </Collapsible>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-3">
            Add any notes or observations about this question for your team.
          </p>
          <ChakraRichTextEditor
            value={notes}
            onChange={onNotesChange}
            placeholder="Add notes about this question..."
            minHeight="300px"
          />
        </div>
      )}
    </aside>
  )
}
