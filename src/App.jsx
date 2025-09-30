/* import { useState } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes.jsx";
import { useEffect } from "react";
import { getRoutes } from "./router/routes/index.jsx";

export default function App() {

  const[allRoutes, setAllRoutes] = useState([...publicRoutes])
  console.log("All Routes",allRoutes);
  useEffect(() =>{
    const routes = getRoutes()
    console.log("Routes",routes);
  },[])
  

  return <Routers allRoutes={allRoutes}/>
 
}
 */


import { useState, useEffect } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes/index";

export default function App() {
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

    useEffect(() => {
        const privateRoute = getRoutes();        
        setAllRoutes([...publicRoutes, privateRoute]);
    }, []);

    return <Routers allRoutes={allRoutes} />;
}
