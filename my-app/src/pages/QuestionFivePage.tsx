import React from 'react'
import QuestionCard from '../components/QuestionCard/QuestionCard'
import { useQuiz } from '../context/QuizContext'
import { useNavigate } from 'react-router-dom'
import '../stylesheets/questionPage.css'

const QuestionFivePage = () => {
  const { resetQuiz } = useQuiz();
  const navigate = useNavigate();

  // Callback for when an answer is clicked
  const handleAnswerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Selected answer:', e.currentTarget.value);
  };

  const handleNext = () => navigate('/results');
  const handleBack = () => navigate('/question-4');

  const handleReset = () => {
    resetQuiz();
    navigate('/question-1');
  };

  const currentQuestionIndex = 4;

  return (
    <div className="container">
      <button 
        onClick={handleReset}
        className="reset-button"
      >
        Reset Quiz
      </button>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <QuestionCard 
          currentQuestionIndex={currentQuestionIndex} 
          callback={handleAnswerClick} 
          onNext={handleNext}
          onBack={handleBack}
          nextButtonLabel="Finish Quiz"
        />
      </div>
    </div>
  );
}

export default QuestionFivePage 