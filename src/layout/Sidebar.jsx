import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getNavs } from '../navigation/navigation';
import { FiLogOut } from 'react-icons/fi';
import { logout } from '../store/Reducers/authReducer';

const Sidebar = ({ shoeSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector(state => state.auth);
  const [allNav, setAllNav] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    const navs = getNavs(role);
    setAllNav(navs);
  }, [role]);

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed inset-0 bg-[#22292f80] transition-opacity duration-200 z-40 ${
          shoeSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
        } lg:hidden`}
        aria-hidden={!shoeSidebar}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-[#283046] shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] z-50 transition-all duration-300
        ${shoeSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Header / Logo */}
        <div className="h-[70px] flex justify-center items-center border-b border-slate-700/50 shrink-0">
          <Link to="/" className="w-[180px] h-[50px]">
            <img
              src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-slate-600/60 scrollbar-track-transparent">
          {allNav.map((nav) => {
            const active = pathname === nav.path;
            return (
              <Link
                key={nav.id}
                to={nav.path}
                className={`mb-1 flex items-center gap-3 px-3 py-2 rounded-md transition-all
                ${active
                    ? 'bg-slate-600 text-white shadow-inner'
                    : 'text-[#d0d2d6] hover:bg-slate-800'
                }`}
                onClick={() => setShowSidebar(false)}
              >
                <nav.icon className="text-xl" />
                <span>{nav.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout (stick to bottom) */}
        <div className="px-4 py-3 border-t border-slate-700/50">
          <button
            onClick={() => dispatch(logout({ navigate, role }))} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors cursor-pointer"
            type="button"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;