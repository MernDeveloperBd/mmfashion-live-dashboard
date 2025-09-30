import { MdCategory , MdDashboard} from "react-icons/md";
import { FaUserGroup, FaPlus } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { CiChat1, CiDiscount1 } from "react-icons/ci";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiProductHuntLine, RiProfileLine } from "react-icons/ri";
import { IoChatbubbleOutline } from "react-icons/io5";


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
    icon: IoChatbubbleOutline,
    role: 'admin', // ✅ ছোট হাতের
    path: '/admin/dashboard/chat-seller'
  },
   {
    id: 9,
    title: 'Seller Dashboard',
    icon: MdDashboard,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/dashboard'
  },
   {
    id: 10,
    title: 'Add Product',
    icon: FaPlus,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/add-product'
  },
   {
    id: 11,
    title: 'All Product',
    icon: RiProductHuntLine,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/products'
  },
   {
    id: 12,
    title: 'Discount Product',
    icon: CiDiscount1,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/discount-product'
  },
   {
    id: 13,
    title: 'Orders',
    icon: AiOutlineShoppingCart,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/orders'
  },
  
   {
    id: 14,
    title: 'Payment',
    icon: TbCurrencyTaka,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/payment'
  },
  {
    id: 15,
    title: 'Chat Customer',
    icon: IoChatbubbleOutline,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/dashboard/chat-customer'
  },
  {
    id: 16,
    title: 'Chat Support',
    icon: CiChat1,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/dashboard/chat-support'
  },
  {
    id: 17,
    title: 'Profile',
    icon: RiProfileLine,
    role: 'seller', // ✅ ছোট হাতের
    path: '/seller/dashboard/profile'
  },
  
];