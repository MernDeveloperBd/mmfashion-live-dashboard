// src/router/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireAuth({ role, status, visibility, children }) {
  const location = useLocation();

  // আপনার slice অনুযায়ী সিলেক্ট করুন
  const { token, userInfo, userLoaded } = useSelector((s) => s.auth);

  const loading = !!token && !userLoaded;         // টোকেন থাকলে এবং userLoaded false হলে এখনো লোড হচ্ছে
  const isLoggedIn = !!token;                     // টোকেন থাকলেই লগইন ধরছি
  const userRole = userInfo?.role || "";          // 'seller' | 'admin' | 'user'
  const sellerStatus = userInfo?.status || "active"; // 'active' | 'deactive' | 'pending'

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Loading…</span>
      </div>
    );
  }

  // লগইন দরকার কিন্তু লগইন নাই
  if (role && !isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // রোল mismatch
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // exact status দরকার
  if (status && sellerStatus !== status) {
    if (sellerStatus === "pending") return <Navigate to="/seller/account-pending" replace />;
    if (sellerStatus === "deactive") return <Navigate to="/seller/account-decative" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  // visibility allow-list
  if (visibility && Array.isArray(visibility) && !visibility.includes(sellerStatus)) {
    if (sellerStatus === "pending") return <Navigate to="/seller/account-pending" replace />;
    if (sellerStatus === "deactive") return <Navigate to="/seller/account-decative" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}