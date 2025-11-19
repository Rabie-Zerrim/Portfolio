import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { withPrefix } from 'gatsby';
import { usePrefersReducedMotion } from '@hooks';

const walk = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(-2deg); }
  75% { transform: translateY(-5px) rotate(2deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const potionShake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
`;

const potionExplode = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.6) rotate(8deg);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.5) translateY(-30px) rotate(0deg);
    opacity: 0;
  }
`;

const sparkExplosion = keyframes`
  0% { 
    transform: translate(0, 0) scale(0) rotate(0deg); 
    opacity: 1; 
  }
  50% {
    opacity: 1;
  }
  100% { 
    transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(360deg); 
    opacity: 0; 
  }
`;

const bubble = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-30px) scale(1);
    opacity: 0;
  }
`;

const WizardContainer = styled.div`
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 9999;
  pointer-events: none;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.5s ease;
  will-change: opacity;

  @media (max-width: 768px) {
    display: none;
  }
`;

const WizardImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: contain;
  animation: ${props => props.isWalking ? walk : float} 0.8s ease-in-out infinite;
  filter: drop-shadow(0 5px 10px rgba(100, 255, 218, 0.3));
  will-change: transform;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const PotionExplosion = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ExplosionSpark = styled.div`
  position: absolute;
  top: 35%;
  right: 25%;
  width: 6px;
  height: 6px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${sparkExplosion} 1s ease-out forwards;
  --tx: ${props => props.tx};
  --ty: ${props => props.ty};
  box-shadow: 0 0 12px ${props => props.color}, 0 0 20px ${props => props.color};
  transform: translate(-50%, -50%);
  animation-play-state: ${props => (props.paused ? 'paused' : 'running')};
`;

const Bubble = styled.div`
  position: absolute;
  top: 35%;
  right: 25%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${props => props.color});
  border-radius: 50%;
  animation: ${bubble} ${props => props.duration}s ease-out forwards;
  animation-delay: ${props => props.delay}s;
  box-shadow: inset -2px -2px 4px rgba(255,255,255,0.5);
  transform: translate(${props => props.offsetX}px, ${props => props.offsetY}px);
  animation-play-state: ${props => (props.paused ? 'paused' : 'running')};
`;

const ExplosionFlash = styled.div`
  position: absolute;
  top: 35%;
  right: 25%;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(138,43,226,0.6) 40%, transparent 70%);
  border-radius: 50%;
  animation: ${potionExplode} 0.6s ease-out forwards;
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation-play-state: ${props => (props.paused ? 'paused' : 'running')};
`;

const SparkleEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const Sparkle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--green);
  border-radius: 50%;
  animation: sparkleAnimation 1s ease-out forwards;
  box-shadow: 0 0 10px var(--green);

  @keyframes sparkleAnimation {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(${props => props.x}px, ${props => props.y}px) scale(0);
    }
  }
`;

const WalkingWizard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const [showPotion, setShowPotion] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const sparkleId = useRef(0);
  const walkTimeout = useRef(null);
  const explosionId = useRef(0);
  const bubbleId = useRef(0);
  const scrollTimeout = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Determine if scrolling
      if (Math.abs(scrollTop - lastScrollY.current) > 10) {
        setIsWalking(true);
        
        // mark user scrolling for a short period to avoid heavy animations
        setIsUserScrolling(true);
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => setIsUserScrolling(false), 200);

        // Create sparkles while walking if not currently in heavy scroll
        if (!document.body.classList.contains('is-scrolling') && Math.random() > 0.8) {
          createSparkle();
        }
      }

      lastScrollY.current = scrollTop;

      // Show wizard after scrolling a bit
      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Stop walking animation after scroll stops
      clearTimeout(walkTimeout.current);
      walkTimeout.current = setTimeout(() => {
        setIsWalking(false);
      }, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(walkTimeout.current);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  const createSparkle = () => {
    const id = sparkleId.current++;
    const newSparkle = {
      id,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    };

    setSparkles(prev => [...prev, newSparkle]);

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 1000);
  };

  const createBubbles = () => {
    const colors = ['rgba(138,43,226,0.6)', 'rgba(147,112,219,0.6)', 'rgba(186,85,211,0.6)'];
    const newBubbles = Array.from({ length: 5 }, () => ({
      id: bubbleId.current++,
      offsetX: (Math.random() - 0.5) * 10,
      offsetY: (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 6,
      duration: 1 + Math.random() * 0.5,
      delay: Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setBubbles(prev => [...prev, ...newBubbles]);

    setTimeout(() => {
      setBubbles(prev => prev.filter(b => !newBubbles.find(nb => nb.id === b.id)));
    }, 2000);
  };

  const createPotionExplosion = () => {
    // Do not trigger explosions while scrolling, hidden, or reduced-motion requested
    if (typeof document !== 'undefined' && (document.hidden || document.body.classList.contains('is-scrolling') || isUserScrolling || prefersReducedMotion)) return;
    const colors = ['#FF1493', '#FF69B4', '#8A2BE2', '#9370DB', '#BA55D3', '#DDA0DD', '#FFD700', '#FFA500'];
    const newExplosion = {
      id: explosionId.current++,
      sparks: Array.from({ length: 20 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 20;
        const distance = 60 + Math.random() * 30;
        return {
          id: i,
          color: colors[Math.floor(Math.random() * colors.length)],
          tx: `${Math.cos(angle) * distance}px`,
          ty: `${Math.sin(angle) * distance}px`,
        };
      }),
    };

    // Create bubbles before explosion
    createBubbles();

    // Trigger explosion after bubbles
    setTimeout(() => {
      setShowPotion(false);
      setExplosions(prev => [...prev, newExplosion]);
    }, 300);

    // Remove explosion and reset potion
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== newExplosion.id));
      setShowPotion(true);
    }, 1300);
  };

  // Trigger potion explosion every 10 seconds
  useEffect(() => {
    const explosionInterval = setInterval(() => {
      if (isVisible) {
        createPotionExplosion();
      }
    }, 10000);

    return () => clearInterval(explosionInterval);
  }, [isVisible]);

  return (
    <WizardContainer isVisible={isVisible}>
      <SparkleEffect>
        {sparkles.map(sparkle => (
          <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
        ))}
      </SparkleEffect>
      
      <WizardImage
        src={withPrefix('/rabie-wizard.png')}
        alt="Wizard"
        isWalking={isWalking}
        onError={(e) => {
          // Fallback to old wizard if new one doesn't exist
          e.target.src = withPrefix('/rabio.png');
        }}
      />
      
      {bubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          offsetX={bubble.offsetX}
          offsetY={bubble.offsetY}
          size={bubble.size}
          duration={bubble.duration}
          delay={bubble.delay}
          color={bubble.color}
          paused={isUserScrolling || prefersReducedMotion}
        />
      ))}
      
      {explosions.map(explosion => (
        <React.Fragment key={explosion.id}>
          <ExplosionFlash paused={isUserScrolling || prefersReducedMotion} />
          <PotionExplosion>
            {explosion.sparks.map(spark => (
              <ExplosionSpark
                key={spark.id}
                color={spark.color}
                tx={spark.tx}
                ty={spark.ty}
                paused={isUserScrolling || prefersReducedMotion}
              />
            ))}
          </PotionExplosion>
        </React.Fragment>
      ))}
    </WizardContainer>
  );
};

export default WalkingWizard;
