import Home from './pages/Home'
import Auth from './pages/Auth'
import { Route ,Routes } from 'react-router-dom'
import React from 'react'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
    </Routes>
  )
}

export default App
