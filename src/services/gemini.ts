import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCltEy1jhZOfKXGDzYVuuX3D_s1dCKOmgA');

export interface AnswerAnalysis {
  score: number; // 0-5
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const analyzeAnswer = async (
  question: string,
  answer: string,
  topic: string
): Promise<AnswerAnalysis> => {
  try {
    // For demo purposes, return mock analysis if API key is not set
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'AIzaSyCltEy1jhZOfKXGDzYVuuX3D_s1dCKOmgA') {
      return generateMockAnalysis(answer);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-2.5' });

    const prompt = `
You are an expert interviewer analyzing a candidate's answer. Please evaluate the following interview response:

Topic: ${topic}
Question: ${question}
Answer: ${answer}

Please provide a detailed analysis in the following JSON format:
{
  "score": [number between 0-5],
  "feedback": "[overall feedback about the answer]",
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...]
}

Scoring criteria:
- 5: Excellent - Comprehensive, accurate, well-structured answer with examples
- 4: Good - Solid understanding with minor gaps or could use more detail
- 3: Average - Basic understanding but lacks depth or has some inaccuracies
- 2: Below Average - Limited understanding with significant gaps
- 1: Poor - Minimal understanding with major inaccuracies
- 0: No answer or completely incorrect

Focus on:
1. Technical accuracy and depth of knowledge
2. Clarity and structure of the response
3. Use of relevant examples or experiences
4. Completeness of the answer
5. Professional communication skills

Provide constructive feedback that helps the candidate improve.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          score: Math.max(0, Math.min(5, analysis.score || 0)),
          feedback: analysis.feedback || 'No feedback provided',
          strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
          improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
        };
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
    }

    // Fallback if JSON parsing fails
    return {
      score: 3,
      feedback: text.substring(0, 200) + '...',
      strengths: ['Provided a response'],
      improvements: ['Could provide more detailed analysis'],
    };

  } catch (error) {
    console.error('Error analyzing answer with Gemini:', error);
    return generateMockAnalysis(answer);
  }
};

const generateMockAnalysis = (answer: string): AnswerAnalysis => {
  const wordCount = answer.trim().split(/\s+/).length;
  
  let score = 0;
  let feedback = '';
  let strengths: string[] = [];
  let improvements: string[] = [];

  if (wordCount === 0) {
    score = 0;
    feedback = 'No answer provided. Please provide a response to demonstrate your knowledge.';
    improvements = ['Provide a complete answer', 'Include relevant examples', 'Explain your reasoning'];
  } else if (wordCount < 20) {
    score = 1;
    feedback = 'Very brief answer. While you provided a response, it lacks detail and depth.';
    strengths = ['Attempted to answer the question'];
    improvements = ['Provide more detailed explanations', 'Include specific examples', 'Elaborate on key concepts'];
  } else if (wordCount < 50) {
    score = 2;
    feedback = 'Basic answer provided. Shows some understanding but could be more comprehensive.';
    strengths = ['Shows basic understanding', 'Provided a structured response'];
    improvements = ['Add more depth to explanations', 'Include practical examples', 'Cover more aspects of the topic'];
  } else if (wordCount < 100) {
    score = 3;
    feedback = 'Good answer with adequate detail. Demonstrates solid understanding of the topic.';
    strengths = ['Clear communication', 'Good level of detail', 'Shows practical knowledge'];
    improvements = ['Could include more specific examples', 'Consider discussing edge cases', 'Expand on best practices'];
  } else if (wordCount < 150) {
    score = 4;
    feedback = 'Very good answer with comprehensive coverage. Shows strong understanding and communication skills.';
    strengths = ['Comprehensive response', 'Clear explanations', 'Good use of examples', 'Professional communication'];
    improvements = ['Could discuss advanced concepts', 'Consider mentioning industry trends'];
  } else {
    score = 5;
    feedback = 'Excellent, detailed answer. Demonstrates deep understanding and excellent communication skills.';
    strengths = ['Exceptional detail', 'Clear structure', 'Comprehensive coverage', 'Professional presentation', 'Strong examples'];
    improvements = ['Continue maintaining this level of detail', 'Keep up the excellent communication'];
  }

  return { score, feedback, strengths, improvements };
};