import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Login.css';

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    let timeoutId = null; // Track timeout for cleanup

    const handleEmailConfirmation = async () => {
      try {
        // Get token_hash and type from URL parameters
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash) {
          setStatus('error');
          setMessage('Invalid verification link. Please try signing up again.');
          timeoutId = setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Supabase automatically handles the session when detectSessionInUrl is true
        // We just need to verify the session was established
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage('Verification failed. Please try again or contact support.');
          timeoutId = setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          // Email verified and session established successfully
          setStatus('success');
          
          // Determine redirect based on verification type
          const isPasswordRecovery = type === 'recovery';
          if (isPasswordRecovery) {
            setMessage('Email verified! Redirecting to password reset...');
            // For password recovery, redirect to a password reset form
            // For now, redirect to dashboard (TODO: create password reset page)
            timeoutId = setTimeout(() => navigate('/dashboard'), 2000);
          } else {
            setMessage('Email verified successfully! Redirecting to dashboard...');
            timeoutId = setTimeout(() => navigate('/dashboard'), 2000);
          }
          
          // Update last login timestamp (only log errors, don't block)
          if (session.user) {
            try {
              await supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', session.user.id);
            } catch (updateError) {
              console.error('Failed to update last_login:', updateError);
              // Continue anyway - this is not critical
            }
          }
        } else {
          // No session means verification might have failed
          setStatus('error');
          setMessage('Could not establish session. Please try logging in manually.');
          timeoutId = setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Unexpected error during email confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try logging in manually.');
        timeoutId = setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleEmailConfirmation();

    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="login-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          className="form-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ 
            maxWidth: '500px', 
            textAlign: 'center',
            padding: '3rem'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {status === 'processing' && (
              <Loader 
                size={64} 
                style={{ 
                  color: '#667eea',
                  animation: 'spin 1s linear infinite',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '1rem'
                }} 
              />
            )}
            {status === 'success' && (
              <CheckCircle 
                size={64} 
                style={{ 
                  color: '#10b981',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '1rem',
                  display: 'block'
                }} 
              />
            )}
            {status === 'error' && (
              <XCircle 
                size={64} 
                style={{ 
                  color: '#ef4444',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '1rem',
                  display: 'block'
                }} 
              />
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}
          >
            {status === 'processing' && 'Verifying Email'}
            {status === 'success' && 'Verification Complete!'}
            {status === 'error' && 'Verification Failed'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}
          >
            {message}
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthConfirm;
