import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const normalize = (v) => (v || '').toString().toLowerCase();

const ProtectRoute = ({ route = {}, children }) => {
  const { role: storeRole, userInfo, userLoaded } = useSelector((s) => s.auth || {});

  const currentRole = normalize(userInfo?.role || storeRole);
  const currentStatus = normalize(userInfo?.status || '');

  // Not logged in
  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  // Role / ability check
  if (route.role) {
    const allowedLower = (Array.isArray(route.role) ? route.role : [route.role]).map(normalize);
    if (!allowedLower.includes(currentRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else if (route.ability) {
    if (normalize(route.ability) !== currentRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // While user info not loaded, don't redirect by status
  if ((route.status || route.visibility) && !userLoaded) {
    return <div className="p-6 text-slate-300">Loading...</div>;
  }

  // Status/visibility checks
  if (route.status) {
    const required = normalize(route.status);
    if (!currentStatus) {
      return <Navigate to="/seller/account-pending" replace />;
    }
    if (currentStatus !== required) {
      return currentStatus === 'pending'
        ? <Navigate to="/seller/account-pending" replace />
        : <Navigate to="/seller/account-decative" replace />;
    }
  } else if (route.visibility) {
    const allowed = (Array.isArray(route.visibility) ? route.visibility : [route.visibility]).map(normalize);
    if (!currentStatus) {
      return <Navigate to="/seller/account-pending" replace />;
    }
    if (!allowed.includes(currentStatus)) {
      return currentStatus === 'pending'
        ? <Navigate to="/seller/account-pending" replace />
        : <Navigate to="/seller/account-decative" replace />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default ProtectRoute;