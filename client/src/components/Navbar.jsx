import React, { use } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "motion/react"
import { GiRobotGolem } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";
import { BsCoin } from 'react-icons/bs';
import { FaRobot } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaUserAstronaut } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../App.jsx';
import { set } from 'mongoose';
import { setUserData } from '../redux/userSlice';

function Navbar() {

    const {userData} = useSelector((state) => state.user);

    const [creditPopup, setCreditPopup] = React.useState(false);
    const [userPopup, setUserPopup] = React.useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleClickLogout = async () => {
        try {
            await axios.get(serverURL + "/api/auth/logout",
                {withCredentials: true}
            );
            dispatch(setUserData(null));
            setCreditPopup(false);
            setUserPopup(false);
            navigate("/")
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6'>
            <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{duration: 0.5}}
            className='w-full max-w-6px bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative'>
                <div className='flex gap-3 cursor-pointer'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={20} />
                    </div>
                    <h1 className='font-semibold hidden md:Block text-lg'>EvalAI</h1>
                </div>

                <div className='flex items-center gap-6 relative'>
                    <div className='relative'>
                        <button 
                        onClick={() => {setCreditPopup(!creditPopup);
                            setUserPopup(false);
                        }}
                        className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>
                        {creditPopup && (
                            <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>
                                <p className='text-sm text-gray-600 mb-4'>Need more credits? <br /> Upgrade your plan at any time.</p>
                                <button
                                onClick={() => navigate("/upgrade")}
                                className='w-full bg-black text-white py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-800 transition'>
                                    Upgrade Now
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='relative'>
                        <button 
                        onClick={() => {setUserPopup(!userPopup);
                            setCreditPopup(false);
                        }}
                        className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
                            {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={17} />}
                        </button>
                        {userPopup && (
                            <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50'>
                                <p className='text-md text-blue-500 font-medium mb-1'>
                                    {userData?.name}
                                </p>
                                <button 
                                onClick={() => navigate("/history")}
                                className='w-full text-left text-sm py-2 hover-text-black text-gray-600'>
                                    Interview History
                                </button>
                                <button 
                                onClick={handleClickLogout}
                                className='w-full text-left text-sm py-2 flex items-center gap-2 text-red-500'>
                                    <HiOutlineLogout size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </motion.div>
        </div>
  )
}

export default Navbar
