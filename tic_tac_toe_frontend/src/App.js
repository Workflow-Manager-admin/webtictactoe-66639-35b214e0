import React, { useState } from 'react';
import './App.css';

/**
 * Minimalist Tic Tac Toe Board + Logic, Light Theme, Responsive
 */

// Styling variables based on requirements
const COLORS = {
  primary: '#1976d2',
  secondary: '#388e3c',
  accent: '#ffb300',
};

/**
 * Calculate Winner
 * @param {Array} squares - current board state
 * @returns 'X' | 'O' | null
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6], // diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

/**
 * Check Draw
 * @param {Array} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

/**
 * PUBLIC_INTERFACE
 * Tic Tac Toe Game App
 */
function App() {
  // X always goes first
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const draw = isDraw(squares);

  // Handle a user's move
  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (squares[idx] || winner) return; // Square filled or game done
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let statusMsg;
  if (winner) {
    statusMsg = (
      <span>
        <strong style={{ color: COLORS.accent }}>
          {winner}
        </strong> wins!
      </span>
    );
  } else if (draw) {
    statusMsg = <span>It's a draw!</span>;
  } else {
    statusMsg = (
      <span>
        Next: <strong style={{ color: xIsNext ? COLORS.primary : COLORS.secondary }}>
          {xIsNext ? 'X' : 'O'}
        </strong>
      </span>
    );
  }

  return (
    <div
      className="App"
      style={{
        background: '#fff',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background 0.3s'
      }}
    >
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'min(7vw, 5rem)'
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-1px',
            color: COLORS.primary,
          }}
        >Tic Tac Toe</h1>
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            margin: '1.2rem 0 1rem 0',
            minHeight: 32,
            fontSize: '1.1rem',
            color: '#333',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {statusMsg}
        </div>
        <TicTacToeBoard
          squares={squares}
          onClick={handleSquareClick}
          winner={winner}
        />

        <button
          type="button"
          onClick={handleReset}
          aria-label="Restart game"
          style={{
            display: 'block',
            margin: '2rem auto 0 auto',
            background: COLORS.primary,
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0.55rem 2.5rem',
            border: 'none',
            borderRadius: 7,
            boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
            cursor: 'pointer',
            letterSpacing: 0.8,
            transition: 'background 0.22s, filter 0.16s',
          }}
          tabIndex={0}
        >
          Reset Game
        </button>
      </main>
      <footer
        style={{
          marginTop: 'auto',
          padding: '1.75rem 0 0.6rem 0',
          fontSize: 13,
          color: '#bbb',
          letterSpacing: 0.5,
        }}
      >
        Made with <span style={{color:COLORS.accent}}>♥</span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Renders the 3x3 Tic Tac Toe board
 */
function TicTacToeBoard({ squares, onClick, winner }) {
  // Square rendering helper
  const renderSquare = (idx) => (
    <button
      className="ttt-square"
      key={idx}
      onClick={() => onClick(idx)}
      disabled={!!squares[idx] || !!winner}
      aria-label={`Play on square ${idx%3+1},${Math.floor(idx/3)+1}`}
      style={{
        width: 'min(20vw,84px)',
        height: 'min(20vw,84px)',
        fontSize: 'clamp(2rem, 7vw, 2.8rem)',
        fontWeight: 700,
        background: '#fff',
        color: squares[idx] === 'X' ? COLORS.primary : (squares[idx] === 'O' ? COLORS.secondary : '#222'),
        border: `2.6px solid ${COLORS.primary}33`,
        boxShadow: squares[idx] ? '0 2px 10px rgba(25, 118, 210, 0.04)' : 'none',
        borderRadius: 12,
        transition: 'background 0.11s, box-shadow 0.11s, color 0.20s',
        cursor: squares[idx] || winner ? 'not-allowed' : 'pointer',
        outline: winner ? '2.5px solid ' + COLORS.accent : 'none'
      }}
      tabIndex={0}
    >
      {squares[idx]}
    </button>
  );

  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        padding: 16,
        background: '#f8f9fa',
        borderRadius: 16,
        boxShadow: '0 4px 24px 1px rgba(25, 118, 210, 0.07)',
        border: `1.5px solid #e7eaf0`,
        margin: '0 auto',
      }}
      role="grid"
      aria-label="tic tac toe board"
    >
      {Array(9).fill(0).map((_, idx) => renderSquare(idx))}
    </div>
  );
}

export default App;
