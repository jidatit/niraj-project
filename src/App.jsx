import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './auth/Layout'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Homepage from './web/pages/Homepage'
import Resourcecenterpage from './web/pages/Resourcecenterpage'
import WebLayout from "./web/Layout"

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
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
