import React, { useState } from 'react';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession } from './components/InterviewSession';
import { InterviewResults } from './components/InterviewResults';
import { generateInterviewQuestions } from './services/openai';
import { Question, Answer, InterviewSession as IInterviewSession } from './types';

type AppState = 'setup' | 'interview' | 'results' | 'terminated';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [currentSession, setCurrentSession] = useState<IInterviewSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartInterview = async (topic: string) => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateInterviewQuestions(topic);
      const formattedQuestions: Question[] = generatedQuestions.map((q, index) => ({
        id: `q-${index + 1}`,
        question: q,
        topic: topic,
      }));

      setQuestions(formattedQuestions);
      setCurrentSession({
        topic,
        questions: formattedQuestions,
        answers: [],
        startTime: new Date(),
        totalMarks: 0,
        isCompleted: false,
      });
      setAppState('interview');
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteInterview = (answers: Answer[]) => {
    if (!currentSession) return;

    const totalMarks = answers.reduce((sum, answer) => sum + answer.marks, 0);
    const completedSession: IInterviewSession = {
      ...currentSession,
      answers,
      endTime: new Date(),
      totalMarks,
      isCompleted: true,
    };

    setCurrentSession(completedSession);
    setAppState('results');
  };

  const handleTabSwitch = () => {
    setAppState('terminated');
  };

  const handleRestart = () => {
    setAppState('setup');
    setCurrentSession(null);
    setQuestions([]);
  };

  if (appState === 'terminated') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interview Terminated
          </h2>
          <p className="text-gray-600 mb-6">
            The interview was terminated due to tab switching. This is a security measure to maintain interview integrity.
          </p>
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'setup') {
    return (
      <InterviewSetup
        onStartInterview={handleStartInterview}
        isLoading={isLoading}
      />
    );
  }

  if (appState === 'interview' && currentSession) {
    return (
      <InterviewSession
        questions={questions}
        onComplete={handleCompleteInterview}
        onTabSwitch={handleTabSwitch}
        topic={currentSession.topic}
      />
    );
  }

  if (appState === 'results' && currentSession) {
    return (
      <InterviewResults
        session={currentSession}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default App;