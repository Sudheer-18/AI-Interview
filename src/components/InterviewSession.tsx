import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../types';
import { QuestionCard } from './QuestionCard';
import { CameraPreview } from './CameraPreview';
import { useCamera } from '../hooks/useCamera';
import { useTabVisibility } from '../hooks/useTabVisibility';
import { analyzeAnswer } from '../services/gemini';
import { AlertTriangle, Loader } from 'lucide-react';

interface InterviewSessionProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  onTabSwitch: () => void;
  topic: string;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({
  questions,
  onComplete,
  onTabSwitch,
  topic,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map(q => ({ questionId: q.id, answer: '', marks: 0 }))
  );
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { cameraStatus, videoRef, startCamera } = useCamera();

  useTabVisibility({
    onTabSwitch: () => {
      setShowTabWarning(true);
      setTimeout(() => {
        onTabSwitch();
      }, 3000);
    },
    isActive: true,
  });

  useEffect(() => {
    startCamera();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.answer || '';

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === currentQuestion.id 
        ? { ...a, answer, marks: 0 } // Reset marks, will be calculated on completion
        : a
    ));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Analyze all answers before completing
      setIsAnalyzing(true);
      try {
        const analyzedAnswers = await Promise.all(
          answers.map(async (answer) => {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question || !answer.answer.trim()) {
              return { ...answer, marks: 0 };
            }
            
            const analysis = await analyzeAnswer(question.question, answer.answer, topic);
            return { ...answer, marks: analysis.score };
          })
        );
        
        onComplete(analyzedAnswers);
      } catch (error) {
        console.error('Error analyzing answers:', error);
        // Fallback to simple scoring if analysis fails
        const fallbackAnswers = answers.map(answer => ({
          ...answer,
          marks: answer.answer.trim() ? Math.min(5, Math.max(1, Math.floor(answer.answer.trim().split(/\s+/).length / 20))) : 0
        }));
        onComplete(fallbackAnswers);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (showTabWarning) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Violation Detected
          </h2>
          <p className="text-gray-600 mb-4">
            You switched tabs during the interview. The session will be terminated in a few seconds.
          </p>
          <div className="w-full bg-red-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Answers
          </h2>
          <p className="text-gray-600 mb-4">
            Our AI is evaluating your responses. This may take a few moments...
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview: {topic}
              </h1>
              <p className="text-gray-600">
                Speak your answers clearly into the microphone
              </p>
            </div>
            {!cameraStatus.isEnabled && (
              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Camera monitoring required</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={true}
              canGoPrevious={currentQuestionIndex > 0}
              isLast={currentQuestionIndex === questions.length - 1}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <CameraPreview
              videoRef={videoRef}
              cameraStatus={cameraStatus}
              onStartCamera={startCamera}
            />

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded ${
                      index === currentQuestionIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : answers[index]?.answer.trim()
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : answers[index]?.answer.trim()
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${
                      index === currentQuestionIndex ? 'font-medium' : ''
                    }`}>
                      Question {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};