import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type Role } from '../../store/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

/**
 * ProtectedRoute Component
 * @description Enterprise-grade route guard. Prevents unauthorized access via direct URL manipulation.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  const location = useLocation();

  // If the current role is not in the allowed list, intercept and redirect.
  if (!allowedRoles.includes(role)) {
    // We use `replace` to prevent the unauthorized route from being added to the browser history stack.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authorized, render the requested component.
  return <>{children}</>;
};

export default ProtectedRoute;