import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

const Routers = ({ allRoutes }) => {
  const routes = useRoutes(allRoutes);

  return (
    <Suspense fallback={<div className="p-6 text-center text-lg">Loading...</div>}>
      {routes}
    </Suspense>
  );
};

export default Routers;
