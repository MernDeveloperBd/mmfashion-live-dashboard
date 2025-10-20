// src/router/routes/index.js
import { lazy } from "react";
import RequireAuth from "../RequireAuth";
import AdminRoutes from "./AdminRoutes";
import SellerRoutes from "./SellerRoutes";

const MainLayout = lazy(() => import('../../layout/Mainlayout'));

// '/seller/products' → group='seller', child='products'
const splitToGroup = (path = "") => {
  const full = path.replace(/^\/+/, ""); // leading slash কাটুন
  const [group, ...rest] = full.split("/");
  return { group, child: rest.join("/") }; // child '' হলে index route
};

export const getRoutes = () => {
  const groups = {}; // { seller: [], admin: [] }

  [...AdminRoutes, ...SellerRoutes].forEach((r) => {
    const { group, child } = splitToGroup(r.path);
    const role = r.role || r.ability;
    const status = r.status;
    const visibility = r.visibility;

    const wrapped = {
      ...r,
      path: child || undefined,              // relative child path
      index: !child || child.length === 0 ? true : undefined,
      element: (
        <RequireAuth role={role} status={status} visibility={visibility}>
          {r.element}
        </RequireAuth>
      ),
    };

    if (!groups[group]) groups[group] = [];
    groups[group].push(wrapped);
  });

  const children = Object.entries(groups).map(([group, routes]) => ({
    path: group,  // 'seller' বা 'admin'
    children: routes,
  }));

  return {
    path: "/",
    element: <MainLayout />,
    children, // এখন /seller/... এবং /admin/... সব এখানে nested
  };
};

export default getRoutes;