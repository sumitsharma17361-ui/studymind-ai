const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generateStudyRoadmap = async (subject, targetWeeks, level) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in Render Environment Variables');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create a structured ${targetWeeks}-week study roadmap for the subject "${subject}" at a ${level} level.
Return ONLY a valid raw JSON array of objects without any markdown formatting, backticks, or extra commentary.
Structure:
[
  {
    "week": 1,
    "title": "Module Title",
    "topics": ["Topic 1", "Topic 2", "Topic 3"],
    "keyConcepts": ["Concept A", "Concept B"]
  }
]`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Extract JSON array if AI wraps it in backticks or markdown
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API Processing Error:', error);
    throw new Error(error.message || 'Failed to parse roadmap from Gemini');
  }
};

module.exports = { generateStudyRoadmap };
