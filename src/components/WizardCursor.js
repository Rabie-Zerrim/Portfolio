import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const sparkle = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(180deg);
    opacity: 0;
  }
`;

const CursorContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  mix-blend-mode: difference;
  will-change: transform;

  @media (max-width: 768px) {
    display: none;
  }
`;

const WandCursor = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  transform: translate(-10px, -10px) rotate(-45deg);
  transition: transform 0.2s, filter 0.2s;
  filter: drop-shadow(0 0 8px rgba(100, 255, 218, 0.6));
  pointer-events: none;
  will-change: transform, filter;
  
  ${props => props.isClicking && `
    transform: translate(-10px, -10px) rotate(-45deg) scale(1.2);
    filter: drop-shadow(0 0 15px rgba(100, 255, 218, 0.8)) brightness(1.3);
  `}
  
  ${props => props.isHovering && `
    transform: translate(-10px, -10px) rotate(-45deg) scale(1.15);
    filter: drop-shadow(0 0 12px rgba(100, 255, 218, 0.7)) brightness(1.2);
  `}
`;

const FallbackCursor = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--green);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const TrailContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Sparkle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--green);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${sparkle} 0.6s ease-out forwards;
  box-shadow: 0 0 10px var(--green);
`;

const WizardCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const trailLength = 20;
  const sparkleId = useRef(0);

  useEffect(() => {
    let animationFrameId;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update position immediately
      setPosition({ x, y });

      // Add to trail
      setTrail(prev => {
        const newTrail = [{ x, y }, ...prev.slice(0, trailLength - 1)];
        return newTrail;
      });

      // Create sparkles when moving fast
      const speed = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      if (speed > 5) {
        createSparkle(x, y);
      }

      lastX = x;
      lastY = y;

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.onclick !== null ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      createSparkle(position.x, position.y);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position]);

  const createSparkle = (x, y) => {
    const id = sparkleId.current++;
    const newSparkle = {
      id,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
    };

    setSparkles(prev => [...prev, newSparkle]);

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 600);
  };

  useEffect(() => {
    // Preload wand image
    const img = new Image();
    img.src = '/wooden-stick.png';
    img.onload = () => {
      console.log('Wand image loaded successfully!');
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('Failed to load wand image, using fallback cursor');
      setImageLoaded(false);
    };

    // Always show wand immediately (optimistic loading)
    setImageLoaded(true);

    // Hide default cursor
    document.body.style.cursor = 'none';
    const allElements = document.querySelectorAll('a, button, input, textarea, select');
    allElements.forEach(el => {
      el.style.cursor = 'none';
    });

    return () => {
      document.body.style.cursor = 'auto';
      allElements.forEach(el => {
        el.style.cursor = '';
      });
    };
  }, []);

  return (
    <CursorContainer>
      {/* Trail effect */}
      <TrailContainer>
        {trail.map((point, index) => {
          const opacity = (1 - index / trailLength) * 0.5;
          const size = 3 * (1 - index / trailLength);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={size}
              fill="var(--green)"
              opacity={opacity}
            />
          );
        })}
      </TrailContainer>

      {/* Wand cursor */}
      <WandCursor
        src="/wooden-stick.png"
        alt="Wand"
        isClicking={isClicking}
        isHovering={isHovering}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
          }}
        />
      ))}
    </CursorContainer>
  );
};

export default WizardCursor;
