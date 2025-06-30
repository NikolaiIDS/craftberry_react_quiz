import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import HomePage from './pages/HomePage';
import QuestionOnePage from './pages/QuestionOnePage';
import QuestionTwoPage from './pages/QuestionTwoPage';
import QuestionThreePage from './pages/QuestionThreePage';
import QuestionFourPage from './pages/QuestionFourPage';
import QuestionFivePage from './pages/QuestionFivePage';
import ResultsPage from './pages/ResultsPage';
//import ResultsPage from './pages/ResultsPage';

const App: React.FC = () => (
  <QuizProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/question-1" element={<QuestionOnePage />} />
        <Route path="/question-2" element={<QuestionTwoPage />} />
        <Route path="/question-3" element={<QuestionThreePage />} />
        <Route path="/question-4" element={<QuestionFourPage />} />
        <Route path="/question-5" element={<QuestionFivePage />} />
        <Route path="/results" element={<ResultsPage />} />
        {/* Redirect any unknown route to / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </QuizProvider>
);

export default App;
