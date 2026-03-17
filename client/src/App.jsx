import React from 'react'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import { Route ,Routes } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'

export const serverURL = "http://localhost:5000"

function App() {

  const dispatch = useDispatch();
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(serverURL + "/api/user/current-user", {withCredentials: true});
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null)); 
      }
    }
  getUser();
  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
    </Routes>
  )
}

export default App