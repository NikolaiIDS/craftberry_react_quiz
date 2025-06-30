import React, { useEffect, useRef, useState } from 'react'
import { useQuiz } from '../../context/QuizContext';
import '../../stylesheets/questionCard.css';


type Props = {
    currentQuestionIndex: number;
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onNext: () => void;
    onBack: () => void;
    nextButtonLabel?: string;
}

const CIRCLE_RADIUS = 42;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const SVG_SIZE = 90;

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const ANIMATION_DURATION = 400; // ms

const QuestionCard: React.FC<Props> = ({callback, currentQuestionIndex, onNext, onBack, nextButtonLabel = 'Next question' }) => {
    const { getQuestionData, numQuestions, answers, setAnswer } = useQuiz();
    const data = getQuestionData(currentQuestionIndex);

    // Calculate target and previous progress for the circle
    const progress = (currentQuestionIndex + 1) / numQuestions;
    const targetOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    const prevProgress = currentQuestionIndex === 0 ? 0 : currentQuestionIndex / numQuestions;
    const prevOffset = CIRCLE_CIRCUMFERENCE * (1 - prevProgress);

    // Animated offset state
    const [animatedOffset, setAnimatedOffset] = useState(prevOffset); // Snap to previous progress on mount
    const animationRef = useRef<number | null>(null);

    // Animate from previous progress to current progress on mount
    useEffect(() => {
        setAnimatedOffset(prevOffset); // Snap to previous progress
        const delta = targetOffset - prevOffset;
        const start = performance.now();

        function animate(now: number) {
            const elapsed = now - start;
            const t = Math.min(elapsed / ANIMATION_DURATION, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
            setAnimatedOffset(prevOffset + delta * eased);
            if (t < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setAnimatedOffset(targetOffset);
            }
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Track selected option index for this question
    const selectedValue = answers[currentQuestionIndex];

    // Check if all questions are answered
    const isLastQuestion = currentQuestionIndex === numQuestions - 1;
    const allAnswered = answers.every(ans => ans && ans.trim() !== '');

    const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>, idx: number) => {
        if (!data) return;
        setAnswer(currentQuestionIndex, data.options[idx]);
        callback(e);
    };

    if (!data) return <div>No data available</div>;

    return (
        <div className="question-card-container">
            <div className="question-card">
                <h2>{data.question}</h2>
                <div className="options-container">
                    {data.options.map((option, idx) => (
                    <button
                        className={`option-button${selectedValue === option ? ' selected' : ''}`}
                        key={idx}
                        value={option}
                        onClick={e => handleOptionClick(e, idx)}
                    >
                        <span style={{marginRight: '0.5em'}}>{alphabet[idx]}. </span>{option}
                    </button>
                ))}
                </div>
                <div className="navigation-container">
                    <button className="previous-button" onClick={onBack}>Back</button>
                    <button
                        className="next-button"
                        onClick={onNext}
                        disabled={isLastQuestion && !allAnswered}
                    >
                        {nextButtonLabel} <span className="arrow-big">&rarr;</span>
                    </button>
                </div>
            </div>
            <div className="question-counter-absolute">
                <div className="question-counter-circle">
                    <svg width={SVG_SIZE} height={SVG_SIZE}>
                        <circle
                            className="counter-bg"
                            cx={SVG_SIZE/2}
                            cy={SVG_SIZE/2}
                            r={CIRCLE_RADIUS}
                            fill="none"
                            stroke="#EEF7FB"
                            strokeWidth={5}
                        />
                        <circle
                            className="counter-progress"
                            cx={SVG_SIZE/2}
                            cy={SVG_SIZE/2}
                            r={CIRCLE_RADIUS}
                            fill="none"
                            stroke="#C3EDFF"
                            strokeWidth={5}
                            strokeDasharray={CIRCLE_CIRCUMFERENCE}
                            strokeDashoffset={animatedOffset}
                            style={{ transition: 'none' }}
                        />
                    </svg>
                    <div className="counter-text">
                        <span className="current-question">{currentQuestionIndex + 1}</span>
                        <span className="slash"> / </span>
                        <span className="total-questions">{numQuestions}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionCard; 