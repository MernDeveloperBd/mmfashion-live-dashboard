import { useState } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes.jsx";

export default function App() {

  const[allRoutes, setAllRoutes] = useState([...publicRoutes])
  console.log(allRoutes);
  

  return <Routers allRoutes={allRoutes}/>
 
}
