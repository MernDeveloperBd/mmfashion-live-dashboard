/* import { useRoutes } from "react-router-dom";
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
 */
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

const Routers = ({ allRoutes }) => {
    const routes = useRoutes(allRoutes);

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        }>
            {routes}
        </Suspense>
    );
};

export default Routers;