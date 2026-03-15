import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const enhanceSummary = async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ message: "Summary is required" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Enhance the following professional summary to be more compelling, concise, and impactful. Ensure correct grammar and professional tone. Return only the enhanced summary text.",
        },
        {
          role: "user",
          content: summary,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ enhancedSummary: completion.choices[0]?.message?.content || summary });
  } catch (error) {
    console.error("Error enhancing summary:", error);
    res.status(500).json({ message: "Failed to enhance summary" });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const { experiences, education, skills } = req.body;

    const prompt = `Generate a professional, high-impact resume summary (3-4 sentences) based on the following profile details:
    
    Experiences: ${JSON.stringify(experiences)}
    Education: ${JSON.stringify(education)}
    Skills: ${JSON.stringify(skills)}
    
    Return only the summary text without any introduction or quotes.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ generatedSummary: completion.choices[0]?.message?.content || "" });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};

export const enhanceDescription = async (req, res) => {
  try {
    const { description, type } = req.body; // type could be 'experience' or 'project'

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const systemPrompt = type === 'project' 
      ? "You are a professional resume writer. Enhance the following project description to highlight technical skills, impact, and results. Use bullet points if appropriate (starting with •). Return only the enhanced text."
      : "You are a professional resume writer. Enhance the following job description to be more impactful, using action verbs and highlighting achievements. Use bullet points if appropriate (starting with •). Return only the enhanced text.";

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: description,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ enhancedDescription: completion.choices[0]?.message?.content || description });
  } catch (error) {
    console.error("Error enhancing description:", error);
    res.status(500).json({ message: "Failed to enhance description" });
  }
};

export const suggestSkills = async (req, res) => {
  try {
    const { experiences, currentSkills } = req.body;

    const prompt = `Based on the following resume information, suggest 5-8 relevant technical or soft skills that are missing or would complement the profile.
    
    Experiences: ${JSON.stringify(experiences)}
    Current Skills: ${JSON.stringify(currentSkills)}
    
    Return the skills as a simple comma-separated list of strings. Do not include any other text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a recruitment expert. Suggest relevant skills based on the provided experience.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const suggestionsRaw = completion.choices[0]?.message?.content || "";
    const suggestions = suggestionsRaw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !currentSkills.includes(s));

    res.json({ suggestedSkills: suggestions });
  } catch (error) {
    console.error("Error suggesting skills:", error);
    res.status(500).json({ message: "Failed to suggest skills" });
  }
};
