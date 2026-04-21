import React from 'react'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import { Route ,Routes } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'
import InterviewPage from './pages/InterviewPage.jsx'
import InterviewHistory from './pages/InterviewHistory.jsx'
import Pricing from './pages/pricing.jsx'
import InterviewReport from './pages/InterviewReport.jsx'

export const serverURL = import.meta.env.VITE_API_BASE_URL || ""

function App() {

  const dispatch = useDispatch();
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/current-user`, {withCredentials: true});
        dispatch(setUserData(result.data));
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error("Failed to fetch user:", error.message);
        }
        dispatch(setUserData(null)); 
      }
    }
  getUser();
  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/report/:id' element={<InterviewReport />} />
    </Routes>
  )
}

export default App