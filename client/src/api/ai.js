import axios from 'axios';

const API_URL = 'https://resume-build1.onrender.com/api/ai';

export const enhanceSummary = async (summary) => {
    try {
        const response = await axios.post(`${API_URL}/enhance-summary`, { summary });
        return response.data.enhancedSummary;
    } catch (error) {
        console.error('Error enhancing summary:', error);
        throw error;
    }
};

export const generateSummary = async (experiences, education, skills) => {
    try {
        const response = await axios.post(`${API_URL}/generate-summary`, { experiences, education, skills });
        return response.data.generatedSummary;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
};

export const enhanceDescription = async (description, type) => {
    try {
        const response = await axios.post(`${API_URL}/enhance-description`, { description, type });
        return response.data.enhancedDescription;
    } catch (error) {
        console.error('Error enhancing description:', error);
        throw error;
    }
};

export const suggestSkills = async (experiences, currentSkills) => {
    try {
        const response = await axios.post(`${API_URL}/suggest-skills`, { experiences, currentSkills });
        return response.data.suggestedSkills;
    } catch (error) {
        console.error('Error suggesting skills:', error);
        throw error;
    }
};
