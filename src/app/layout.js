'use client';

import '../styles/globals.css'
import { TranslationProvider } from '../contexts/TranslationContext'
import { AuthProvider } from '../contexts/AuthContext'
import { CompareProvider } from '../contexts/CompareContext'
import { AlertProvider } from '../contexts/AlertContext'
import QueryProvider from '../providers/QueryProvider'
import VideoOverlay from '../components/VideoOverlay'
import { useEffect } from 'react'

export default function RootLayout({ children }) {
  useEffect(() => {
    document.title = 'Al-Asmakh';
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@200..1000&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen ">
        <QueryProvider>
          <TranslationProvider>
            <AuthProvider>
              <CompareProvider>
                <AlertProvider>
                  {/* ✅ Video Overlay - Shows on page load */}
                  <VideoOverlay />
                  {/* ✅ UNIVERSAL CONTAINER */}
                  <main className="mx-auto w-full max-w-auto px-0 md:px-0">
                    {children}
                  </main>
                </AlertProvider>
              </CompareProvider>
            </AuthProvider>
          </TranslationProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
