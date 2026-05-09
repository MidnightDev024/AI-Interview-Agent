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

  const handleUploadResume = async () =>
  {
    if(!resumeFile || analysing) return;
      setAnalysing(true)

      const formdata = new FormData()
      formdata.append("resume", resumeFile);
    try{
      const result = await axios.post(serverURL + "/api/interview/resume", formdata , {withCredentials:true})

      console.log(result.data);

      setRole(result.data.role || "");
      setExperience(result.data.experience || "" );
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalysing(false);

    } catch (error) {
      console.log(error);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const message = serverMessage || error?.message || "Resume upload failed";
      alert(status ? `Upload failed (${status}): ${message}` : message);
      setAnalysing(false)
      
    }
  }

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverURL + "/api/interview/generate-questions", 
        {
        role, experience, mode, resumeText, projects, skills,
      }, {withCredentials:true})
      console.log(result.data);
      if(userData) {
        dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
      }
      setLoading(false);

      onStart({...result.data, username: userData?.username || userData?.name || "", gender})

    } catch (error) {
      console.log(error);
      setLoading(false)
      
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
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p 
                  className='text-gray-500 font-medium'>
                  {resumeFile ? resumeFile.name : "Click to upload resume (optional)"}
                  </p>

                  {resumeFile && (
                    <motion.button
                    whileHover={{ scale:1.02 }}
                    onClick={(e) => {e.stopPropagation(); handleUploadResume();}}
                    className='mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition'>
                      {analysing ? "Analysing..." : "Analyse Resume"}

                    </motion.button>
                  )}

                </motion.div>
              )}

              {analysisDone && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4'>
                  <h3
                  className='text-lg font-semibold text-gray-800'>
                    Resume Analysis result
                  </h3>

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
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className='w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md'>
                {loading ? "Starting..." : "Start Interview"}
              </motion.button>
          </div>
        </motion.div>
      </div>
      
    </motion.div>
  )
}

export default Step1SetUp
