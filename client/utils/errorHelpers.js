/**
 * Shared utility functions for error handling across the application
 */

/**
 * Checks if an error message indicates that the email authentication provider is disabled
 * @param {string} message - The error message to check
 * @returns {boolean} - True if the error is related to email provider being disabled
 */
export const isEmailProviderError = (message) => {
  if (!message) return false;
  
  // Check for specific Supabase error messages about email authentication being disabled
  // These are the exact messages that Supabase returns when the Email provider is not enabled
  const emailProviderErrors = [
    'email signups are disabled',
    'email logins are disabled',
    'email authentication is disabled'
  ];
  
  const lowerMsg = message.toLowerCase();
  return emailProviderErrors.some(error => lowerMsg.includes(error));
};

/**
 * Gets a user-friendly error message for authentication errors
 * @param {Error|string} error - The error object or message
 * @returns {string} - A user-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  const errorMessage = typeof error === 'string' ? error : (error?.message || 'Login failed');
  
  // Check for email provider disabled error
  if (isEmailProviderError(errorMessage)) {
    return 'Email login is currently disabled. Please enable the Email authentication provider in your Supabase dashboard (Authentication → Providers → Email). See EMAIL_LOGIN_FIX.md for detailed instructions.';
  }
  
  // Check for invalid credentials
  const lowerMsg = errorMessage.toLowerCase();
  if (lowerMsg.includes('invalid') && lowerMsg.includes('credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  // Return the original message if no specific handling is needed
  return errorMessage;
};
