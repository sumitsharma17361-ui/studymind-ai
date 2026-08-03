const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateStudyRoadmap = async (subject, targetWeeks, level) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Create a structured ${targetWeeks}-week study roadmap for the subject "${subject}" at a ${level} level.
Return ONLY a valid JSON array of modules without any markdown formatting or code blocks:
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
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean markdown backticks if AI returns them
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate roadmap from AI service');
  }
};

module.exports = { generateStudyRoadmap };
