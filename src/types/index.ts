export interface Question {
  id: string;
  question: string;
  topic: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  marks: number;
}

export interface CameraStatus {
  isEnabled: boolean;
  hasPermission: boolean;
  stream?: MediaStream;
  error?: string;
}

export interface InterviewSession {
  topic: string;
  questions: Question[];
  answers: Answer[];
  startTime: Date;
  endTime?: Date;
  totalMarks: number;
  isCompleted: boolean;
}

export interface InterviewResult {
  topic: string;
  totalQuestions: number;
  answeredQuestions: number;
  totalMarks: number;
  answers: Answer[];
  feedback: string;
}