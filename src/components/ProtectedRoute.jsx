import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Loading } from '../components';

// NOTE: This component provides UI-level route protection only.
// For true security, always implement Row Level Security (RLS) policies
// in Supabase to enforce permissions at the database level.
// Frontend checks can be bypassed, database policies cannot.

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, userProfile, configError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Loading />
      </div>
    );
  }

  // Show configuration error if Supabase is not configured
  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Configuration Error
          </h2>
          <p className="text-center text-gray-600 mb-4">
            {configError}
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-700 mb-2">
              To fix this issue:
            </p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your Supabase credentials:
                <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has the right role
  if (allowedRoles.length > 0 && userProfile) {
    if (!allowedRoles.includes(userProfile.role)) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
