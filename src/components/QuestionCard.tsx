import React from 'react';
import { ChevronLeft, ChevronRight, Award, Mic } from 'lucide-react';
import { SpeechAnswerInput } from './SpeechAnswerInput';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLast,
}) => {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Question {questionNumber} of {totalQuestions} • 5 marks
            </span>
          </div>
          <div className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% Complete
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-blue-600 font-semibold text-sm">{questionNumber}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question}
          </h2>
        </div>
        
        <div className="ml-11">
          <SpeechAnswerInput
            answer={answer}
            onAnswerChange={onAnswerChange}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Mic className="w-4 h-4" />
            <span>Voice Answer</span>
          </div>
          {answer.trim() && (
            <span>
              {answer.trim().split(/\s+/).filter(word => word.length > 0).length} words
            </span>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLast ? 'Finish Interview' : 'Next'}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};