import { ClientProviders } from '../components/ClientProviders'
import './globals.css'

export const metadata = {
  title: 'Inexss CRM - Specialized Solutions',
  description: 'Inexx Specialised Solutions CRM - Managing building projects and client relationships',
}

export const viewport = {
  themeColor: '#667eea',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
