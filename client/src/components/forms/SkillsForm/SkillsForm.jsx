import { Plus, Sparkles, X, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { suggestSkills } from '../../../api/ai';

const SkillsForm = ({ data, onChange, resumeData }) => {
    const [newSkill, setNewSkill] = useState("")
    const [isSuggesting, setIsSuggesting] = useState(false);

    const addSkill = ()=> {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index)  => index !== indexToRemove))
    }

    const handleKeyPress = (e)=>{
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();            
        }
    }

    const handleSuggestSkills = async () => {
        setIsSuggesting(true);
        try {
            const experiences = resumeData?.experience || [];
            const suggestions = await suggestSkills(experiences, data);
            if (suggestions && suggestions.length > 0) {
                // Combine and remove duplicates
                const updatedSkills = [...new Set([...data, ...suggestions])];
                onChange(updatedSkills);
            } else {
                alert("AI could not find additional suggestions based on your experience.");
            }
        } catch (error) {
            alert("Failed to get skill suggestions. Please try again.");
        } finally {
            setIsSuggesting(false);
        }
    }

  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
            </div>
            <button 
                onClick={handleSuggestSkills}
                disabled={isSuggesting}
                className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
            >
                {isSuggesting ? <Loader2 className='size-4 animate-spin' /> : <Sparkles className='size-4' />}
                {isSuggesting ? 'Suggesting...' : 'AI Suggest Skills'}
            </button>
        </div>

        <div className='flex gap-2'>
            <input type="text" placeholder='Enter a skill (e.g., JavaScript, Project Management)' className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors' onChange={(e)=>setNewSkill(e.target.value)} value={newSkill} onKeyDown={handleKeyPress} />
            <button onClick={addSkill} disabled={!newSkill.trim()} className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50  disabled:cursor-not-allowed'>
                <Plus className='size-4'/> Add
            </button>
        </div>

        {data.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
                {data.map((skill, index)=>(
                    <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                        {skill}
                        <button onClick={()=> removeSkill(index)} className='ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors'>
                            <X className='w-3 h-3'/>
                        </button>
                    </span>
                ))}
            </div>
        ) : 
        (
            <div className='text-center py-6'>
                <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                <p className='text-gray-500 text-sm'>No skills added yet.</p>
                <p className='text-xs text-gray-400'>Add your technical and soft skills above or use AI suggestions.</p>
            </div>
        )}
        <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-sm text-blue-800'><strong>Tip:</strong>Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).</p>
        </div>
    </div>
  )
}

export default SkillsForm