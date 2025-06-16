import React, { useState } from 'react';
import { BookOpen, Camera, Shield, Clock, Award } from 'lucide-react';

interface InterviewSetupProps {
  onStartInterview: (topic: string) => void;
  isLoading: boolean;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ 
  onStartInterview, 
  isLoading 
}) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartInterview(topic.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Interview Platform
          </h1>
          <p className="text-xl text-gray-600">
            Professional interview experience powered by artificial intelligence
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-lg font-semibold text-gray-800 mb-3">
                Interview Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React Development, Data Science, Product Management..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Scoring System</h3>
            </div>
            <p className="text-gray-600">10 questions, 5 marks each. Total: 50 points</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Time Limit</h3>
            </div>
            <p className="text-gray-600">No time limit - answer at your own pace</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Camera className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Camera Required</h3>
            </div>
            <p className="text-gray-600">Camera monitoring for interview integrity</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Tab Switch Alert</h3>
            </div>
            <p className="text-gray-600">Interview ends if you switch tabs</p>
          </div>
        </div>
      </div>
    </div>
  );
};