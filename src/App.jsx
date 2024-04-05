import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import Layout from './auth/Layout'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Homepage from './web/pages/Homepage'
import Resourcecenterpage from './web/pages/Resourcecenterpage'
import WebLayout from "./web/Layout"
import BlogDetailspage from './web/pages/BlogDetailspage'
import AdminLayout from "./admin_portal/Layout"
import BlogPage from './admin_portal/pages/BlogPage'

function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path='/auth' element={<Layout />}>
            <Route index element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route>

          <Route path='/' element={<WebLayout />}>
            <Route index element={<Homepage />} />
            <Route path='resource-center' element={<Resourcecenterpage />} />
            <Route path='resource-center/blog/:id' element={<BlogDetailspage />} />
          </Route>

          <Route path='/admin_portal' element={<AdminLayout />}>
            <Route index element={<BlogPage />} />
            <Route path='logout' element={<Logout />} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

function Logout() {
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
        <div className='w-[654px] h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center' style={{ background: "linear-gradient(to right, #00AB9B,#00AB9B)" }}>
          <p className='font-bold text-white text-3xl text-center'>Are you sure you want to logout?</p>
          <div className='w-[540px] h-[70px] flex flex-row gap-6 justify-center'>
            <button onClick={() => { navigate('/admin_portal') }} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>
            <button className='bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white'>Confirm</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
