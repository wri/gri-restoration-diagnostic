'use client'

import { Button } from '@worldresources/wri-design-systems'
import { AssignmentOutlinedIcon as Assignment, EditIcon as Edit, ShareIcon as Share } from '@/components/icons'

interface SubNavbarProps {
  assessmentTitle: string
  assessmentId: string
}

export function SubNavbar({ assessmentTitle, assessmentId }: SubNavbarProps) {
  const handleEditScope = () => {
    // Navigate to edit scope page (future implementation)
    console.log('Edit scope clicked')
  }
  
  const handleShare = () => {
    // Open share modal (future implementation)
    console.log('Share clicked')
  }
  
  const handleViewSummary = () => {
    // Navigate to overview/summary page
    window.location.href = `/assessment/${assessmentId}/overview`
  }
  
  return (
    <div className="mx-auto py-2 px-4 flex items-center justify-between border-t-2 border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-lg">{assessmentTitle}</h1>
        <Button 
          variant="secondary" 
          size="small" 
          leftIcon={<Edit />} 
          onClick={handleEditScope}
        >
          Edit scope
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-primary transition-colors" 
          onClick={handleShare}
        >
          <Share className="w-4 h-4" /> Share
        </button>
        <Button 
          variant="primary" 
          size="small" 
          leftIcon={<Assignment />}
          onClick={handleViewSummary}
        >
          View summary
        </Button>
      </div>
    </div>
  )
}
