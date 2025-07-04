import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Minimalistic, Responsive Snake Game
 * Uses accent (#ffb300), primary (#1976d2), and secondary (#388e3c) per requirements.
 * Layout: Score above, board centered, restart below. Supports keyboard and touch (swipe).
 */

// Color constants
const COLORS = {
  boardBg: '#f8f9fa',
  snake: '#1976d2',
  food: '#ffb300',
  boardBorder: '#e7eaf0',
  score: '#388e3c',
  accent: '#ffb300'
};
const BOARD_SIZE = 16; // 16x16 grid
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 }
];

const DIR_MAP = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function getRandomFood(snake) {
  let pos;
  while (!pos || snake.some(seg => seg.x === pos.x && seg.y === pos.y)) {
    pos = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  }
  return pos;
}

// PUBLIC_INTERFACE
function SnakeGame() {
  // Game State
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dir, setDir] = useState(DIR_MAP.ArrowRight);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [lastDirKey, setLastDirKey] = useState('ArrowRight');

  // Ref for holding latest direction across re-renders in timer
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const runningRef = useRef(running);
  runningRef.current = running;

  // Move snake at interval
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const next = {
          x: prevSnake[0].x + dirRef.current.x,
          y: prevSnake[0].y + dirRef.current.y
        };
        // Hit wall
        if (
          next.x < 0 || next.x >= BOARD_SIZE ||
          next.y < 0 || next.y >= BOARD_SIZE
        ) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }
        // Hit self
        if (prevSnake.some(seg => seg.x === next.x && seg.y === next.y)) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }
        let ateFood = (next.x === food.x && next.y === food.y);
        let newSnake;
        if (ateFood) {
          newSnake = [next, ...prevSnake];
          setFood(getRandomFood([next, ...prevSnake]));
          setScore(s => s + 1);
        } else {
          newSnake = [next, ...prevSnake.slice(0, prevSnake.length - 1)];
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [food, running]);

  // Keyboard input for direction
  useEffect(() => {
    if (!running) return;
    const onKeyDown = (e) => {
      if (!DIR_MAP[e.key]) return;
      // No immediate reversal
      const { x, y } = DIR_MAP[e.key];
      const { x: px, y: py } = dirRef.current;
      if (x === -px && y === -py) return;
      setDir(DIR_MAP[e.key]);
      setLastDirKey(e.key);
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [running]);

  // Mobile touch/swipe support
  const touchStartRef = useRef(null);
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = [touch.clientX, touch.clientY];
  };
  const onTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const [sx, sy] = touchStartRef.current;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - sx;
    const dy = touch.clientY - sy;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    // Decide direction: no reversal allowed
    let newDir = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      newDir = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
    } else {
      newDir = dy > 0 ? 'ArrowDown' : 'ArrowUp';
    }
    const { x, y } = DIR_MAP[newDir];
    const { x: px, y: py } = dirRef.current;
    if (x === -px && y === -py) return;
    setDir(DIR_MAP[newDir]);
    setLastDirKey(newDir);
  };

  // PUBLIC_INTERFACE
  const handleRestart = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDir(DIR_MAP.ArrowRight);
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setRunning(true);
    setLastDirKey('ArrowRight');
  }, []);

  // For accessibility: restart on Enter if focused
  const restartBtnRef = useRef();

  // Board rendering:
  // Render each cell as a square div. Snake head has accent border, body primary.
  // Responsive: board max-width 96vw on mobile, 32rem max on desktop, square aspect.
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'min(4vw,2.4rem) 0'
      }}>
      {/* Score */}
      <div style={{
        color: COLORS.score, fontWeight: 700,
        fontSize: 'clamp(1.2rem, 3vw, 2rem)',
        marginBottom: 10, letterSpacing: 0.7
      }}>
        Score: <span style={{ color: COLORS.accent }}>{score}</span>
      </div>
      {/* Game Board */}
      <div
        tabIndex={0}
        role="presentation"
        aria-label="snake board"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          // Fixed size grid, clamp for responsiveness
          width: 'clamp(260px,64vw,420px)',
          aspectRatio: '1',
          background: COLORS.boardBg,
          border: `2.5px solid ${COLORS.boardBorder}`,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.08)',
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
          const x = i % BOARD_SIZE, y = Math.floor(i / BOARD_SIZE);
          const head = snake[0].x === x && snake[0].y === y;
          const body = !head && snake.some(seg => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid #eee',
                background: head
                  ? COLORS.snake
                  : (body ? '#e3eefc' : COLORS.boardBg),
                borderRadius: head || body ? 6 : 3,
                borderWidth: head ? 2 : 1,
                borderColor: head ? COLORS.accent : '#eee',
                borderStyle: 'solid',
                position: 'relative',
                transition: 'background 0.09s, border 0.13s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              aria-label={
                head ? 'snake head' : (body ? 'snake body' : (isFood ? 'food' : 'cell'))
              }
            >
              {/* Render food as a minimal dot */}
              {isFood && (
                <div style={{
                  width: '67%',
                  height: '67%',
                  minWidth: 13,
                  minHeight: 13,
                  maxWidth: 28,
                  maxHeight: 28,
                  borderRadius: '50%',
                  background: COLORS.food,
                  boxShadow: '0 2px 7px 0 #ffb3003a',
                  border: '2.2px solid #ffaa00',
                }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Game Over */}
      {gameOver &&
        <div style={{
          color: COLORS.snake,
          margin: '1.3rem .5rem 0 .5rem',
          fontWeight: 700,
          fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
          background: '#fff6e1',
          border: `2.5px solid ${COLORS.food}`,
          boxShadow: '0 2px 8px #ffb30020',
          borderRadius: 10,
          padding: '0.6em 1.3em',
          letterSpacing: 0.8
        }}>
          Game Over!
        </div>
      }
      {/* Restart Button */}
      <button
        ref={restartBtnRef}
        style={{
          display: 'block',
          margin: '1.5rem auto 0 auto',
          background: COLORS.primary,
          color: '#fff',
          fontWeight: 600,
          fontSize: '1.07rem',
          padding: '0.55em 2.3em',
          border: 'none',
          borderRadius: 9,
          cursor: 'pointer',
          letterSpacing: 0.7,
          boxShadow: '0 2px 11px rgba(25,118,210,0.06)',
          transition: 'background 0.20s, filter 0.13s',
        }}
        onClick={handleRestart}
        tabIndex={0}
        aria-label="Restart Snake Game"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRestart();
            restartBtnRef.current && restartBtnRef.current.blur();
          }
        }}
      >
        Restart
      </button>
      {/* Mobile hint */}
      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          color: '#b6b6b6',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        Use arrow keys or swipe to play
      </div>
    </div>
  );
}

export default SnakeGame;
