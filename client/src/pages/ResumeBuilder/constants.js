import { Briefcase, FileText, FolderIcon, GraduationCap, Sparkles, User } from 'lucide-react'

export const SECTIONS = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "summary", name: "Summary", icon: FileText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "projects", name: "Projects", icon: FolderIcon },
  { id: "skills", name: "Skills", icon: Sparkles },
]

export const INITIAL_RESUME_DATA = {
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
}
