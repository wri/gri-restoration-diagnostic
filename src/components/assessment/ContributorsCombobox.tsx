'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Input } from '@chakra-ui/react'
import { Tag } from '@worldresources/wri-design-systems'
import { CloseIcon } from '@/components/icons'

export interface PlainContributor {
  id: string
  name: string
  assessmentId: string
  createdAt: Date | string
}

interface ContributorsComboboxProps {
  assessmentId: string
  answerId: string | undefined
  selectedContributorIds: string[]
  allContributors: PlainContributor[]
  onContributorsChange: (contributorIds: string[]) => void
  onContributorCreate: (name: string) => Promise<PlainContributor>
  disabled?: boolean
}

export function ContributorsCombobox({
  answerId,
  selectedContributorIds,
  allContributors,
  onContributorsChange,
  onContributorCreate,
  disabled = false,
}: ContributorsComboboxProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedContributors = allContributors.filter(c => 
    selectedContributorIds.includes(c.id)
  )
  
  // Filter available contributors by input (exclude already selected)
  const filteredContributors = allContributors.filter(c =>
    c.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedContributorIds.includes(c.id)
  )
  
  // Check if input matches any existing contributor exactly
  const exactMatch = allContributors.find(c => 
    c.name.toLowerCase() === inputValue.trim().toLowerCase()
  )
  
  const showCreateOption = inputValue.trim() !== '' && !exactMatch
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (contributorId: string) => {
    if (!selectedContributorIds.includes(contributorId)) {
      onContributorsChange([...selectedContributorIds, contributorId])
    }
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }
  
  const handleDeselect = (contributorId: string) => {
    onContributorsChange(
      selectedContributorIds.filter(id => id !== contributorId)
    )
  }
  
  const handleCreate = async () => {
    if (!inputValue.trim() || isCreating) return
    
    setIsCreating(true)
    try {
      const newContributor = await onContributorCreate(inputValue.trim())
      handleSelect(newContributor.id)
    } catch (error) {
      console.error('Failed to create contributor:', error)
    } finally {
      setIsCreating(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredContributors.length === 1) {
        handleSelect(filteredContributors[0].id)
      } else if (showCreateOption) {
        handleCreate()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setInputValue('')
    }
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Contributors
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Add the full name of everyone involved in answering this question.
        </p>
      </div>
      
      {/* Input field */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search or add contributor"
          disabled={disabled || !answerId}
          size="md"
          css={{
            backgroundColor: 'white',
            borderColor: 'neutral.300',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '14px',
            '&:focus': {
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
            },
            '&:disabled': {
              backgroundColor: 'neutral.100',
              cursor: 'not-allowed',
            },
          }}
        />
        
        {/* Dropdown */}
        {isOpen && (inputValue || filteredContributors.length > 0 || showCreateOption) && !disabled && answerId && (
          <Box
            ref={dropdownRef}
            css={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              maxHeight: '240px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'neutral.300',
              borderRadius: '4px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              zIndex: 50,
            }}
          >
            {filteredContributors.map((contributor) => (
              <div
                key={contributor.id}
                className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-900"
                onClick={() => handleSelect(contributor.id)}
              >
                {contributor.name}
              </div>
            ))}
            
            {showCreateOption && (
              <div
                className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-primary-600 font-medium border-t border-slate-200"
                onClick={handleCreate}
              >
                {isCreating ? (
                  'Creating...'
                ) : (
                  <>+ Create &quot;{inputValue.trim()}&quot;</>
                )}
              </div>
            )}
            
            {filteredContributors.length === 0 && !showCreateOption && inputValue && (
              <div className="px-3 py-2 text-sm text-slate-500">
                No contributors found
              </div>
            )}
          </Box>
        )}
      </div>
      
      {/* Selected contributors as tags */}
      {selectedContributors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedContributors.map((contributor) => (
            <Tag
              key={contributor.id}
              label={contributor.name}
              variant="info-white"
              size="default"
              onClose={() => handleDeselect(contributor.id)}
              icon={<CloseIcon />}
            />
          ))}
        </div>
      )}
      
      {!answerId && (
        <p className="text-sm text-slate-500 italic">
          Answer the question first to add contributors
        </p>
      )}
    </div>
  )
}
