import { CrownIcon, FilePenLineIcon, LayoutTemplate, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as api from '../../api'
import ConfirmModal from '../../components/ConfirmModal'
import AuthModal from '../../components/AuthModal'
import { TEMPLATE_OPTIONS, COLORS } from './constants'

import { useUser } from '../../context/UserContext'

const Dashboard = () => {
  const { user, refreshUser } = useUser();
  const isUpgraded = user?.isPremium || false;
  const [userResumes, setUserResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, resumeId: null })
  const [title, setTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const navigate = useNavigate()

  const handleTemplateClick = (template) => {
    if (!user) {
      toast.info("Please login to use templates");
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    if (template.isPremium && !user?.isPremium) {
      setSelectedTemplate(template)
      setShowUpgradeModal(true)
    } else {
      setSelectedTemplate(template)
      setTitle('My Resume')
      setShowCreateResume(true)
    }
  }

  const handleUpgrade = async () => {
    try {
      await api.upgradeToPremium();
      await refreshUser();
      toast.success('Successfully upgraded to Premium!');
      setShowUpgradeModal(false);
      setTitle('My Resume');
      setShowCreateResume(true);
    } catch (err) {
      toast.error('Failed to upgrade to premium');
    }
  }

  const loadAllResumes = async () => {
    try {
      const { data } = await api.getResumes()
      setUserResumes(data)
    } catch (err) {
      toast.error('Failed to load resumes')
    }
  }

  const createResume = async (event) => {
    event.preventDefault()
    if (!selectedTemplate) return toast.error('Please select a template')

    // Check if resume name already exists
    const isDuplicate = userResumes.some(resume => resume.title.toLowerCase() === title.trim().toLowerCase());
    if (isDuplicate) {
      return toast.error('A resume with this title already exists. Please choose a different name.');
    }

    try {
      const sampleData = {
        personal_info: {
          full_name: "Alex Smith",
          email: "alex@example.com",
          phone: "0 123456789",
          location: "NY, USA",
          linkedin: "https://www.linkedin.com",
          website: "https://www.example.com",
          profession: "Full Stack Developer",
        },
        professional_summary: "Highly analytical Full Stack Developer with 6 years of experience building robust web applications using React, Node.js, and modern cloud technologies. Passionate about clean code and scalable architecture.",
        skills: ["JavaScript", "React JS", "Node.js", "Express", "MongoDB", "Git", "TypeScript", "Next.js", "REST APIs"],
        experience: [
          {
            company: "Example Technologies",
            position: "Senior Full Stack Developer",
            start_date: "2022-04",
            end_date: "Present",
            description: "Architected and deployed innovative full-stack applications, creating robust back-end systems and intuitive front-end interfaces to deliver meaningful digital experiences.",
            is_current: true
          },
          {
            company: "StartUp Labs",
            position: "Full Stack Developer",
            start_date: "2019-06",
            end_date: "2022-03",
            description: "Engineered and deployed scalable web applications, translating complex requirements into efficient front-end interfaces and back-end services.",
            is_current: false
          }
        ],
        education: [
          {
            institution: "Example Institute of Technology",
            degree: "B.Tech",
            field: "Computer Science",
            graduation_date: "2019-05",
            gpa: "8.7"
          }
        ],
        projects: [
          {
            name: "Team Task Management System",
            type: "Web Application",
            description: "A collaborative task management system for teams to create, assign, track, and manage tasks in real time."
          },
          {
            name: "EduHub - Online Learning Platform",
            type: "EdTech Platform",
            description: "An online learning platform where instructors can create courses with video lessons, quizzes, and downloadable resources."
          }
        ],
        accent_color: "#14B8A6",
        public: false
      }

      const newResumeData = {
        ...sampleData,
        title: title,
        template: selectedTemplate.id,
      }

      const { data } = await api.createResume(newResumeData)
      toast.success('Resume created successfully')
      setShowCreateResume(false)
      setTitle('')
      setSelectedTemplate(null)
      navigate(`/app/builder/${data._id}`)
    } catch (err) {
      toast.error('Failed to create resume')
    }
  }

  const handleConfirmDelete = async () => {
    const resumeId = deleteModal.resumeId
    try {
      await api.deleteResume(resumeId)
      setUserResumes(prev => prev.filter(resume => resume._id !== resumeId))
      toast.success('Resume deleted successfully')
    } catch (err) {
      toast.error('Failed to delete resume')
    }
  }

  const deleteResumeRequest = (resumeId) => {
    if (!user) {
      toast.info("Please login to delete resumes");
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    setDeleteModal({ isOpen: true, resumeId })
  }

  useEffect(() => {
    if (user) {
      loadAllResumes()
    } else {
      setUserResumes([])
    }
  }, [user])

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-slate-800'>Your Resumes</h1>
        <button onClick={() => {
          if (!user) {
            toast.info("Please login to create a resume");
            setAuthModal({ isOpen: true, mode: 'login' });
          } else {
            setShowCreateResume(true);
          }
        }} className='flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-sm'>
          <PlusIcon className='size-5' />
          Create New
        </button>
      </div>

      {userResumes.length > 0 ? (
        <div className='grid grid-cols-2 sm:flex flex-wrap gap-6 mb-12'>
          {userResumes.map((resume, index) => {
            const baseColor = COLORS[index % COLORS.length];
            return (
              <div key={resume._id} className='relative w-full sm:max-w-44 h-56 group'>
                <button onClick={() => {
                  if (!user) {
                    toast.info("Please login to edit resumes");
                    setAuthModal({ isOpen: true, mode: 'login' });
                  } else {
                    navigate(`/app/builder/${resume._id}`);
                  }
                }} className='w-full h-full flex flex-col items-center justify-center rounded-xl gap-3 border shadow-sm group-hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden' style={{ background: `linear-gradient(135deg, ${baseColor}0D, ${baseColor}33)`, borderColor: baseColor + '30' }}>
                  <FilePenLineIcon className='size-10' style={{ color: baseColor }} />
                  <p className='text-sm font-semibold px-3 text-center line-clamp-2' style={{ color: baseColor }}>{resume.title}</p>
                  <p className='text-[11px] text-slate-500 mt-1'>
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button onClick={() => deleteResumeRequest(resume._id)} className='p-1.5 bg-white shadow-sm rounded-lg text-red-500 hover:bg-red-50 transition-colors'>
                    <TrashIcon className='size-4' />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center mb-12'>
          <div className='bg-white size-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4'>
            <FilePenLineIcon className='size-8 text-slate-300' />
          </div>
          <h3 className='text-lg font-medium text-slate-600 mb-1'>No resumes yet</h3>
          <p className='text-slate-400 text-sm mb-6'>Select a template below to build your first resume</p>
          <button onClick={() => {
            if (!user) {
              toast.info("Please login to browse templates");
              setAuthModal({ isOpen: true, mode: 'login' });
            } else {
              setShowCreateResume(true);
            }
          }} className='text-purple-600 font-semibold hover:text-purple-700 transition-colors'>Browse Templates &rarr;</button>
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete Resume"
      />

      <div className='mt-16'>
        <h2 className='text-xl font-bold text-slate-800 mb-6'>Choose a Template</h2>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
          {TEMPLATE_OPTIONS.map((template, index) => {
            const baseColor = COLORS[index % COLORS.length];
            return (
              <button key={template.id} onClick={() => handleTemplateClick(template)} className='relative w-full h-56 flex flex-col items-center justify-center rounded-xl gap-3 border border-slate-200 bg-white hover:border-purple-500 hover:shadow-lg transition-all duration-300 group overflow-hidden'>
                {template.isPremium && (
                  <div className='absolute top-3 right-3 flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider'>
                    <CrownIcon size={10} /> Premium
                  </div>
                )}
                <div className='size-12 rounded-lg flex items-center justify-center transition-colors' style={{ backgroundColor: baseColor + '15' }}>
                  <LayoutTemplate className='size-6' style={{ color: baseColor }} />
                </div>
                <div className='text-center px-4'>
                  <p className='text-sm font-semibold text-slate-700 mb-0.5'>{template.name}</p>
                  <p className='text-[11px] text-slate-400'>{template.description}</p>
                </div>
                <div className={`mt-2 px-4 py-1.5 rounded-full text-[11px] font-medium transition-colors ${template.isPremium && !isUpgraded ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600'}`}>
                  {template.isPremium && !isUpgraded ? 'Unlock Premium' : 'Use Template'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {showUpgradeModal && (
        <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative p-8'>
            <div className='bg-amber-100 size-16 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CrownIcon className='size-8 text-amber-600' />
            </div>
            <h2 className='text-2xl font-bold text-slate-800 text-center mb-2'>Upgrade to Premium</h2>
            <p className='text-slate-500 text-sm text-center mb-8'>
              Unlock exclusive premium templates and advanced features to make your resume stand out from the crowd.
            </p>
            <div className='space-y-3'>
              <button onClick={handleUpgrade} className='w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-bold text-sm shadow-lg shadow-amber-500/20'>
                Upgrade Now - $9.99
              </button>
              <button onClick={() => { setShowUpgradeModal(false); setSelectedTemplate(null) }} className='w-full py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm'>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateResume && (
        <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative'>
            <button onClick={() => { setShowCreateResume(false); setSelectedTemplate(null) }} className='absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all'>
              <XIcon className='size-5' />
            </button>
            
            <div className='p-8 pt-10'>
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>
                {selectedTemplate ? 'Name your resume' : 'Choose a template'}
              </h2>
              <p className='text-slate-500 text-sm mb-8'>
                {selectedTemplate ? `Using the ${selectedTemplate.name} template` : 'Select a starting point for your new resume'}
              </p>

              {selectedTemplate ? (
                <form onSubmit={createResume} className='space-y-6'>
                  <div>
                    <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2'>Resume Title</label>
                    <input autoFocus onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='e.g. My Software Engineer Resume' className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-700' required />
                  </div>
                  <div className='flex gap-3 pt-2'>
                    <button type="button" onClick={() => setSelectedTemplate(null)} className='flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm'>
                      Back
                    </button>
                    <button type="submit" className='flex-[2] px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold text-sm shadow-md shadow-purple-500/20'>
                      Create & Continue
                    </button>
                  </div>
                </form>
              ) : (
                <div className='max-h-[400px] overflow-y-auto pr-2 space-y-4 px-1 pb-1'>
                  {TEMPLATE_OPTIONS.map((template, index) => {
                    const baseColor = COLORS[index % COLORS.length];
                    return (
                      <button key={template.id} onClick={() => handleTemplateClick(template)} className='w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group text-left relative'>
                        {template.isPremium && (
                          <div className='absolute top-3 right-3 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase'>
                            Premium
                          </div>
                        )}
                        <div className='size-10 rounded-lg flex items-center justify-center shadow-sm transition-colors' style={{ backgroundColor: baseColor + '15' }}>
                          <LayoutTemplate className='size-5' style={{ color: baseColor }} />
                        </div>
                        <div>
                          <p className='font-bold text-slate-700 group-hover:text-purple-700 transition-colors'>{template.name}</p>
                          <p className='text-xs text-slate-400'>{template.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
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

export default Dashboard
