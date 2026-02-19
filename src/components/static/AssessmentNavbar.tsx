'use client'

import Link from 'next/link'
import { Source_Serif_4 } from 'next/font/google'
import {
  Navbar,
  Menu,
  Button,
  getThemedColor,
} from '@worldresources/wri-design-systems'
import { WriLogoIcon } from '@/components/icons'
import { languageOptions } from '@/constants/language-options'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['600'],
})

export default function AssessmentNavbar() {
  const [language, setLanguage] = useState('')
  const pathname = usePathname()

  return (
    <Navbar
      pathname={pathname}
      linkRouter={Link}
      logo={
        <Link href={'/'}>
          <WriLogoIcon height='auto' width='120px' />
          <Button
            variant='borderless'
            bgColor={'transparent'}
            fontSize={'18px'}
            color={getThemedColor('neutral', 800)}
            css={{ ...sourceSerif4.style }}
          >
            Restoration Diagnostic
          </Button>
        </Link>
      }
      navigationSection={[]}
      utilitySection={[
        <Menu
          key='language-menu'
          label={
            languageOptions?.find((l) => l.value === language)?.label ||
            'Language'
          }
          items={languageOptions}
          onSelect={setLanguage}
        />,
      ]}
      actionsSection={[]}
      fixed
    />
  )
}
