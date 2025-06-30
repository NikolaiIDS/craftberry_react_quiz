import React, { createContext, useContext, useState } from 'react';
import { questions as importedQuestions } from '../data/questions';

// Define the Question type locally
export type Question = {
  id: number;
  question: string;
  options: string[];
};

// Answers is now an array of strings, one per question (index matches question order)
export type QuizAnswers = string[];

type QuizContextType = {
  questions: Question[];
  numQuestions: number;
  answers: QuizAnswers;
  setAnswer: (questionIndex: number, answer: string) => void;
  resetQuiz: () => void;
  getQuestionData: (questionIndex: number) => Question | undefined;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within QuizProvider');
  return context;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(importedQuestions);
  const numQuestions = questions.length;
  // Initialize answers as an array of empty strings, one per question
  const [answers, setAnswers] = useState<QuizAnswers>(Array(numQuestions).fill(''));

  const setAnswer = (questionIndex: number, answer: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = answer;
      return updated;
    });
  };

  const resetQuiz = () => setAnswers(Array(numQuestions).fill(''));

  const getQuestionData = (questionIndex: number) => {
    if (questionIndex < 0 || questionIndex >= numQuestions) return undefined;
    return questions[questionIndex];
  };

  return (
    <QuizContext.Provider value={{ questions, numQuestions, answers, setAnswer, resetQuiz, getQuestionData }}>
      {children}
    </QuizContext.Provider>
  );
};