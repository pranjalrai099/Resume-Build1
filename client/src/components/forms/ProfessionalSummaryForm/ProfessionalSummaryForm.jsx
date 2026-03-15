import { Sparkles, Loader2, Wand2 } from 'lucide-react'
import React, { useState } from 'react'
import { enhanceSummary, generateSummary } from '../../../api/ai';

const ProfessionalSummaryForm = ({data, onChange, setResumeData, resumeData}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEnhance = async () => {
    if (!data || data.trim().length < 10) {
      alert("Please write at least a short summary first.");
      return;
    }
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceSummary(data);
      onChange(enhanced);
    } catch (error) {
      alert("Failed to enhance summary. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  }

  const handleGenerate = async () => {
    const { experience, education, skills } = resumeData || {};
    if ((!experience || experience.length === 0) && (!education || education.length === 0)) {
        alert("Please add some experience or education details first so AI can generate a summary.");
        return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateSummary(experience, education, skills);
      onChange(generated);
    } catch (error) {
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray=900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'>Add summary for your resume here</p>
        </div>
        <div className='flex gap-2'>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50'
            >
                {isGenerating ? <Loader2 className='size-4 animate-spin' /> : <Wand2 className='size-4' />}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
            <button 
              onClick={handleEnhance}
              disabled={isEnhancing || !data}
              className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
            >
                {isEnhancing ? <Loader2 className='size-4 animate-spin' /> : <Sparkles className='size-4' />}
                {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
            </button>
        </div>
      </div>

      <div className='mt-6'>
        <textarea value={data || ""} onChange={(e)=> onChange(e.target.value)} rows={7} className='w-full py-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'/>
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip:Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm