import express from 'express';
import Resume from '../models/Resume.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all resumes for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found or unauthorized' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = { ...req.body, userId: req.user.id };
    const resume = new Resume(resumeData);
    const newResume = await resume.save();
    res.status(201).json(newResume);
  } catch (err) {
    console.error('POST Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT to update a resume
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedResume) return res.status(404).json({ message: 'Resume not found or unauthorized' });
    res.json(updatedResume);
  } catch (err) {
    console.error('PUT Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found or unauthorized' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    console.error('DELETE Error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
