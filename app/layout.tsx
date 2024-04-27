import './globals.css'
import type { Metadata } from 'next'

//Wrapper for whole application
export const metadata: Metadata = {
  title: 'Richie AI Template',
  description: 'Template code for the Richie AI Project',
}

//Children - Wrapper for the whole application. 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
