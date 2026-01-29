import { Inter } from 'next/font/google'
import { ClientProviders } from '../components/ClientProviders'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Inexss CRM - Specialized Solutions',
  description: 'Inexx Specialised Solutions CRM - Managing building projects and client relationships',
  themeColor: '#667eea',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
