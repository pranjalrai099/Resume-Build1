import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import { PersonalInfoForm, ProfessionalSummaryForm, ExperienceForm, EducationForm, ProjectForm, SkillsForm } from '../../components/forms'
import ResumePreview from '../../components/ResumePreview'
import TemplateSelector from '../../components/TemplateSelector'
import ColorPicker from '../../components/ColorPicker'
import { toast } from 'react-toastify'
import * as api from '../../api'
import { SECTIONS, INITIAL_RESUME_DATA } from './constants'
import { useUser } from '../../context/UserContext'


const ResumeBuilder = () => {

  const { resumeId } = useParams()

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.getResumeById(resumeId)
      if (data) {
        setResumeData({
          ...data,
          personal_info: data.personal_info || {},
          experience: data.experience || [],
          education: data.education || [],
          projects: data.projects || [],
          skills: data.skills || []
        })
        document.title = data.title
      }
    } catch (err) {
      // Fallback to dummy data (for initial templates)
      const resume = dummyResumeData.find(resume => resume._id === resumeId)
      if (resume) {
        setResumeData({
          ...resume,
          personal_info: resume.personal_info || {},
          experience: resume.experience || [],
          education: resume.education || [],
          projects: resume.projects || [],
          skills: resume.skills || []
        })
        document.title = resume.title
      }
    }
  }

  const saveResume = async () => {
    try {
      const { _id, ...updateData } = resumeData
      await api.updateResume(resumeId, updateData)
      toast.success('Resume saved successfully!')
    } catch (err) {
      toast.error('Failed to save resume')
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "summary", name: "Summary", icon: FileText },
  ]

  const activeSection = sections[activeSectionIndex]
   const { user } = useUser();

    useEffect(() => {
    if (user) {
      loadExistingResume()
    } else {
      navigate('/app')
    }
  }, [resumeId, user])

  const changeResumeVisibility = async () => {
    setResumeData({ ...resumeData, public: !resumeData.public })
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume', })
    }
    else {
      toast.info('Share not supported on this browser.')
    }
  }

  const downloadResume = () => {
    window.print();
  }

  return (
    <div className='min-h-screen bg-slate-50 print:bg-white print:min-h-0'>
      {/* Sticky Header Bar */}
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 mb-6 no-print'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-900 transition-all font-medium text-sm'>
            <ArrowLeftIcon className='size-4' /> Back to Dashboard
          </Link>

          <div className='flex items-center gap-3'>
            {resumeData.public && (
              <button onClick={handleShare} className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all border border-blue-100'>
                <Share2Icon className='size-4' /> Share
              </button>
            )}
            <button onClick={changeResumeVisibility} className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all border ${resumeData.public ? 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
              {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>
            <button onClick={downloadResume} className='inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm'>
              <DownloadIcon className='size-4' /> Download
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-12 print:p-0 print:max-w-none'>
        <div className='grid lg:grid-cols-12 gap-8 print:block'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 no-print'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden'>
              {/* progress bar */}
              <div className='absolute top-0 left-0 right-0 h-1 bg-gray-100'>
                <div className='h-full bg-green-500 transition-all duration-300' style={{ width: `${(activeSectionIndex + 1) * 100 / sections.length}%` }} />
              </div>

              {/* Section Navigation */}
              <div className='flex justify-between items-center mb-8 pb-4 border-b border-gray-100 mt-2'>
                <div className='flex items-center gap-3'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>

                <div className='flex items-center gap-1'>
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className={`p-2 rounded-lg transition-all ${activeSectionIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`} disabled={activeSectionIndex === 0}>
                    <ChevronLeft className='size-5' />
                  </button>
                  <span className='text-sm font-medium text-gray-400 px-2'>{activeSectionIndex + 1} / {sections.length}</span>
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`p-2 rounded-lg transition-all ${activeSectionIndex === sections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`} disabled={activeSectionIndex === sections.length - 1}>
                    <ChevronRight className='size-5' />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='min-h-[400px]'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} resumeData={resumeData} />
                )}
                {activeSection.id === 'experience' && (<ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                )}
                {activeSection.id === 'education' && (<EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                )}
                {activeSection.id === 'projects' && (<ProjectForm data={resumeData.projects} onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))} />
                )}
                {activeSection.id === 'skills' && (<SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} resumeData={resumeData} />
                )}
              </div>
              
              <div className='mt-8 pt-6 border-t border-gray-100 flex justify-between items-center'>
                <p className='text-xs text-gray-400 italic'>All changes are saved automatically to the cloud.</p>
                <button onClick={saveResume} className='bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-2.5 transition-all shadow-sm text-sm active:scale-95'>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 print:w-full print:m-0'>
            <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-24 print:static print:border-0 print:shadow-none print:overflow-visible'>
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
