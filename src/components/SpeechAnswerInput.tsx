import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const SpeechAnswerInput: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    abortListening,
  } = useSpeechRecognition({
    onResult: (result) => {
      if (result.isFinal) {
        setAnswer((prev) => prev + (prev ? ' ' : '') + result.transcript);
        setInterim('');
      } else {
        setInterim(result.transcript);
      }
      setError(null);
    },
    onError: (msg) => {
      setError(msg);
      setIsRecording(false);
    },
    continuous: true,
  });

  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening]);

  if (!isSupported) {
    return (
      <p style={{ color: 'red', padding: 20 }}>
        ❌ Your browser does not support speech recognition. Use Chrome or Edge.
      </p>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>🎤 Speech + Typing Input</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={isRecording ? stopListening : startListening}
          style={{
            background: isRecording ? 'red' : 'green',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <button
          onClick={() => {
            abortListening();
            setAnswer('');
            setInterim('');
            setError(null);
          }}
          style={{
            marginLeft: 10,
            background: 'gray',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Manual + Interim Typing Area */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type or speak your answer..."
        rows={5}
        style={{
          width: '100%',
          padding: 10,
          fontSize: 16,
          border: '1px solid #ccc',
          borderRadius: 4,
          resize: 'vertical',
        }}
      />

      {/* Live interim transcript while speaking */}
      {interim && (
        <p style={{ marginTop: 8, color: 'blue', fontStyle: 'italic' }}>
          🗣️ Listening: <span>{interim}</span>
        </p>
      )}
    </div>
  );
};
