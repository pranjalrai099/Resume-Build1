import express from 'express';
import { enhanceSummary, generateSummary, enhanceDescription, suggestSkills } from '../controllers/aiController.js';

const router = express.Router();

router.post('/enhance-summary', enhanceSummary);
router.post('/generate-summary', generateSummary);
router.post('/enhance-description', enhanceDescription);
router.post('/suggest-skills', suggestSkills);

export default router;
