import { Lock, Mail, User2Icon, X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import * as api from '../../api'

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let data;
      if (mode === "login") {
        const response = await api.login({ email: formData.email, password: formData.password });
        data = response.data;
        toast.success("Logged in successfully!");
      } else {
        const response = await api.register(formData);
        data = response.data;
        toast.success("Registered successfully!");
      }

      localStorage.setItem('resume_token', data.token);
      localStorage.setItem('resume_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        isPremium: data.isPremium
      }));

      onClose();
      // Reload to refresh all components that depend on auth state
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4'>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden relative p-8">
        <button 
          onClick={onClose} 
          className='absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all'
        >
          <X className='size-5' />
        </button>

        <h1 className="text-gray-900 text-3xl mt-4 font-medium text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-500 text-sm mt-2 text-center">
          Please {mode === "login" ? "login" : "sign up"} to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode !== "login" && (
            <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-xl overflow-hidden pl-4 gap-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
              <User2Icon size={16} className='text-slate-400' />
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                className="bg-transparent border-none outline-none ring-0 w-full text-slate-700" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-xl overflow-hidden pl-4 gap-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
            <Mail size={16} className='text-slate-400' />
            <input 
              type="email" 
              name="email" 
              placeholder="Email address" 
              className="bg-transparent border-none outline-none ring-0 w-full text-slate-700" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-12 rounded-xl overflow-hidden pl-4 gap-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
            <Lock size={16} className='text-slate-400' />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="bg-transparent border-none outline-none ring-0 w-full text-slate-700" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-12 rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-all font-semibold shadow-lg shadow-purple-500/20 mt-4 active:scale-[0.98]"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-slate-500 text-sm mt-6 text-center">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"} 
          <button 
            onClick={() => setMode(prev => prev === "login" ? "register" : "login")} 
            className="text-purple-600 hover:underline font-semibold ml-1"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal
