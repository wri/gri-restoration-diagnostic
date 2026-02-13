import { Button } from '@worldresources/wri-design-systems'
import { ChevronUpIcon, EditIcon } from '../../icons'
import { Collapsible } from '@chakra-ui/react'
import { useState } from 'react'
import { TrailingIcon } from '../../icons/Trailing'

const CardContainer = ({
  title,
  children,
  onContinue,
  onEdit,
  hideLabel,
}: {
  title: string
  children: React.ReactNode
  onContinue?: () => void
  onEdit?: () => void
  hideLabel?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='p-4 bg-white rounded-lg border border-neutral-300 shadow-sm mb-5'>
      <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:gap-2 gap-1'>
          <p className='text-2xl font-bold text-neutral-900'>{title}</p>

          <div className='flex items-center gap-2'>
            {onContinue ? (
              <Button
                onClick={onContinue}
                className='text-sm text-neutral-500'
                size='small'
              >
                Continue <TrailingIcon className='ml-1.5' />
              </Button>
            ) : null}

            {onEdit ? (
              <Button
                onClick={onEdit}
                className='text-sm text-neutral-500'
                size='small'
              >
                <EditIcon className='mr-1.5' />
                Edit
              </Button>
            ) : null}

            {hideLabel ? (
              <Collapsible.Trigger asChild>
                <Button
                  onClick={() => setOpen(!open)}
                  size='small'
                  variant='secondary'
                  label={`${open ? 'Hide' : 'Show'} ${hideLabel}`}
                  rightIcon={
                    <ChevronUpIcon
                      className={open ? 'rotate-180' : 'text-purple-400'}
                    />
                  }
                />
              </Collapsible.Trigger>
            ) : null}
          </div>
        </div>

        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export default CardContainer
