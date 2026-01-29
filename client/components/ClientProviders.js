'use client';

import { AuthProvider } from '../contexts/AuthContext';

export function ClientProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
