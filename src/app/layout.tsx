import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { ClerkProvider } from '@clerk/nextjs'
import { Agentation } from 'agentation'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { clerkConfig } from '@/lib/clerk-config'

const geistMono = GeistMono

export const metadata: Metadata = {
  title: 'Tool Parking',
  description: 'Your personal library of dev tools, services, and open-source projects',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Tool Parking',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider {...clerkConfig}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    // Initialize theme
                    var theme = localStorage.getItem('theme');
                    if (theme === 'pixel-drift') {
                      document.documentElement.classList.add('pixel-drift');
                    } else if (theme === 'light') {
                      document.documentElement.classList.add('light');
                    } else if (theme === 'system') {
                      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                        document.documentElement.classList.add('light');
                      }
                    }
                    // 'dark' or no value = default dark theme (no class needed)
                    
                    // Initialize accent color
                    var accentColor = localStorage.getItem('accent-color');
                    if (accentColor) {
                      var match = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(accentColor);
                      if (match) {
                        var rgb = parseInt(match[1], 16) + ' ' + parseInt(match[2], 16) + ' ' + parseInt(match[3], 16);
                        document.documentElement.style.setProperty('--accent', rgb);
                      }
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body className={`${geistMono.variable} font-sans antialiased bg-surface text-neutral-200 min-h-screen`}>
          <Providers>{children}</Providers>
          {process.env.NODE_ENV === 'development' && <Agentation />}
        </body>
      </html>
    </ClerkProvider>
  )
}
