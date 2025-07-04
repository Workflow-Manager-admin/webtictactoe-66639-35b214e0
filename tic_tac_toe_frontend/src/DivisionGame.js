import React, { useState } from 'react';

/**
 * DivisionGame Component
 * Minimalistic division game with integer solutions, scorekeeper, answer input,
 * immediate feedback, reset option, and fully responsive layout.
 * Colors: primary (#1976d2), secondary (#388e3c), accent (#ffb300).
 */

// PUBLIC_INTERFACE
function DivisionGame() {
  // State
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [questionN, setQuestionN] = useState(1);

  // Generates a new random division problem with integer result
  function generateProblem() {
    const min = 2, max = 12;
    const divisor = Math.floor(Math.random() * (max - min + 1)) + min; // 2..12
    const quotient = Math.floor(Math.random() * (max - min + 1)) + min;
    const dividend = divisor * quotient;
    return { dividend, divisor, quotient };
  }

  // Handle answer input
  function handleInput(e) {
    // Only allow numbers, empty, or minus for negative numbers (guard)
    if (/^-?\d*$/.test(e.target.value)) {
      setUserAnswer(e.target.value);
    }
  }

  // PUBLIC_INTERFACE
  function checkAnswer(e) {
    e.preventDefault();
    setAttempted(true);
    const answer = parseInt(userAnswer, 10);
    if (answer === problem.quotient) {
      setFeedback('Correct!');
      setScore(s => s + 1);
      setTimeout(() => {
        nextProblem();
      }, 900);
    } else {
      setFeedback('Incorrect. Try next!');
      setTimeout(() => {
        nextProblem();
      }, 1200);
    }
  }

  // Next problem logic
  function nextProblem() {
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback('');
    setAttempted(false);
    setQuestionN(n => n + 1);
  }

  // Reset the whole game
  // PUBLIC_INTERFACE
  function handleReset() {
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback('');
    setScore(0);
    setAttempted(false);
    setQuestionN(1);
  }

  // Color constants (mirroring App.js)
  const COLORS = {
    primary: '#1976d2',
    secondary: '#388e3c',
    accent: '#ffb300'
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 370,
        margin: '0 auto',
        background: '#f8f9fa',
        borderRadius: 18,
        boxShadow: '0 4px 24px 1px rgba(25,118,210,0.07)',
        border: '1.5px solid #e7eaf0',
        padding: '2.2rem 1.5rem min(5vw,2.7rem) 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 340,
        position: 'relative'
      }}
      aria-label="Division Game"
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: COLORS.secondary,
          margin: '0 0 .8rem 0',
          letterSpacing: '-1px'
        }}
      >Division Game</h1>
      <div style={{
        color: '#888',
        fontSize: 13,
        marginBottom: 16,
        letterSpacing: 0.42
      }}>
        Question <span style={{ color: COLORS.primary, fontWeight: 700 }}>{questionN}</span>
      </div>
      <div
        aria-label="division equation"
        style={{
          fontSize: 'clamp(1.6rem,5vw,2.4rem)',
          fontWeight: 600,
          margin: '1.2rem 0 1.5rem 0',
          letterSpacing: 0.8
        }}
      >
        {problem.dividend} <span style={{color: COLORS.primary}}>&divide;</span> {problem.divisor} = <span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            minLength={1}
            maxLength={5}
            value={userAnswer}
            onChange={handleInput}
            disabled={feedback === 'Correct!'}
            style={{
              fontSize: 'clamp(1rem,4vw,2rem)',
              width: '3.4em',
              textAlign: 'center',
              border: `2px solid ${COLORS.primary}44`,
              borderRadius: 7,
              outline: 'none',
              background: '#fff',
              color: COLORS.secondary,
              fontWeight: 600,
              marginLeft: 8,
              marginRight: 3,
              boxShadow: (attempted && feedback === 'Correct!') ? `0 0 6px 1px ${COLORS.accent}85` :
                (attempted && feedback) ? `0 0 3px 0.5px crimson` : 'none',
              transition: 'box-shadow 0.23s'
            }}
            aria-label="Your answer"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && userAnswer.length > 0 && !feedback) {
                checkAnswer(e);
              }
            }}
          />
        </span>
      </div>
      <form
        style={{ margin: '0.5rem 0 0 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onSubmit={checkAnswer}
        autoComplete="off"
      >
        <button
          type="submit"
          disabled={userAnswer.length === 0 || !!feedback}
          style={{
            marginTop: 3,
            background: COLORS.primary,
            color: '#fff',
            borderRadius: 8,
            fontWeight: 600,
            padding: '0.56em 2.2em',
            border: 'none',
            cursor: userAnswer.length === 0 || !!feedback ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            boxShadow: `0 2px 5px rgba(25,118,210,0.09)`,
            outline: 'none',
            transition: 'background 0.22s, filter 0.15s'
          }}
          aria-label="Check answer"
        >
          Check
        </button>
      </form>
      <div
        aria-live="polite"
        style={{
          minHeight: 32,
          marginTop: 14,
          fontSize: '1.17rem',
          fontWeight: 600,
          color: feedback === 'Correct!' ? COLORS.accent : (feedback ? 'crimson' : '#4b4b4b'),
          letterSpacing: 0.23,
          transition: 'color 0.23s'
        }}
      >
        {feedback}
      </div>
      <div
        style={{
          marginTop: 25,
          marginBottom: 4,
          fontSize: 19,
          color: COLORS.primary,
          fontWeight: 700,
        }}
      >
        Score: <span style={{ color: COLORS.accent }}>{score}</span>
      </div>
      <button
        type="button"
        onClick={handleReset}
        style={{
          marginTop: 8,
          background: COLORS.secondary,
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          padding: '0.46em 2em',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          letterSpacing: 0.6,
          boxShadow: `0 1.5px 8px rgba(56,142,60,0.07)`,
          outline: 'none',
          transition: 'background 0.18s, filter 0.13s'
        }}
        aria-label="Restart Division Game"
      >
        Restart
      </button>
      <div
        style={{
          color: '#b3b3b3',
          fontSize: 12,
          margin: '1.7em 0 0 0',
          userSelect: 'none',
          textAlign: 'center'
        }}
      >
        Type your answer and press "Check" or Enter.<br />
        All equations have integer answers.
      </div>
    </div>
  );
}

export default DivisionGame;
