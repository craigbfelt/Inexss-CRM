'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { isEmailProviderError } from '../utils/errorHelpers';

const ConfigurationError = ({ message }) => {
  const showEmailProviderHelp = isEmailProviderError(message);

  return (
    <motion.div 
      style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: showEmailProviderHelp ? '600px' : '500px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.5rem' }}>
        ⚠️ Configuration Error
      </h1>
      <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: '1.6' }}>
        {message}
      </p>
      <div style={{ 
        background: '#f3f4f6', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        textAlign: 'left',
        fontSize: '0.875rem',
        color: '#4b5563'
      }}>
        {showEmailProviderHelp ? (
          <>
            <strong>🔧 Quick Fix for Email Login Issue:</strong>
            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', lineHeight: '1.8' }}>
              <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'underline' }}>Supabase Dashboard</a></li>
              <li>Select your project</li>
              <li>Navigate to <strong>Authentication</strong> → <strong>Providers</strong></li>
              <li>Find <strong>Email</strong> in the providers list</li>
              <li>Toggle it <strong>ON</strong> to enable email authentication</li>
              <li>Click <strong>Save</strong></li>
              <li>Refresh this page and try logging in again</li>
            </ol>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: '#dbeafe', 
              borderLeft: '4px solid #3b82f6',
              borderRadius: '0.25rem'
            }}>
              <strong>📖 Need detailed help?</strong>
              <p style={{ marginTop: '0.25rem' }}>
                See <code>EMAIL_LOGIN_FIX.md</code> in the project root for complete step-by-step instructions.
              </p>
            </div>
          </>
        ) : (
          <>
            <strong>To fix this:</strong>
            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              <li>Copy <code>.env.example</code> to <code>.env</code></li>
              <li>Set your Supabase URL and anon key in <code>.env</code></li>
              <li>Restart the development server</li>
            </ol>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ConfigurationError;
