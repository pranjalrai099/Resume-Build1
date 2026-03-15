import React from 'react'
import * as api from './api'
import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Dashboard from '@/pages/Dashboard'
import ResumeBuilder from '@/pages/ResumeBuilder'
import Preview from '@/pages/Preview'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useUser } from './context/UserContext';

const App = () => {
  const { user, loading } = useUser();

  if (loading) return null;

  return (
    <>
      <div className="no-print">
        <ToastContainer />
      </div>
      <Routes>
        <Route path='/' element={<Navigate to="/app" replace />} />

        <Route path='/app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>
        <Route path='view/:resumeId' element={<Preview />} />
      </Routes>
    </>
  )
}

export default App