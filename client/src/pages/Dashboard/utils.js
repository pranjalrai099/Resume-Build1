import * as api from '../../api'
import { toast } from 'react-toastify'

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('resume_user')
  return userJson ? JSON.parse(userJson) : null
}

/**
 * Load all resumes for the current user
 */
export const loadAllResumes = async () => {
  const { data } = await api.getResumes()
  return data
}

/**
 * Create a new resume with the given title, template, and navigate callback
 */
export const createResume = async ({ title, template, navigate }) => {
  if (!template) {
    toast.error('Please select a template')
    return null
  }

  const resumeData = {
    title: title || 'Untitled Resume',
    template: template.id,
    personal_info: {},
    experience: [],
    education: [],
    projects: [],
    skills: [],
  }

  const { data } = await api.createResume(resumeData)
  return data
}

/**
 * Delete a resume by ID
 */
export const deleteResume = async (resumeId) => {
  await api.deleteResume(resumeId)
}

/**
 * Upgrade the current user to premium
 */
export const upgradeToPremium = async () => {
  await api.upgradeToPremium()
  const user = getCurrentUser()
  if (user) {
    const updatedUser = { ...user, isPremium: true }
    localStorage.setItem('resume_user', JSON.stringify(updatedUser))
  }
}
