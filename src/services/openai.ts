import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'your-openai-api-key', 
  dangerouslyAllowBrowser: true 
});

export const generateInterviewQuestions = async (topic: string): Promise<string[]> => {
  try {
   
    if (!openai.apiKey || openai.apiKey === 'your-openai-api-key') {
      return generateMockQuestions(topic);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer. Generate exactly 10 professional interview questions for the given topic. Each question should be clear, relevant, and suitable for assessing knowledge and skills. Return only the questions, one per line, without numbering."
        },
        {
          role: "user",
          content: `Generate 10 interview questions for: ${topic}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const questions = response.choices[0]?.message?.content?.split('\n').filter(q => q.trim()) || [];
    return questions.slice(0, 10);
  } catch (error) {
    console.error('Error generating questions:', error);
    return generateMockQuestions(topic);
  }
};

const generateMockQuestions = (topic: string): string[] => {
  const baseQuestions = [
    `What experience do you have in ${topic}?`,
    `How do you stay updated with the latest trends in ${topic}?`,
    `Describe a challenging project you worked on related to ${topic}.`,
    `What are the key skills required for success in ${topic}?`,
    `How would you explain ${topic} concepts to a non-technical person?`,
    `What tools and technologies do you use for ${topic}?`,
    `Describe your problem-solving approach in ${topic}.`,
    `What are the current challenges facing the ${topic} industry?`,
    `How do you ensure quality and best practices in ${topic}?`,
    `Where do you see the future of ${topic} heading?`
  ];
  
  return baseQuestions;
};