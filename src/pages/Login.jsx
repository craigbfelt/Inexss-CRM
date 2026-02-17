import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks';
import { Button, Input, Card } from '../components';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, configError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-apple-blue via-apple-indigo to-apple-purple bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Inexss CRM
          </motion.h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="p-8">
          {configError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-2">{configError}</p>
                  <div className="text-xs text-red-700 space-y-1">
                    <p>To fix this:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Create a <code className="bg-red-100 px-1 rounded">.env</code> file in the project root</li>
                      <li>Add your Supabase credentials</li>
                      <li>Restart the development server</li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">{error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-apple-blue focus:ring-apple-blue"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-apple-blue hover:text-apple-indigo font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !isSupabaseConfigured}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="text-apple-blue hover:text-apple-indigo font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Inexss Specialised Solutions. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
