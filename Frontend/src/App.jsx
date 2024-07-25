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
import UserLayout from "./user_portal/Layout"
import BlogPage from './admin_portal/pages/BlogPage'
import { useAuth } from './AuthContext'
import NotFound from './web/pages/NotFound'
import SignupReferral from './auth/SignupReferral'
import LoginReferral from './auth/LoginReferral'
import RequestPage from "./user_portal/pages/RequestPage"
import AdminLogin from './auth/AdminLogin'
import QuotesPage from './admin_portal/pages/QuotesPage'
import AgentPage from './admin_portal/pages/AgentPage'
import EditorPage from './admin_portal/pages/EditorPage'
import ViewPolicyQuote from './user_portal/pages/ViewPolicyQuote'
import PolicyQuoteProgess from './user_portal/pages/PolicyQuoteProgess'
import PolicyQuoteResults from './user_portal/pages/PolicyQuoteResults'
import PolicyChanges from './admin_portal/pages/PolicyChanges'
import ReferFriend from './user_portal/pages/ReferFriend'
import UploadInspections from './user_portal/pages/UploadInspections'
import ScrollToHashElement from './ScrollToSection'

function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path='/auth' element={<Layout />}>
            <Route index element={<Login />} />
            <Route path='login_referral' element={<LoginReferral />} />
            <Route path='signup_client' element={<Signup />} />
            <Route path='signup_referral' element={<SignupReferral />} />
            <Route path='admin' element={<AdminLogin />} />
          </Route>

          <Route path='/' element={<WebLayout />}>
            <Route index element={<Homepage />} />
            <Route path='resource-center' element={<Resourcecenterpage />} />
            <Route path='resource-center/blog/:id' element={<BlogDetailspage />} />
          </Route>

          <Route path='/admin_portal' element={<AdminLayout />}>
            <Route index element={<QuotesPage />} />
            <Route path='blogs' element={<BlogPage />} />
            <Route path='policy_changes' element={<PolicyChanges />} />
            <Route path='agents' element={<AgentPage />} />
            <Route path='editor' element={<EditorPage />} />
            <Route path='logout' element={<Logout />} />
          </Route>

          <Route path='/user_portal' element={<UserLayout />}>
            <Route index element={<RequestPage />} />
            <Route path='view_policy_quote' element={<ViewPolicyQuote />} />
            <Route path='refer_friend' element={<ReferFriend />} />
            <Route path='pq_progress' element={<PolicyQuoteProgess />} />
            <Route path='pq_results' element={<PolicyQuoteResults />} />
            <Route path='upload_inspections' element={<UploadInspections />} />
            <Route path='logout' element={<Logout />} />
          </Route>

          <Route path='*' element={<NotFound />} />

        </Routes>
        <ScrollToHashElement />
      </Router>
    </>
  )
}

function Logout() {
  const { logout, signupType } = useAuth()
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
        <div className='w-[654px] h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center bg-white'>
          <p className='font-bold text-black text-3xl text-center'>Are you sure you want to logout?</p>
          <div className='w-[540px] h-[70px] flex flex-row gap-6 justify-center'>
            {signupType === "admin" ? (<button onClick={() => { navigate('/admin_portal') }} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>)
              : (<button onClick={() => { navigate('/user_portal') }} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>)}
            <button onClick={logout} className='bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white'>Confirm</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
