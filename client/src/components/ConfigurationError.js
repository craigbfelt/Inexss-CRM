import React from 'react';
import { motion } from 'framer-motion';

const ConfigurationError = ({ message }) => {
  return (
    <motion.div 
      style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '500px',
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
        <strong>To fix this:</strong>
        <ol style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
          <li>Copy <code>.env.example</code> to <code>.env</code></li>
          <li>Set your Supabase URL and anon key in <code>.env</code></li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default ConfigurationError;
