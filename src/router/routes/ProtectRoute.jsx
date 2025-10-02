/* import  { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const ProtectRoute = ({ route, children }) => {
    const { role, userInfo } = useSelector(state => state.auth);


    if (role) {
        if (userInfo) {
            if (route.role) {
                if (userInfo.role === route.role) {
                    if (route.status) {
                        if (route.state === userInfo.status) {
                            return <Suspense fallback={null}>{children}</Suspense>
                        } else {
                            if (userInfo.status === 'pending') {
                                return <Navigate to='/seller/account-pending' replace />
                            } else {
                                return <Navigate to='/seller/account-decative' replace />
                            }
                        }
                    } else {
                        if (route.visibility) {
                            if (route.visibility.some(r => r === userInfo.status)) {
                                return <Suspense fallback={null}>{children}</Suspense>
                            } else {
                                return <Navigate to='/seller/account-pending' replace />
                            }
                        } else {
                            return <Suspense fallback={null}>{children}</Suspense>
                        }
                    }

                } else {
                    return <Navigate to='/unauthorized' replace />
                }
            } else {
                if (route.ability === 'seller') {
                    return <Suspense fallback={null}>{children}</Suspense>
                }
            }
        }
    } else {
        return <Navigate to='/login' replace />
    }

};

export default ProtectRoute; */

import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const normalize = (v) => (v || '').toString().toLowerCase();

const ProtectRoute = ({ route = {}, children }) => {
  const { role: storeRole, userInfo } = useSelector((s) => s.auth || {});

  const currentRole = normalize(userInfo?.role || storeRole);
  const currentStatus = normalize(userInfo?.status || '');

  // 1) not logged in (no role) -> go to login
  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  // 2) role / ability check
  if (route.role) {
    const allowedRoles = Array.isArray(route.role) ? route.role : [route.role];
    const allowedLower = allowedRoles.map((r) => normalize(r));
    if (!allowedLower.includes(currentRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } else if (route.ability) {
    // legacy: route.ability (string) e.g. 'seller'
    if (normalize(route.ability) !== currentRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3) status / visibility check
  // route.status (single required status) OR route.visibility (array allowed statuses)
  if (route.status) {
    // route.status expected string like 'active'
    const required = normalize(route.status);
    if (!currentStatus) {
      // userInfo missing status -> redirect to pending (or you can fetch user info)
      return <Navigate to="/seller/account-pending" replace />;
    }
    if (currentStatus !== required) {
      // redirect logic: pending -> pending page, else -> decative page
      if (currentStatus === 'pending') {
        return <Navigate to="/seller/account-pending" replace />;
      }
      return <Navigate to="/seller/account-decative" replace />;
    }
  } else if (route.visibility) {
    const allowed = (Array.isArray(route.visibility) ? route.visibility : [route.visibility]).map((s) =>
      normalize(s)
    );
    if (!currentStatus) {
      return <Navigate to="/seller/account-pending" replace />;
    }
    if (!allowed.includes(currentStatus)) {
      if (currentStatus === 'pending') {
        return <Navigate to="/seller/account-pending" replace />;
      }
      return <Navigate to="/seller/account-decative" replace />;
    }
  }

  // All checks passed — render children (lazy loaded)
  return <Suspense fallback={null}>{children}</Suspense>;
};

export default ProtectRoute;