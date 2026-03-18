import React from 'react'
import { useSelector } from 'react-redux';
import { motion } from "motion/react"
import { GiRobotGolem } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";
import { BsCoin } from 'react-icons/bs';
import { FaRobot } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaUserAstronaut } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';

function Navbar() {

    const {userData} = useSelector((state) => state.user);

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
                        <button className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>
                    </div>

                    <div className='relative'>
                        <button className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
                            {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={17} />}
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
  )
}

export default Navbar
