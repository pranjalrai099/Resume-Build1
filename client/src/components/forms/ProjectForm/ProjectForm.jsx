import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { enhanceDescription } from '../../../api/ai';

const ProjectForm = ({ data = [], onChange}) => {
    const [loadingIndices, setLoadingIndices] = useState({});
    
    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: ""
        };
        onChange([...data, newProject])
    }

    const removeProject = (index)=> {
        const updated = data.filter((_, i)=> i !== index);
        onChange(updated)
    }

    const updateProject = (index, field, value)=> {
        const updated = [...data]; updated[index] = {...updated[index], [field]: value}
        onChange(updated)
    }

    const handleEnhanceDescription = async (index) => {
        const description = data[index].description;
        if (!description || description.trim().length < 10) {
            alert("Please write a short description first.");
            return;
        }

        setLoadingIndices(prev => ({ ...prev, [index]: true }));
        try {
            const enhanced = await enhanceDescription(description, 'project');
            updateProject(index, "description", enhanced);
        } catch (error) {
            alert("Failed to enhance description. Please try again.");
        } finally {
            setLoadingIndices(prev => ({ ...prev, [index]: false }));
        }
    }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
            <p className='text-sm text-gray-500'>Add your projects</p>
        </div>
        <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
            <Plus className='size-4' />
            Add Project
        </button>
      </div>

        <div className='space-y-4 mt-6'>
            {data.map((project, index)=>(
                <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                    <div className='flex justify-between items-start'>
                        <h4 className='font-medium text-gray-700'>Project #{index +1}</h4>
                        <button onClick={() => removeProject(index)}
                            className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className='size-4'/>
                        </button>
                    </div>
                    <div className='grid gap-3'>
                        <input value={project.name || ""} onChange={(e)=> updateProject(index, "name", e.target.value)} type="text" placeholder='Project Name' className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ' />
                        <input value={project.type || ""} onChange={(e)=> updateProject(index, "type", e.target.value)} type="text" placeholder='Project Type' className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ' />
                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-medium text-gray-700 '>Project Description</label>
                                <button 
                                    onClick={() => handleEnhanceDescription(index)}
                                    disabled={loadingIndices[index] || !project.description}
                                    className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
                                >
                                    {loadingIndices[index] ? <Loader2 className='w-3 h-3 animate-spin' /> : <Sparkles className='w-3 h-3' />}
                                    {loadingIndices[index] ? 'Enhancing...' : 'Enhance with AI'}
                                </button>
                            </div>
                            <textarea rows={4} value={project.description || ""} onChange={(e)=> updateProject(index, "description", e.target.value)} placeholder='Describe your project...' className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white resize-none focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ProjectForm