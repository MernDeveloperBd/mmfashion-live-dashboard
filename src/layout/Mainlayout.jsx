 import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import Header from './Header'
const MainLayout = () => {
    const [shoeSidebar, setShowSidebar] = useState(false)

    return (
        <div className=' w-full min-h-screen'>            
            <Header shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
            <Sidebar shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
            <main className="lg:ml-[260px] pt-[95px] transition-all min-h-screen ">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout; 

