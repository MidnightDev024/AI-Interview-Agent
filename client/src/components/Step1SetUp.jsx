import React from 'react'
import { motion } from "motion/react"
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine
} from 'react-icons/fa';
import axios from 'axios';
import { serverURL } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

const Step1SetUp = ({onStart}) => {

  const  {userData}  = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [role, setRole] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [mode, setMode] = React.useState("Technical");
  const [gender, setGender] = React.useState("male");
  const [resumeFile, setResumeFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [resumeText, setResumeText] = React.useState("");
  const [analysisDone, setAnalysisDone] = React.useState(false);
  const [analysing, setAnalysing] = React.useState(false);
  const [analysisError, setAnalysisError] = React.useState("");
  const [analysisWarning, setAnalysisWarning] = React.useState("");
  const [startError, setStartError] = React.useState("");
  const [showAuth, setShowAuth] = React.useState(false);
  const uploadControllerRef = React.useRef(null);
  const startControllerRef = React.useRef(null);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
      uploadControllerRef.current?.abort();
      startControllerRef.current?.abort();
    };
  }, []);

  const handleUploadResume = async () =>
  {
    if (!userData) {
      setShowAuth(true);
      setAnalysisError("Please sign in to analyze your resume.");
      return;
    }

    if(!resumeFile || analysing) return;
      setAnalysing(true)
      setAnalysisError("");
      setAnalysisWarning("");
      uploadControllerRef.current?.abort();
      const controller = new AbortController();
      uploadControllerRef.current = controller;

      const formdata = new FormData()
      formdata.append("resume", resumeFile);
    try{
      const result = await axios.post(serverURL + "/api/interview/resume", formdata , {
        withCredentials: true,
        timeout: 45000,
        signal: controller.signal,
      })

      console.log(result.data);

      if (!isMountedRef.current) return;

      if (result.data.role && result.data.role !== "Not specified") {
        setRole(result.data.role);
      }
      if (result.data.experience && result.data.experience !== "Not specified") {
        setExperience(result.data.experience);
      }
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisWarning(result.data.analysisWarning || "");
      setAnalysisDone(true);
      setStartError("");

    } catch (error) {
      console.log(error);
      if (!isMountedRef.current || error?.code === "ERR_CANCELED") return;
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const message = error?.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : error?.message === "Network Error"
          ? "Network error while uploading resume. Please check your internet connection and try again."
          : status === 401
            ? "Please sign in to upload and analyze your resume."
            : (serverMessage || error?.message || "Resume upload failed");

      if (status === 401) {
        setShowAuth(true);
      }

      setAnalysisError(status ? `Upload failed (${status}): ${message}` : message);
      } finally {
      if (isMountedRef.current) {
        setAnalysing(false);
      }
      uploadControllerRef.current = null;
    }
  }

  const handleStart = async () => {
    if (!userData) {
      setShowAuth(true);
      setStartError("Please sign in to start an interview.");
      return;
    }

    const trimmedRole = role.trim();
    const trimmedExperience = experience.trim();
    if (!trimmedRole || !trimmedExperience) {
      setStartError("Please enter both role and experience before starting.");
      return;
    }

    if (analysing) {
      setStartError("Resume analysis is still running. Please wait for it to complete.");
      return;
    }

    setStartError("");
    setLoading(true);
    startControllerRef.current?.abort();
    const controller = new AbortController();
    startControllerRef.current = controller;
    try {
      const result = await axios.post(serverURL + "/api/interview/generate-questions", 
        {
        role: trimmedRole, experience: trimmedExperience, mode, resumeText, projects, skills,
      }, {withCredentials:true, signal: controller.signal})
      console.log(result.data);
      if (!isMountedRef.current) return;
      if(userData) {
        dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
      }

      onStart({...result.data, username: userData?.username || userData?.name || "", gender})

    } catch (error) {
      console.log(error);
      if (!isMountedRef.current || error?.code === "ERR_CANCELED") return;
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const message = status === 401
        ? "Please sign in to start your interview."
        : serverMessage || error?.message || "Failed to start interview. Please try again.";

      if (status === 401) {
        setShowAuth(true);
      }

      setStartError(message);
      
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
      startControllerRef.current = null;
    } 
  }

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>
        {/* Left side */}
        <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className='relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center'>

          <h2 className='text-4xl font-bold text-gray-800 mb-6'>
            Start Your AI Interview
          </h2>

          <p className='text-gray-600 mb-10'>
            Practice real interviewScenarios powered by AI.
            Improve Communication, technical skills, and confidence.
          </p>

          <div className='space-y-5'>
            {
              [
                {
                  icon: <FaUserTie 
                  className='text-green-600 text-xl' />,
                  text: "Choose Role & Experience"
                },
                {
                  icon: <FaMicrophoneAlt
                  className='text-green-600 text-xl' />,
                  text: "Smart Voice Interview"
                },
                {
                  icon: <FaChartLine
                  className='text-green-600 text-xl' />,
                  text: "Performance Analytics"
                }
              ].map((item,index) => (
                <motion.div 
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer'>
                  {item.icon}
                  <span className='text-gray-700 font-medium'>{item.text}</span>
                </motion.div>
              ))
            }
          </div>

        </motion.div>

        {/* Right side */}
        <motion.div 
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className='p-12 bg-white'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8'>
            Interview SetUp
          </h2>

          <div className='space-y-6'>
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-gray-400' />
              <input 
              type="text" 
              placeholder='Enter role' 
              className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition' 
              onChange={(e) => setRole(e.target.value)} 
              value={role} />
            </div>

            <div className='relative'>
              <FaBriefcase className='absolute top-4 left-4 text-gray-400' />
              <input 
              type="text" 
              placeholder='Experience (e.g. 2 years)' 
              className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition' 
              onChange={(e) => setExperience(e.target.value)} 
              value={experience} />

            </div>

            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className='w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition'>

              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
              <option value="Managerial">Managerial Interview</option>

              </select>

              {!analysisDone && (
                <motion.div 
                whileHover={{scale: 1.02}}
                onClick={() => document.getElementById("resume-upload").click()}
                className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition'> 
                  <FaFileUpload 
                  className='text-4xl mx-auto text-green-600 mb-3' />

                  <input 
                  accept='application/pdf'
                  type="file" 
                  id="resume-upload" 
                  className='hidden'
                  onChange={(e) => {
                    setResumeFile(e.target.files[0] || null);
                    setAnalysisDone(false);
                    setAnalysisError("");
                    setAnalysisWarning("");
                  }}
                  />
                  <p 
                  className='text-gray-500 font-medium'>
                  {resumeFile ? resumeFile.name : "Click to upload resume (optional)"}
                  </p>

                  {resumeFile && (
                    <motion.button
                    whileHover={{ scale:1.02 }}
                    onClick={(e) => {e.stopPropagation(); handleUploadResume();}}
                    disabled={analysing}
                    className='mt-4 disabled:opacity-60 disabled:cursor-not-allowed bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition'>
                      {analysing ? "Analysing..." : "Analyse Resume"}

                    </motion.button>
                  )}

                </motion.div>
              )}

              {analysisError && (
                <p className='text-sm text-red-600 -mt-2'>{analysisError}</p>
              )}

              {analysisWarning && (
                <p className='text-sm text-amber-600 -mt-2'>{analysisWarning}</p>
              )}

              {analysisDone && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <h3
                    className='text-lg font-semibold text-gray-800'>
                      Resume Analysis result
                    </h3>
                    <button
                    type="button"
                    onClick={() => {
                      setAnalysisDone(false);
                      setResumeFile(null);
                      setProjects([]);
                      setSkills([]);
                      setResumeText("");
                      setAnalysisError("");
                      setAnalysisWarning("");
                    }}
                    className='text-sm text-green-700 hover:text-green-800 font-medium'>
                      Re-upload
                    </button>
                  </div>

                  {projects.length >0 &&(
                    <div>
                    <p className='font-medium text-gray-700 mb-1'>Projects:</p>
                    <ul className='list-disc list-inside text-gray-600 space-y-1'>
                      {projects.map((project,index) => (
                        <li key={index}>{project}</li>
                      ))}
                    </ul>
                    </div>
                  )}

                  {skills.length >0 &&(
                    <div>
                    <p className='font-medium text-gray-700 mb-1'>Skills:</p>
                    <div className='flex flex-wrap gap-2'>
                      {skills.map((skill,index) => (
                        <span key={index} className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm'>{skill}</span>
                      ))}
                    </div>
                    </div>
                  )}

                </motion.div>
              )}

              <motion.button 
              onClick={handleStart}
              disabled={!role.trim() || !experience.trim() || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className='w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md'>
                {loading ? "Starting..." : "Start Interview"}
              </motion.button>
              {startError && (
                <p className='text-sm text-red-600 -mt-2'>{startError}</p>
              )}
          </div>
        </motion.div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      
    </motion.div>
  )
}

export default Step1SetUp
