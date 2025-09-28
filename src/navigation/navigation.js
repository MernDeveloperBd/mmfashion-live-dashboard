import { allNav } from "./allNav";

export const getNavs = (role) => {
  return allNav.filter(nav => nav.role === role);
};