import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/HomePage.css';
import bgImage from '../assets/90155e769545e9b86afd1e9c431704007c1c0714.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="homepage-bg"
      style={{
        // Set the background image via CSS variable
        ['--homepage-bg' as any]: `url(${bgImage})`
      }}
    >
      <div className="homepage-overlay" />
      <div className="homepage-content">
        <h1 className="homepage-title">
          Build a self care routine<br />suitable for you
        </h1>
        <p className="homepage-subtitle">
          Take out test to get a personalised self care<br />routine based on your needs.
        </p>
        <button
          className="start-button"
          onClick={() => navigate('/question-1')}
        >
          Start the quiz
        </button>
      </div>
    </div>
  );
};

export default HomePage; 