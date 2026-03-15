import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const Layout = () => {
  return (
    <div>
      <div className='min-h-screen bg-gray-50'>
        <div className="no-print">
          <Navbar />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout