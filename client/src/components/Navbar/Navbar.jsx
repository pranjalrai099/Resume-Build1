import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Crown } from 'lucide-react'
import { toast } from 'react-toastify'
import AuthModal from '../AuthModal'
import * as api from '../../api'

import { useUser } from '../../context/UserContext'

const Navbar = () => {
    const { user, logout, refreshUser } = useUser();
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })

    const handleUpgrade = async () => {
      try {
        await api.upgradeToPremium();
        await refreshUser();
        toast.success('Successfully upgraded to Premium!');
        setShowUpgrade(false);
      } catch (err) {
        toast.error('Failed to upgrade to premium');
      }
    }

    const handleLogout = () => {
      logout();
    }

  return (
    <div className='shadow bg-white'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
            <Link to='/app'>
            <img src='/logo.svg' alt='logo' className='h-11 w-auto'/>
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                {!user?.isPremium && user && (
                  <button onClick={() => setShowUpgrade(true)} className='flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1.5 rounded-full hover:from-amber-500 hover:to-amber-600 active:scale-95 transition-all font-semibold shadow-sm shadow-amber-200'>
                      <Crown className='size-3.5' />
                      Premium
                  </button>
                )}
                {user ? (
                  <>
                    <p className='max-sm:hidden'>Hi, {user.name}</p>
                    <button onClick={handleLogout} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setAuthModal({ isOpen: true, mode: 'login' })} className='text-slate-600 hover:text-slate-900 font-medium'>Login</button>
                    <button onClick={() => setAuthModal({ isOpen: true, mode: 'register' })} className='bg-purple-600 text-white px-6 py-1.5 rounded-full hover:bg-purple-700 active:scale-95 transition-all shadow-sm shadow-purple-200'>Sign up</button>
                  </>
                )}
            </div>
        </nav>

        {showUpgrade && (
          <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative p-8'>
              <div className='bg-amber-100 size-16 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Crown className='size-8 text-amber-600' />
              </div>
              <h2 className='text-2xl font-bold text-slate-800 text-center mb-2'>Upgrade to Premium</h2>
              <p className='text-slate-500 text-sm text-center mb-8'>
                Unlock exclusive premium templates and advanced features to make your resume stand out from the crowd.
              </p>
              <div className='space-y-3'>
                <button onClick={handleUpgrade} className='w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-bold text-sm shadow-lg shadow-amber-500/20'>
                  Upgrade Now - $9.99
                </button>
                <button onClick={() => setShowUpgrade(false)} className='w-full py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm'>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
          initialMode={authModal.mode} 
        />
    </div>
  )
}

export default Navbar

