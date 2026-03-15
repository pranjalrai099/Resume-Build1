import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../../assets/assets'
import ResumePreview from '../../components/ResumePreview'
import { ArrowLeftIcon, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as api from '../../api'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
      const { data } = await api.getResumeById(resumeId)
      if (data) {
        setResumeData(data)
        setIsLoading(false)
        return
      }
    } catch (err) {
      // Fallback to dummy data
      setResumeData(dummyResumeData.find(resume => resume._id === resumeId) || null)
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadResume()
  },[resumeId])

  return resumeData ? (
    <div className='bg-slate-100 min-h-screen'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white shadow-sm'/>
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-screen'>
      {isLoading ? <Loader className='animate-spin size-12 text-gray-400' size={48} /> : (
        <div className='text-center'>
          <p className='text-slate-500 mb-6'>Resume not found</p>
          <Link to="/app" className='inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2.5 transition-all shadow-sm font-medium'>
            <ArrowLeftIcon className='size-4' />
            Back to Dashboard
          </Link>
        </div>
      ) }
    </div>
  )
}

export default Preview