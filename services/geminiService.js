const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateStudyRoadmap = async (subject, targetWeeks, level) => {
  const prompt = `
Create a structured ${targetWeeks}-week study roadmap for the subject "${subject}" at a ${level} level.
Return ONLY a valid JSON array of modules with the following structure:
[
  {
    "week": 1,
    "title": "Module Title",
    "topics": ["Topic 1", "Topic 2", "Topic 3"],
    "keyConcepts": ["Concept A", "Concept B"]
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate roadmap from AI service');
  }
};

module.exports = { generateStudyRoadmap };
