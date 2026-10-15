import type { Metadata } from 'next'

import localFont from 'next/font/local'
import { cookies } from 'next/headers'
import './globals.css'

import Providers from '@/components/Providers'
import { Footer } from '@/components/Footer'
import GlobalNavbar from '@/components/GlobalNavbar'
import { HotjarScript } from '@/components/HotjarScript'
import { GoogleTagManager } from '@/components/GoogleTagManager'

// Partner logo for footer
const acuminPro = localFont({
  src: [
    {
      path: '../../assets/fonts/Acumin-Pro-Book.otf',
      weight: '400',
    },
    {
      path: '../../assets/fonts/Acumin-Pro-Bold.otf',
      weight: '700',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Restoration Diagnostic',
  description: 'WRI Restoration Diagnostic',
  // Site-wide crawler exclusion. Belt to the X-Robots-Tag header in
  // next.config.ts and the /robots.txt route; covers clients that render the
  // page but ignore response headers. Individual pages may only narrow this.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
      'max-image-preview': 'none',
      'max-video-preview': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialLanguage = cookieStore.get('language')?.value || 'en'

  return (
    <html lang='en'>
      <body className={`${acuminPro.className} antialiased`}>
        <GoogleTagManager />
        <HotjarScript />
        <Providers initialLanguage={initialLanguage}>
          <GlobalNavbar />
          <div className='pb-44 lg:pb-0'>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
