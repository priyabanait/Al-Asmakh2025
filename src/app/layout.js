'use client';

import '../styles/globals.css'
import { TranslationProvider } from '../contexts/TranslationContext'
import { AuthProvider } from '../contexts/AuthContext'
import { useEffect } from 'react'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Set document title and meta description
    document.title = 'Al-Asmakh';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Al-Asmakh Website');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Al-Asmakh Website';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Al-Asmakh</title>
        <meta name="description" content="Al-Asmakh Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TranslationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
