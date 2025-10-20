// src/router/routes/index.js
import { lazy } from "react";
import RequireAuth from "./RequireAuth";
const MainLayout = lazy(() => import('../../layout/Mainlayout'));
import PrivateRoutes from './PrivateRoutes'; // এখানে PrivateRoutes-এ seller + admin routes merge করা থাকবে

export const getRoutes = () => {
  // প্রতিটি প্রাইভেট রুটকে guard দিয়ে wrap
  const guarded = PrivateRoutes.map((r) => {
    const role = r.role || r.ability; // ability থাকলে সেটাই role হিসেবে নিন
    const status = r.status;
    const visibility = r.visibility;
    return {
      ...r,
      element: (
        <RequireAuth role={role} status={status} visibility={visibility}>
          {r.element}
        </RequireAuth>
      )
    };
  });

  // MainLayout parent route + সব private children
  return {
    path: '/',
    element: <MainLayout />,
    children: guarded
  };
};