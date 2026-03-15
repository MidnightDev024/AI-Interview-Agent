import React from 'react'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { Route ,Routes } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

export const serverURL = "http://localhost:5000"

function App() {
  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(serverURL + "/api/user/current-user", {withCredentials: true});
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    }
  getUser();
  },[])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
    </Routes>
  )
}

export default App