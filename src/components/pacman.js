import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Canvas = styled.canvas`
  border: 2px solid var(--green);
  background-color: #000;
  box-shadow: 0 0 20px var(--green);
`;

const GameInfo = styled.div`
  color: var(--green);
  font-family: var(--font-mono);
  margin-top: 20px;
  font-size: 18px;
  display: flex;
  gap: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 2px solid var(--green);
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: var(--green-tint);
    transform: scale(1.05);
  }
`;

const Instructions = styled.div`
  color: var(--slate);
  font-family: var(--font-mono);
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
`;

const PacmanGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameStateRef = useRef({
    pacman: { x: 1, y: 1, direction: 'right' },
    ghosts: [],
    dots: [],
    score: 0,
    lives: 3,
    gameOver: false,
  });

  useEffect(() => {
    // Trigger achievement when game opens
    window.dispatchEvent(new CustomEvent('achievement:pacman'));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellSize = 20;
    const cols = 28;
    const rows = 20;

    // Simple maze (1 = wall, 0 = path with dot, 2 = path without dot)
    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,0,1,1,1,1,1],
      [1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1],
      [1,1,1,1,1,0,1,1,2,1,1,1,2,2,2,2,1,1,1,2,1,1,0,1,1,1,1,1],
      [2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2],
      [1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1],
      [1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1],
      [1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    // Initialize dots
    const dots = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (maze[row][col] === 0) {
          dots.push({ x: col, y: row });
        }
      }
    }

    // Initialize game state
    gameStateRef.current = {
      pacman: { x: 1, y: 1, direction: 'right', nextDirection: 'right' },
      ghosts: [
        { x: 13, y: 9, direction: 'left', color: '#FF0000' },
        { x: 14, y: 9, direction: 'right', color: '#FFB8FF' },
        { x: 13, y: 10, direction: 'up', color: '#00FFFF' },
        { x: 14, y: 10, direction: 'down', color: '#FFB852' },
      ],
      dots: dots,
      score: 0,
      lives: 3,
      gameOver: false,
      maze: maze,
    };

    const drawMaze = () => {
      ctx.fillStyle = '#1a1a2e';
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (maze[row][col] === 1) {
            ctx.fillStyle = '#0f3460';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeStyle = '#16213e';
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    const drawDots = () => {
      ctx.fillStyle = '#FFD700';
      gameStateRef.current.dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(
          dot.x * cellSize + cellSize / 2,
          dot.y * cellSize + cellSize / 2,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    const drawPacman = () => {
      const p = gameStateRef.current.pacman;
      const centerX = p.x * cellSize + cellSize / 2;
      const centerY = p.y * cellSize + cellSize / 2;
      const radius = cellSize / 2 - 2;

      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      
      let startAngle, endAngle;
      switch (p.direction) {
        case 'right':
          startAngle = 0.2;
          endAngle = 1.8;
          break;
        case 'left':
          startAngle = 1.2;
          endAngle = 2.8;
          break;
        case 'up':
          startAngle = 1.7;
          endAngle = 1.3;
          break;
        case 'down':
          startAngle = 0.7;
          endAngle = 2.3;
          break;
        default:
          startAngle = 0.2;
          endAngle = 1.8;
      }

      ctx.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
    };

    const drawGhosts = () => {
      gameStateRef.current.ghosts.forEach(ghost => {
        const centerX = ghost.x * cellSize + cellSize / 2;
        const centerY = ghost.y * cellSize + cellSize / 2;
        const radius = cellSize / 2 - 2;

        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, radius, Math.PI, 0, false);
        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.lineTo(centerX + radius / 2, centerY + radius - 3);
        ctx.lineTo(centerX, centerY + radius);
        ctx.lineTo(centerX - radius / 2, centerY + radius - 3);
        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY - 2, 3, 0, Math.PI * 2);
        ctx.arc(centerX + 3, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY - 2, 1.5, 0, Math.PI * 2);
        ctx.arc(centerX + 3, centerY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const canMove = (x, y) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
      return maze[y][x] !== 1;
    };

    const movePacman = () => {
      const p = gameStateRef.current.pacman;
      let newX = p.x;
      let newY = p.y;

      // Try to change direction
      let nextX = p.x;
      let nextY = p.y;
      switch (p.nextDirection) {
        case 'up': nextY--; break;
        case 'down': nextY++; break;
        case 'left': nextX--; break;
        case 'right': nextX++; break;
      }

      if (canMove(nextX, nextY)) {
        p.direction = p.nextDirection;
      }

      // Move in current direction
      switch (p.direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }

      if (canMove(newX, newY)) {
        p.x = newX;
        p.y = newY;

        // Check for dot collision
        const dotIndex = gameStateRef.current.dots.findIndex(
          dot => dot.x === p.x && dot.y === p.y
        );
        if (dotIndex !== -1) {
          gameStateRef.current.dots.splice(dotIndex, 1);
          gameStateRef.current.score += 10;
          setScore(gameStateRef.current.score);
        }
      }
    };

    const moveGhosts = () => {
      gameStateRef.current.ghosts.forEach(ghost => {
        const directions = ['up', 'down', 'left', 'right'];
        let validMoves = [];

        directions.forEach(dir => {
          let newX = ghost.x;
          let newY = ghost.y;
          switch (dir) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
          }
          if (canMove(newX, newY)) {
            validMoves.push({ dir, x: newX, y: newY });
          }
        });

        if (validMoves.length > 0) {
          // Simple AI: sometimes follow pacman, sometimes random
          const p = gameStateRef.current.pacman;
          if (Math.random() < 0.3) {
            // Chase pacman
            validMoves.sort((a, b) => {
              const distA = Math.abs(a.x - p.x) + Math.abs(a.y - p.y);
              const distB = Math.abs(b.x - p.x) + Math.abs(b.y - p.y);
              return distA - distB;
            });
          } else {
            // Random move
            validMoves = validMoves.sort(() => Math.random() - 0.5);
          }

          const move = validMoves[0];
          ghost.x = move.x;
          ghost.y = move.y;
          ghost.direction = move.dir;
        }
      });
    };

    const checkCollisions = () => {
      const p = gameStateRef.current.pacman;
      const collision = gameStateRef.current.ghosts.some(
        ghost => ghost.x === p.x && ghost.y === p.y
      );

      if (collision) {
        gameStateRef.current.lives--;
        setLives(gameStateRef.current.lives);

        if (gameStateRef.current.lives <= 0) {
          gameStateRef.current.gameOver = true;
        } else {
          // Reset positions
          gameStateRef.current.pacman = { x: 1, y: 1, direction: 'right', nextDirection: 'right' };
          gameStateRef.current.ghosts = [
            { x: 13, y: 9, direction: 'left', color: '#FF0000' },
            { x: 14, y: 9, direction: 'right', color: '#FFB8FF' },
            { x: 13, y: 10, direction: 'up', color: '#00FFFF' },
            { x: 14, y: 10, direction: 'down', color: '#FFB852' },
          ];
        }
      }
    };

    const gameLoop = () => {
      if (gameStateRef.current.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'var(--green)';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px monospace';
        ctx.fillText(`Final Score: ${gameStateRef.current.score}`, canvas.width / 2, canvas.height / 2 + 40);
        return;
      }

      if (gameStateRef.current.dots.length === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'var(--green)';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px monospace';
        ctx.fillText(`Final Score: ${gameStateRef.current.score}`, canvas.width / 2, canvas.height / 2 + 40);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMaze();
      drawDots();
      movePacman();
      moveGhosts();
      checkCollisions();
      drawPacman();
      drawGhosts();
    };

    const handleKeyPress = (e) => {
      const p = gameStateRef.current.pacman;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          p.nextDirection = 'up';
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          p.nextDirection = 'down';
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          p.nextDirection = 'left';
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          p.nextDirection = 'right';
          e.preventDefault();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const interval = setInterval(gameLoop, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <GameContainer>
      <CloseButton onClick={onClose}>ESC - Close</CloseButton>
      <Canvas ref={canvasRef} width={560} height={400} />
      <GameInfo>
        <span>Score: {score}</span>
        <span>Lives: {'❤️'.repeat(lives)}</span>
      </GameInfo>
      <Instructions>
        Use Arrow Keys or WASD to move • Collect all dots • Avoid the ghosts!
      </Instructions>
    </GameContainer>
  );
};

export default PacmanGame;
