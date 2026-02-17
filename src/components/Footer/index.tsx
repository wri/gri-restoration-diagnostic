'use client'

import Link from 'next/link'
import { Footer as WriFooter } from '@worldresources/wri-design-systems'

const partnerLogos = [
  <img 
    key="partner-1"
    src="/images/IUCN-logo.png" 
    alt="Assessment Partner" 
    height="32px" 
  />
]


export const Footer = () => {
  return (
    <WriFooter maxWidth={1440} filled additionalLogos={partnerLogos}>
      <Link href={'#'}>Privacy policy</Link>
      <Link href={'#'}>Terms of service</Link>
    </WriFooter>
  )
}
