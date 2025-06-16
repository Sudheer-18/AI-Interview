import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SpeechAnswerInputProps {
  answer: string;
  onAnswerChange: (answer: string) => void;
  isDisabled?: boolean;
}

export const SpeechAnswerInput: React.FC<SpeechAnswerInputProps> = ({
  answer,
  onAnswerChange,
  isDisabled = false,
}) => {
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const { isListening, isSupported, startListening, stopListening, abortListening } = useSpeechRecognition({
    onResult: (result) => {
      if (result.isFinal) {
        const newAnswer = answer + (answer ? ' ' : '') + result.transcript;
        onAnswerChange(newAnswer);
        setInterimTranscript('');
      } else {
        setInterimTranscript(result.transcript);
      }
      setError(null);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
      setIsRecording(false);
    },
    continuous: true,
  });

  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening]);

  const handleStartRecording = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    setError(null);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleClearAnswer = () => {
    abortListening();
    onAnswerChange('');
    setInterimTranscript('');
    setError(null);
  };

  const displayText = answer + (interimTranscript ? (answer ? ' ' : '') + interimTranscript : '');

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Speech Recognition Not Supported</span>
        </div>
        <p className="text-red-600 text-sm mt-1">
          Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Speech Controls */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Recording
            </>
          )}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}

        {answer && (
          <button
            onClick={handleClearAnswer}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Clear Answer
          </button>
        )}

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Speak clearly into your microphone</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Answer Display */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[120px] focus-within:border-blue-500 transition-colors">
        <div className="text-sm text-gray-600 mb-2">Your Answer:</div>
        <div className="text-gray-800 leading-relaxed">
          {displayText ? (
            <div>
              <span>{answer}</span>
              {interimTranscript && (
                <span className="text-blue-600 bg-blue-50 px-1 rounded">
                  {interimTranscript}
                </span>
              )}
            </div>
          ) : (
            <div className="text-gray-400 italic">
              Click "Start Recording" and speak your answer...
            </div>
          )}
        </div>
        
        {displayText && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            Word count: {displayText.trim().split(/\s+/).filter(word => word.length > 0).length}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-blue-800 text-sm">
          <strong>Instructions:</strong>
          <ul className="mt-1 ml-4 list-disc space-y-1">
            <li>Click "Start Recording" and speak your answer clearly</li>
            <li>The system will transcribe your speech in real-time</li>
            <li>Click "Stop Recording" when you're finished</li>
            <li>You can start and stop multiple times to build your answer</li>
          </ul>
        </div>
      </div>
    </div>
  );
};