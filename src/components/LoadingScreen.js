import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a192f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
  opacity: ${props => props.isHiding ? 0 : 1};
  visibility: ${props => props.isHiding ? 'hidden' : 'visible'};
  pointer-events: ${props => props.isHiding ? 'none' : 'all'};
  will-change: opacity, visibility;
`;

const WizardContainer = styled.div`
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: 40px;
  filter: drop-shadow(0 10px 30px rgba(100, 255, 218, 0.3));
`;

const WizardImage = styled.img`
  width: 150px;
  height: 188px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  animation: ${pulse} 2s ease-in-out infinite;
  will-change: transform, opacity;
  display: block;
`;

const LoadingTitle = styled.h1`
  color: var(--green);
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 600;
  margin: 0 0 20px;
  font-family: var(--font-mono);
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
  
  span {
    color: var(--lightest-slate);
  }
`;

const LoadingSubtitle = styled.p`
  color: var(--slate);
  font-size: 18px;
  font-family: var(--font-mono);
  margin: 0 0 40px;
  letter-spacing: 2px;
`;

const ProgressBarContainer = styled.div`
  width: 400px;
  max-width: 80%;
  height: 30px;
  background: var(--navy-shadow);
  border: 2px solid var(--green);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(
    90deg,
    var(--green) 0%,
    #64ffda 50%,
    var(--green) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s linear infinite;
  transition: width 0.3s ease-out;
  border-radius: 13px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: ${shimmer} 1.5s linear infinite;
  }
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const LoadingMessages = styled.div`
  margin-top: 20px;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 14px;
  min-height: 20px;
  text-align: center;
`;

const EasterEggHint = styled.div`
  position: absolute;
  bottom: 30px;
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: 12px;
  opacity: 0.6;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const LoadingScreen = ({ isLoading, onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing wizard powers...');
  const [isHiding, setIsHiding] = useState(false);

  const loadingMessages = [
    'Initializing wizard powers...',
    'Brewing coffee with magic...',
    'Loading projects from the cloud...',
    'Compiling spellbooks...',
    'Summoning tech stacks...',
    'Enchanting user interface...',
    'Casting performance optimizations...',
    'Preparing portfolio magic...',
    'Almost ready to enchant you...',
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentProgress = 0;
    let messageIndex = 0;

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        
        setTimeout(() => {
          setIsHiding(true);
          setTimeout(() => {
            if (onLoadComplete) {
              onLoadComplete();
            }
          }, 500);
        }, 500);
      }
      
      setProgress(Math.min(currentProgress, 100));
      
      // Update message
      const newMessageIndex = Math.floor((currentProgress / 100) * loadingMessages.length);
      if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
        messageIndex = newMessageIndex;
        setMessage(loadingMessages[messageIndex]);
      }
    }, 300);

    // Failsafe: Always complete after 5 seconds
    const failsafe = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setIsHiding(true);
      setTimeout(() => {
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 500);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(failsafe);
    };
  }, [isLoading, onLoadComplete]);

  if (!isLoading && !isHiding) return null;

  return (
    <LoadingContainer isHiding={isHiding}>
        <style>{`\n        body.is-scrolling .loading-wizard,\n        body.is-scrolling .loading-wizard img,\n        body.is-scrolling .loading-pulse,\n        body.is-scrolling .loading-shimmer {\n          animation-play-state: paused !important;\n        }\n      `}</style>

        <WizardContainer className="loading-wizard">
          <WizardImage 
            className="loading-pulse"
            src={withPrefix('/rabie-wizard.png')}
            alt="Loading Wizard"
            onError={(e) => {
              // Fallback to old wizard if new one doesn't exist
              e.target.src = withPrefix('/rabio.png');
            }}
          />
        </WizardContainer>
      
      <LoadingTitle>
        <span>Loading</span> Portfolio
      </LoadingTitle>
      
      <LoadingSubtitle>{message}</LoadingSubtitle>
      
      <ProgressBarContainer>
        <ProgressBarFill className="loading-shimmer" progress={progress} />
        <ProgressText>{Math.round(progress)}%</ProgressText>
      </ProgressBarContainer>
      
      <LoadingMessages>
        {progress < 100 && '✨ Crafting something magical...'}
        {progress === 100 && '🎉 Ready to explore!'}
      </LoadingMessages>
      
      <EasterEggHint>
        💡 Hint: Try pressing MMM or the Konami code...
      </EasterEggHint>
    </LoadingContainer>
  );
};

export default LoadingScreen;
