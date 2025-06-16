import React from 'react';
import { Award, Clock, CheckCircle, RotateCcw, Calendar, TrendingUp, MessageSquare } from 'lucide-react';
import { InterviewSession } from '../types';

interface InterviewResultsProps {
  session: InterviewSession;
  onRestart: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({
  session,
  onRestart,
}) => {
  const answeredQuestions = session.answers.filter(a => a.answer.trim()).length;
  const totalQuestions = session.questions.length;
  const scorePercentage = (session.totalMarks / 50) * 100;
  const duration = session.endTime && session.startTime 
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
    : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-50';
    if (score >= 3) return 'text-yellow-600 bg-yellow-50';
    if (score >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Here's your AI-analyzed performance summary for {session.topic}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`text-3xl font-bold mb-1 ${getScoreColor(scorePercentage)}`}>
              {session.totalMarks}/50
            </div>
            <div className="text-sm text-gray-600">AI Score</div>
            <div className={`text-lg font-semibold mt-1 ${getScoreColor(scorePercentage)}`}>
              {getScoreGrade(scorePercentage)} ({scorePercentage.toFixed(1)}%)
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {answeredQuestions}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {duration}
            </div>
            <div className="text-sm text-gray-600">Minutes</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              Voice
            </div>
            <div className="text-sm text-gray-600">Answer Method</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              AI-Powered Question Analysis
            </h2>
          </div>
          <div className="space-y-6">
            {session.questions.map((question, index) => {
              const answer = session.answers.find(a => a.questionId === question.id);
              const wordCount = answer?.answer.trim().split(/\s+/).filter(word => word.length > 0).length || 0;
              
              return (
                <div key={question.id} className="border-l-4 border-blue-200 pl-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      Question {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColorClass(answer?.marks || 0)}`}>
                        {answer?.marks || 0}/5 points
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 font-medium">{question.question}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 font-medium">Your Voice Answer:</p>
                      <span className="text-xs text-gray-500">{wordCount} words</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {answer?.answer.trim() || 'No answer provided'}
                    </p>
                  </div>

                  {answer?.answer.trim() && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 font-medium mb-1">AI Analysis:</p>
                      <p className="text-blue-800 text-sm">
                        Content-based scoring using advanced AI analysis of your spoken response.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🎤 Voice-Powered Interview Experience
            </h3>
            <p className="text-gray-600 text-sm">
              Your answers were captured using advanced speech recognition technology and analyzed by AI for content quality, not just length.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
};