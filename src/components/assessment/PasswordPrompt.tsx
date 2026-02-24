'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  InlineMessage,
} from '@worldresources/wri-design-systems'
import { Box, Text, Input } from '@chakra-ui/react'

interface PasswordPromptProps {
  assessmentId: string
}

export function PasswordPrompt({ assessmentId }: PasswordPromptProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      void error;
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // Clear error when user starts typing again
    if (error) {
      setError(null)
    }
  }

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      minHeight='100vh'
      backgroundColor='gray.50'
      padding={4}
    >
      <Box
        maxWidth='500px'
        width='100%'
        backgroundColor='white'
        padding={8}
        borderRadius='lg'
        boxShadow='lg'
      >
        <Text fontSize='2xl' fontWeight='bold' marginBottom={6} textAlign='center'>
          Enter password to access the diagnostic
        </Text>

        <form onSubmit={handleSubmit}>
          <Box marginBottom={error ? 3 : 5}>
            <Box position='relative'>
              <Text
                fontSize='sm'
                fontWeight='medium'
                marginBottom={1}
                color='gray.700'
              >
                Password
              </Text>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                placeholder='Enter your password'
                size='md'
                required
              />
              <Button
                label={showPassword ? 'Hide' : 'Show'}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                variant='secondary'
                size='small'
                className='absolute right-2 top-8'
                type='button'
              />
            </Box>
          </Box>

          {error && (
            <Box marginBottom={3}>
              <InlineMessage variant='error' label={error} />
            </Box>
          )}

          <Button
            type='submit'
            label={isLoading ? 'Authenticating...' : 'Resume diagnostic'}
            disabled={isLoading}
            className='w-full'
          />
        </form>
      </Box>
    </Box>
  )
}
