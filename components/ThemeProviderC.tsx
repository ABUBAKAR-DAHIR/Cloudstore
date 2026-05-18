"use client"
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'

function ThemeProviderC({children} : {children: ReactNode}) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme='dark'
        enableSystem={true}
    >
        {children}
    </ThemeProvider>
  )
}

export default ThemeProviderC