import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { loader, errorMessage, successmessage } = useSelector(state => state.auth); // successmessage (capital M)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(admin_login(formData));
    };   

    // ✅ Success message toast
    useEffect(() => {
        if (successmessage) {
            toast.success(successmessage);
            dispatch(messageClear());
            navigate('/')
        }
    }, [successmessage, dispatch, navigate]);

    // ✅ Error message toast
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, dispatch]);

    return (
        <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
            <div className="w-[400px] text-[#d0d2d6] p-2">
                <div className="bg-[#283046] p-4 rounded-md shadow-lg">
                    <div className="text-center mb-8 relative">
                        {/* Background decorative element */}
                        <div className="absolute inset-0 flex justify-center items-center -z-10">
                            <div className="w-24 h-24 bg-teal-900 opacity-20 rounded-full blur-lg"></div>
                        </div>

                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <img
                                    src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png"
                                    alt="MM Fashion World Logo"
                                    className="w-16 h-16 object-contain rounded-xl border-2 border-teal-500/30 bg-white/10 p-2 shadow-lg"
                                />
                                {/* Logo badge */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            Welcome to MM Fashion World
                        </h2>

                        <p className="text-sm text-gray-300 px-4 leading-relaxed">
                            Please login to your administrator account <br />to manage your fashion business
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Email Input */}
                        <div className="flex flex-col w-full gap-1 mb-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="your email"
                                className="px-3 py-2 outline-none border border-slate-600 bg-transparent focus:border-teal-600 rounded-md overflow-hidden text-[#d0d2d6]"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col w-full gap-1 mb-4">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                className="px-3 py-2 outline-none border border-slate-600 bg-transparent focus:border-teal-600 rounded-md overflow-hidden text-[#d0d2d6]"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Login  Button */}
                        <button
                            disabled={loader ? true : false}
                            type="submit"
                            className={`primaryBtn w-full transition-all duration-200 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {
                                loader ? <PropagateLoader color='white' cssOverride={overrideStyle} size={8} /> : "Admin Login"
                            }
                        </button>

                        {/* Already have an account? */}
                        <div className="flex justify-center items-center mb-4">
                            <p className="text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-teal-400 hover:underline font-medium">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                        {/* OR Separator */}
                        <div className="flex justify-center items-center mb-4">
                            <div className="w-full h-[1px] bg-slate-700"></div>
                            <span className="px-3 text-sm text-slate-400">Or</span>
                            <div className="w-full h-[1px] bg-slate-700"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                className="px-3 py-2 flex justify-center items-center gap-2 w-full border border-slate-700 rounded-md hover:bg-slate-700 text-white transition-all duration-200"
                                onClick={() => alert('Login with Google clicked!')}
                            >
                                {/* Google Icon */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.24 10.27v-2.34h3.6c-.16 1-.72 2.05-1.92 2.8-.93.56-2.07.87-3.28.87a5.2 5.2 0 01-5.2-5.2c0-2.88 2.32-5.2 5.2-5.2 1.44 0 2.76.6 3.6 1.45l1.64-1.63C15.68 1.95 13.9 1 12.24 1 6.64 1 2 5.57 2 11s4.64 10 10.24 10c5.16 0 8.64-3.56 8.64-8.8 0-.84-.09-1.52-.2-2.13h-8.44z" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 flex justify-center items-center gap-2 w-full border border-slate-700 rounded-md hover:bg-slate-700 text-white transition-all duration-200"
                                onClick={() => alert('Login with Facebook clicked!')}
                            >
                                {/* Facebook Icon */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2v-3h2V9.5C10 7.57 11.25 6.5 13.17 6.5c.69 0 1.39.13 2.05.25v2.12h-1.25c-.99 0-1.19.47-1.19 1.17V12h3l-.5 3h-2.5v6.95c5.03-.5 9-4.72 9-9.95z" />
                                </svg>
                                <span>Facebook</span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;