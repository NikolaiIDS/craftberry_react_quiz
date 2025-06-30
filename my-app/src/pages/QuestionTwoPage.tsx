import React from 'react'
import QuestionCard from '../components/QuestionCard/QuestionCard'
import { useQuiz } from '../context/QuizContext'
import { useNavigate } from 'react-router-dom'
import '../stylesheets/questionPage.css'

const QuestionTwoPage = () => {
  const { resetQuiz } = useQuiz();
  const navigate = useNavigate();

  // Callback for when an answer is clicked
  const handleAnswerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Selected answer:', e.currentTarget.value);
  };

  const handleNext = () => navigate('/question-3');
  const handleBack = () => navigate('/question-1');

  const handleReset = () => {
    resetQuiz();
    navigate('/question-1');
  };

  const currentQuestionIndex = 1;

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
        />
      </div>
    </div>
  );
}

export default QuestionTwoPage 