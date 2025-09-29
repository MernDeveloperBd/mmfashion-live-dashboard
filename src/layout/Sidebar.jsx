 import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNavs } from '../navigation/navigation';
import { FiLogOut } from 'react-icons/fi';

const Sidebar = ({shoeSidebar, setShowSidebar}) => {
    const [allNav, setAllNav] = useState([]);
    const location = useLocation();

    useEffect(() => {
        let userRole = 'seller'; 

        if (location.pathname.startsWith('/admin')) {
            userRole = 'admin';
        } else if (location.pathname.startsWith('/seller')) {
            userRole = 'seller';
        }

        const navs = getNavs(userRole);
        setAllNav(navs);
    }, [location.pathname]); 
    console.log(allNav, location.pathname);

    return (
        <div>
            <div onClick={()=>setShowSidebar(false)} className={`fixed duration-200 ${!shoeSidebar ? 'invisible':'visible'} w-screen h-screen bg-[#22292f80] top-10 left-0 z-10`}></div>
            <div className={`w-[260px] fixed bg-[#283046] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] ${shoeSidebar ? 'left-0':'-left-[260px] lg:left-0'}`}>
                <div className="h-[70px] flex justify-center items-center">
                    <Link to='/' className='w-[180px] h-[50px]'>
                        <img
                            src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png"
                            alt="logo"
                            className='w-full h-full object-cover'
                        />
                    </Link>
                </div>

              
                <div className="px-[16px] py-2">
                    {allNav.map((nav) => (
                        <Link
                            key={nav.id}
                            to={nav.path}
                            className="flex items-center gap-3 p-2.5 text-white hover:bg-teal-600 rounded-md mb-2 transition-colors"
                        >
                            <nav.icon className="text-xl" />
                            <span>{nav.title}</span>
                        </Link>
                    ))}
                    <div >
                        <button className="flex items-center gap-3 p-2.5 text-white hover:bg-teal-600 rounded-md mb-2 transition-colors w-full cursor-pointer">
                            <span><FiLogOut/></span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 


