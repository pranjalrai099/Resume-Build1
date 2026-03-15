import * as api from '../../api'
import { dummyResumeData } from '../../assets/assets'
import { toast } from 'react-toastify'

/**
 * Load an existing resume from the API, falling back to dummy data
 */
export const loadExistingResume = async (resumeId) => {
  try {
    const { data } = await api.getResumeById(resumeId)
    if (data) {
      return {
        ...data,
        personal_info: data.personal_info || {},
        experience: data.experience || [],
        education: data.education || [],
        projects: data.projects || [],
        skills: data.skills || []
      }
    }
  } catch (err) {
    // Fallback to dummy data (for initial templates)
    const resume = dummyResumeData.find(resume => resume._id === resumeId)
    if (resume) {
      return {
        ...resume,
        personal_info: resume.personal_info || {},
        experience: resume.experience || [],
        education: resume.education || [],
        projects: resume.projects || [],
        skills: resume.skills || []
      }
    }
  }
  return null
}

/**
 * Save the resume to the API
 */
export const saveResume = async (resumeId, resumeData) => {
  const { _id, ...updateData } = resumeData
  await api.updateResume(resumeId, updateData)
  toast.success('Resume saved successfully!')
}

/**
 * Share the resume URL using the Web Share API
 */
export const handleShare = (resumeId) => {
  const frontendUrl = window.location.href.split('/app/')[0]
  const resumeUrl = frontendUrl + '/view/' + resumeId

  if (navigator.share) {
    navigator.share({ url: resumeUrl, text: 'My Resume' })
  } else {
    toast.info('Share not supported on this browser.')
  }
}

/**
 * Download the resume using the browser print dialog
 */
export const downloadResume = () => {
  window.print()
}
