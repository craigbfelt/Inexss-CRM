import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Loading } from '../components';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Loading />
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
