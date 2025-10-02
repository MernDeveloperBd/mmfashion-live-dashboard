import  { useEffect, useState } from 'react'; 
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import{useSelector, useDispatch} from 'react-redux'
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { messageClear, seller_register } from '../../store/Reducers/authReducer';

const Register = () => {
    const{loader, successmessage, errorMessage} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agreeToTerms: false,
    });
 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register Form Submitted:', formData);
        dispatch(seller_register(formData))
    };

    useEffect(() =>{
        if(successmessage){
             toast.success(successmessage);
             dispatch(messageClear())
             navigate('/')
        }
        if(errorMessage){
             toast.error(errorMessage);
             dispatch(messageClear())
        }
    },[successmessage, errorMessage,navigate, dispatch])

    return (
        <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
            <div className="w-[400px] text-[#d0d2d6] p-2">
                <div className="bg-[#283046] p-4 rounded-md shadow-lg"> {/* P-2 থেকে P-4 এবং rounded-md, shadow-lg যোগ করা হয়েছে */}
                    <h2 className="text-xl mb-3 font-semibold text-center">Welcome to MM Fashion World</h2>
                    <p className="text-sm mb-4 text-center">Please register to your account and start your business</p> 

                    <form onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="flex flex-col w-full gap-1 mb-4"> {/* mb-32 থেকে mb-4 করা হয়েছে */}
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="your name"
                                className="px-3 py-2 outline-none border border-slate-600 bg-transparent focus:border-teal-600 rounded-md overflow-hidden text-[#d0d2d6]"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col w-full gap-1 mb-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email" // Changed to type="email"
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
                                type="password" // Changed to type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                className="px-3 py-2 outline-none border border-slate-600 bg-transparent focus:border-teal-600 rounded-md overflow-hidden text-[#d0d2d6]"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Privacy Policy Checkbox */}
                        <div className="flex w-full gap-3 mb-4 items-center">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                id="agreeToTerms"
                                className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 checked:bg-teal-600 accent-teal-600" // Tailwind for checkbox styling
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="agreeToTerms" className="text-sm">
                                I agree to <a href="#" className="text-teal-400 hover:underline">privacy policy</a> and{' '}
                                <a href="#" className="text-teal-400 hover:underline">terms & conditions</a>
                            </label>
                        </div>

                        {/* Sign Up Button */}
                         <button
                            disabled={loader}
                            type="submit"
                            className={`primaryBtn w-full transition-all duration-200 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {
                                loader ? <PropagateLoader color='white' cssOverride={overrideStyle} size={8} /> : "Sign Up"
                            }
                        </button>

                        {/* Already have an account? */}
                        <div className="flex justify-center items-center mb-4">
                            <p className="text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-teal-400 hover:underline font-medium">
                                    Login here
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
                                type="button" // Important: type="button" for non-submit buttons
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

export default Register;