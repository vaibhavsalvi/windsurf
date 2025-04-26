import './globals.css'
import type { Metadata } from 'next'
import { LLMModelProvider } from './contexts/LLMModelContext'

export const metadata: Metadata = {
  title: 'LLM Model Context Demo',
  description: 'A demo of LLM model context implementation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LLMModelProvider>
          <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <div className="text-xl font-bold text-blue-500">WindsurfSocial</div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-blue-500">Home</button>
                  <button className="text-gray-600 hover:text-blue-500">Profile</button>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </LLMModelProvider>
      </body>
    </html>
  )
}
