import { lazy } from "react";
import RequireAuth from "./RequireAuth";
import AdminRoutes from "./AdminRoutes";
import SellerRoutes from "./SellerRoutes";

const MainLayout = lazy(() => import('../../layout/Mainlayout'));

// সব প্রাইভেট রুট একত্রে
const PrivateRoutes = [...AdminRoutes, ...SellerRoutes];

// '/seller/products' → group: 'seller', child: 'products'
const splitToGroup = (path = "") => {
  const full = path.replace(/^\/+/, ""); // leading slash কাটুন
  const [group, ...rest] = full.split("/");
  return { group, child: rest.join("/") }; // child হতে পারে '' (index)
};

export const getRoutes = () => {
  const groups = {}; // { seller: [], admin: [], ... }

  PrivateRoutes.forEach((r) => {
    const { group, child } = splitToGroup(r.path);
    const role = r.role || r.ability;
    const status = r.status;
    const visibility = r.visibility;

    const wrapped = {
      ...r,
      // child path relative রাখুন
      path: child || undefined,
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

  // group -> children বানান
  const children = Object.entries(groups).map(([group, routes]) => ({
    path: group,  // 'seller' বা 'admin'
    children: routes,
  }));

  // চূড়ান্ত ট্রি: MainLayout parent + সব প্রাইভেট child (nested)
  return {
    path: "/",
    element: <MainLayout />,
    children,
  };
};

export default getRoutes;