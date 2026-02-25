'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  InlineMessage,
  Panel,
  Password,
} from '@worldresources/wri-design-systems'
import { Box, Text } from '@chakra-ui/react'

interface PasswordPromptProps {
  assessmentId: string
}

export function PasswordPrompt({ assessmentId }: PasswordPromptProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!password) {
      setError('Password is required')
      return
    }

    // Clear any existing errors
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/assessments/${assessmentId}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.status === 401) {
        setError(
          'The password is incorrect or does not match this diagnostic. If the issue persists, please contact our team.',
        )
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        setError(
          'An error occurred while authenticating. Please try again later.',
        )
        setIsLoading(false)
        return
      }

      // Success - refresh the page to reload with session
      router.refresh()
    } catch (error) {
      setError(
        'Unable to connect to the server. Please check your connection and try again.',
      )
      setIsLoading(false)
      void error
    }
  }

  const handlePasswordChange = ({
    password: newPassword,
  }: {
    strength: string
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    specialCharacters: boolean
    password: string
  }) => {
    setPassword(newPassword)
    // Clear error when user starts typing again
    if (error) {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-white to-primary-200 min-h-[100vh]">
      <div className="max-w-[540px] py-16 w-full flex flex-col overflow-y-auto mx-auto">
        <div className="border border-neutral-300 m-auto rounded-none sm:rounded-[10px] overflow-hidden mb-6 w-full">
          <Panel 
            width='540px'
            content={
              <div className='p-6 sm:p-8'>
                <Text 
                  fontSize='3xl' 
                  fontWeight='bold' 
                  marginBottom={3} 
                  textAlign='left'
                  lineHeight={'short'}>
                  Enter password to access the diagnostic
                </Text>

                <Box marginBottom={error ? 3 : 5}>
                  <Password
                    label='Password'
                    onChange={handlePasswordChange}
                    hideValidations
                    required
                  />
                </Box>

                {error && (
                  <Box marginBottom={3}>
                    <InlineMessage variant='error' label={error} />
                  </Box>
                )}

                <Button
                  type='submit'
                  label={isLoading ? 'Authenticating...' : 'Resume diagnostic'}
                  disabled={isLoading || !password}
                  className='w-full'
                />
              </div>
            }
          />
        </div>
      </div>
    </form>
  )
}
