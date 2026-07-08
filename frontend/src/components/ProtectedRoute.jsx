import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page: <ProtectedRoute><Dashboard /></ProtectedRoute>
// Redirects to /login if there's no user.
// Note: this is UX only, not real security — the actual security
// boundary is the backend's requireAuth middleware from Stage 3.
// A logged-out user COULD view this component's code in devtools;
// they just can't get real data back from the API without a token.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}