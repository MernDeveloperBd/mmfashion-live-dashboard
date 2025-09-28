import { MdCategory } from "react-icons/md";
    import { MdDashboard } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineShoppingCart } from "react-icons/ai";

export const allNav = [
  {
    id: 1,
    title: 'Admin Dashboard',
    icon: MdDashboard,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard'
  },
  {
    id: 2,
    title: 'Orders',
    icon: AiOutlineShoppingCart,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/orders'
  }, 
  {
    id: 3,
    title: 'Category',
    icon: MdCategory,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/category'
  },
   {
    id: 4,
    title: 'Sellers',
    icon: FaUserGroup,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/sellers'
  },
   {
    id: 5,
    title: 'Payment Request',
    icon: TbCurrencyTaka,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/payment-request'
  },
   {
    id: 6,
    title: 'Deactive Sellers',
    icon: FiUsers,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/deactive-sellers'
  },
   {
    id: 7,
    title: 'Sellers Request',
    icon: FaUsersCog,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/sellers-request'
  },
   {
    id: 8,
    title: 'Chat Seller',
    icon: CiChat1,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/chat-seller'
  }
  
];