import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';

export default function AdminProtectedRoute({ children, requiredRole }) {
  const { db, isLoading } = useCms();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentUser = db?.admin?.currentUser;

  if (!currentUser) {
    // Not logged in, redirect to admin login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'Super Admin') {
    // Does not have the required role (and isn't Super Admin)
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
