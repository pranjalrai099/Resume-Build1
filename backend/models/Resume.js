import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  location: String,
  start_date: String,
  end_date: String,
  description: String,
  is_current: Boolean,
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  graduation_date: String,
  gpa: String,
});

const projectSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  link: String,
});

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  personal_info: {
    full_name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    website: String,
    profession: String,
    image: String,
  },
  professional_summary: String,
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  skills: [String],
  template: { type: String, default: 'classic' },
  accent_color: { type: String, default: '#3B82F6' },
  public: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
