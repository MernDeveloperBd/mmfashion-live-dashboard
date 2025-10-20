// src/router/routes/index.js
import { lazy } from "react";
import RequireAuth from "../RequireAuth";
import AdminRoutes from "./AdminRoutes";
import SellerRoutes from "./SellerRoutes";

const MainLayout = lazy(() => import('../../layout/Mainlayout'));

// 1) সব প্রাইভেট রুট একসাথে
const PrivateRoutes = [...AdminRoutes, ...SellerRoutes];

// 2) path normalize: children-এ absolute path থাকলে relative বানাই
const toRelativePath = (p = "") => p.replace(/^\/+/, "");

// 3) RequireAuth wrap + path normalize
const guardedChildren = PrivateRoutes.map((r) => {
  const role = r.role || r.ability; // ability থাকলে role হিসেবে নিন
  const status = r.status;
  const visibility = r.visibility;

  return {
    ...r,
    path: toRelativePath(r.path),
    element: (
      <RequireAuth role={role} status={status} visibility={visibility}>
        {r.element}
      </RequireAuth>
    ),
  };
});

// 4) Layout parent + guarded children export
export const getRoutes = () => {
  return {
    path: "/",
    element: <MainLayout />,
    children: guardedChildren,
  };
};

export default getRoutes;