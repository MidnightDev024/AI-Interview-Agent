import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { delay, motion } from 'framer-motion'
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs"; 
import { HiSparkles } from "react-icons/hi";
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png"
import techImg from "../assets/tech.png"
import confidenceImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import evalImg from "../assets/ai-ans.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import analyticsImg from "../assets/history.png"

function Home() {
  const [showAuth, setShowAuth] = React.useState(false);
  const navigate = useNavigate();
  const {userData} = useSelector((state) => state.user)

  return (
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
      <Navbar />

      <div className='flex-1 px-6 py-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center mb-6'>
            <div className='bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2'>
              <HiSparkles size={16} className='bg-green-50 text-green-600' />
                AI Powered Smart Interview Platform
            </div>
          </div>
          <div className='text-center mb-28'>
              <motion.h1 
              initial = {{ opacity: 0, y: 30 }}
              animate = {{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto'>
                Practice Interview with
                <span className='relative inline-block'>
                  <span className='bg-green-100 text-green-600 px-5 py-1 rounded-full'>
                    AI Smart Interview Coach
                  </span>
                </span>
              </motion.h1>

              <motion.p 
              initial = {{ opacity: 0 }}
              animate = {{ opacity: 1 }}
              transition = {{ duration: 0.8 }}
              className='text-gray-500 mt-6 max-w-2xl mx-auto text-lg'>
                Role-based mock interview with smart follow-ups, adaptive difficulty and real-time performance evaluation.
              </motion.p>
              <div className='flex flex-wrap justify-center gap-4 mt-18'>
                <motion.button
                onClick={() => {
                  if(!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{opacity: 0.9, scale: 1.03}}
                whileTap={{opacity: 1, scale: 0.98}}
                className='bg-black text-white px-18 py-3 rounded-full hover:opacity-90 transition shadow-md'
                >
                  start Interview
                </motion.button>

                <motion.button
                onClick={() => {
                  if(!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{opacity: 0.9, scale: 1.03}}
                whileTap={{opacity: 1, scale: 0.98}}
                className='border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition'
                >
                  View History
                </motion.button>
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'> 
                {
                  [
                    {
                      icon: <BsRobot size={24} />,
                      step: "STEP 1",
                      title: "Role & Experience Selection",
                      desc: "AI adjust difficulty based on selected job role."
                    },
                    {
                      icon: <BsMic size={24} />,
                      step: "STEP 2",
                      title: "Smart Voice Interview",
                      desc: "Natural conversation with AI interviewer, simulating real interview environment."
                    },
                    {
                      icon: <BsClock size={24} />,
                      step: "STEP 3",
                      title: "Timer Based Simulator",
                      desc: "Real interview pressure with time tracking and response time analysis."
                    }
                  ].map((item,index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 + index * 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.2 }}
                    key={index} 
                    className={`
                    relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl
                    transition-all duration-300
                    ${index === 0 ? "rotate-[-4deg]" : ""}
                    ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
                    ${index === 2 ? "rotate-[-3deg]" : ""}
                    `}>
                    
                    <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'>
                      {item.icon}
                    </div>
                    <div className='pt-10 text-center'>
                      <div className='text-xs text-green-600 font-semibold mb-2 tracking-wider'>{item.step}</div>
                      <h3 className='font-semibold mb-3 text-lg'>{item.title}</h3>
                      <p className='text-sm text-gray-500 leading-relaxed'>{item.desc}</p>
                    </div>
                      
                    </motion.div>
                  ))
                }
            </div>
            
            <div className='mb-32'>
                <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='text-4xl font-semibold text-center mb-16'>
                  Advanced AI{" "}
                  <span  className='text-green-600'>Capabilities</span>
                </motion.h2>

                <div className='grid md:grid-cols-2 gap-10'>
                  {
                    [
                      {
                        image: evalImg,
                        icon: <BsBarChart size={20} />,
                        title: "Real-time Performance Evaluation",
                        desc: "Scores communication, technical accuracy and confidence."
                      },
                      {
                        image: resumeImg,
                        icon: <BsFileEarmarkText size={20} />,
                        title: "Resume Based Interview",
                        desc: "Projects-Specific Q&A based on your resume content."
                      },
                      {
                        image: pdfImg,
                        icon: <BsFileEarmarkText size={20} />,
                        title: "Downloadable PDF Report",
                        desc: "Detailed Strengths, weaknesses and improvement suggestions after each interview."
                      },
                      {
                        image: analyticsImg,
                        icon: <BsBarChart size={20} />,
                        title: "Progress Tracking & Analytics",
                        desc: "Track improvement over time with detailed analytics dashboard."
                      }
                    ].map((item,index) => (
                      <motion.div 
                      initial={{ opacity: 0, y: 30}}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      key={index} 
                      className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'>
                        <div className='flex flex-col md:flex-row items-center gap-8'>
                          <div className='w-full md:w-1/2 flex justify-center'>
                            <img 
                            src={item.image} 
                            alt={item.title}
                            className='w-full h-auto object-contain max-h-64' />
                          </div>
                          <div className='w-full md:w-1/2'>
                          <div className='bg-green-50 text-green-600 w-12 h-1 rounded-xl flex items-center justify-center mb-6'>
                            {item.icon}
                          </div>
                          <h3 className='font-semibold mb-3 text-xl'>{item.title}</h3>
                          <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
            </div>

            <div className='mb-32'>
                <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='text-4xl font-semibold text-center mb-16'>
                  Multiple interview{" "}
                  <span  className='text-green-600'>Modes</span>
                </motion.h2>

                <div className='grid md:grid-cols-2 gap-10'>
                  {
                    [
                      {
                        img: hrImg,
                        title: "HR Interview Mode",
                        desc: "Focus on behavioral questions, cultural fit and communication skills."
                      },
                      {
                        img: techImg,
                        title: "Technical Interview Mode",
                        desc: "Deep technical questions based on selected role."
                      },
                      {
                        img: confidenceImg,
                        title: "Confidence Building Mode",
                        desc: "Encouraging feedback and positive reinforcement to boost confidence."
                      },
                      {
                        img: creditImg,
                        title: "Credit System",
                        desc: "unlock Premium interview session"
                      }
                    ].map((mode,index) => (
                      <motion.div 
                      initial={{ opacity: 0, y: 30}}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -6 }}
                      key={index} 
                      className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all'>
                        <div className='flex items-center justify-between gap-6'>
                          <div className='w-1/2'>
                            <h3 className='font-semibold text-xl mb-3'>
                              {mode.title}
                            </h3>

                            <p className='text-gray-500 text-sm leading-relaxed'>
                              {mode.desc}
                            </p>
                          </div>

                          {/* RIGHT IMAGE */}
                          <div className='w-1/2 flex justify-end '>
                            <img 
                            src={mode.img} 
                            alt={mode.title}
                            className='w-28 h-28 object-contain' />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  }
                </div>
            </div>
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      <Footer />

    </div>
  )
}

export default Home
