import React from 'react';
import axios from "axios";
import { motion } from "motion/react"
import { FaRobot } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';

const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

function Auth() {

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user
      let name = User.displayName
      let email = User.email
      
      const result = await axios.post(serverURL + "/api/auth/google",
        {name, email}, 
        {withCredentials: true}
      );
        console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'>
      <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration:1.09}}
      className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200'>
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <FaRobot size={18} />
          </div>
          <h2 className='font-semibold text-lg'>EvalAI</h2>  
        </div>    
        <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>Continue with EvalAI{" "}
          <span className='bg-green-100  text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
            <IoSparkles size={16} />
            AI Smart Interview
          </span>
        </h1>
        <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
          Sign in to your EvalAI account to access your personalized dashboard, AI powered mock interviews, track your progress, and and unlock detailed performance insights. 
        </p>
        <motion.button 
        onClick={handleGoogleAuth}
        whileHover={{ opacity: 0.9, scale: 1.03 }}
        whileTap={{ opacity: 1, scale: 0.98}}
        className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md'>
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Auth;