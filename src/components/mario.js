import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';

const GameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #5c94fc;
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
  border: 3px solid #000;
  background: #5c94fc;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const GameInfo = styled.div`
  color: #FFF;
  font-family: 'Press Start 2P', monospace, var(--font-mono);
  margin-top: 20px;
  font-size: 14px;
  display: flex;
  gap: 40px;
  text-shadow: 2px 2px 0px #000;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #c84c0c;
  border: 3px solid #000;
  color: #FFF;
  font-family: 'Press Start 2P', monospace, var(--font-mono);
  font-size: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10001;
  text-shadow: 2px 2px 0px #000;
  box-shadow: 4px 4px 0px #000;

  &:hover {
    background-color: #dc6c20;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
  }
`;

const MusicButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #6DB33F;
  border: 3px solid #000;
  color: #FFF;
  font-family: 'Press Start 2P', monospace, var(--font-mono);
  font-size: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10001;
  text-shadow: 2px 2px 0px #000;
  box-shadow: 4px 4px 0px #000;

  &:hover {
    background-color: #7DC34F;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
  }
`;

const Instructions = styled.div`
  color: #FFF;
  font-family: 'Press Start 2P', monospace, var(--font-mono);
  margin-top: 10px;
  font-size: 10px;
  text-align: center;
  max-width: 800px;
  text-shadow: 2px 2px 0px #000;
  line-height: 1.5;
`;

const MarioGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [message, setMessage] = useState('Jump on tech stacks to visit projects!');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const musicIntervalRef = useRef(null);
  const soundFunctionsRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize Web Audio API for sounds
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }

    // Create sound functions using Web Audio API
    const playCoinSound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 988; // B5
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    };

    const playJumpSound = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    };

    const startBackgroundMusic = () => {
      if (!audioContextRef.current || musicIntervalRef.current) return;
      
      const notes = [523, 587, 659, 698, 784, 880, 988]; // C5 to B5
      const melody = [0, 2, 4, 5, 4, 2, 0, 2, 4, 5, 4, 2];
      let noteIndex = 0;

      const playNote = () => {
        if (!musicIntervalRef.current) return; // Check if music should still be playing
        
        const ctx = audioContextRef.current;
        if (!ctx) return;
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = notes[melody[noteIndex % melody.length]];
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        
        noteIndex++;
      };

      musicIntervalRef.current = setInterval(playNote, 400);
    };

    const stopBackgroundMusic = () => {
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
        musicIntervalRef.current = null;
      }
    };

    // Store functions in ref so they can be accessed outside useEffect
    soundFunctionsRef.current = {
      playCoinSound,
      playJumpSound,
      startBackgroundMusic,
      stopBackgroundMusic
    };
    
    // Load character image
    const characterImg = new Image();
    const pathPrefix = window.location.pathname.includes('/Portfolio') ? '/Portfolio' : '';
    characterImg.src = `${pathPrefix}/rabio.png`;
    
    // Technology stacks with their associated projects and SVG icons
    const techStacks = [
      { 
        name: 'React', 
        color: '#61DAFB', 
        project: 'Partnerly - Partnership Management',
        slug: 'partnerly',
        icon: 'M14 2C8.477 2 4 6.477 4 12s4.477 10 10 10 10-4.477 10-10S19.523 2 14 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z M14 14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm4-2c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z'
      },
      { 
        name: 'Spring Boot', 
        color: '#6DB33F', 
        project: 'Partnership Eligibility System',
        slug: 'partnershipeligibility',
        icon: 'M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.492 1.424l-.143-.076c-2.405-1.17-2.475-6.38 1.894-8.059 1.916-.736 3.747-.332 5.818-.825 2.208-.525 4.766-2.18 5.805-4.344 1.165 3.458 2.565 8.866.054 12.21zm.042-13.28a9.212 9.212 0 0 1-1.065 1.89 9.982 9.982 0 0 0-7.167-3.031C6.492 1.971 2 6.463 2 11.985a9.983 9.983 0 0 0 3.205 7.334l.22.194a.856.856 0 1 1 .001.001l.149.132A9.96 9.96 0 0 0 12.015 22c5.278 0 9.613-4.108 9.984-9.292.274-2.539-.476-5.763-1.752-9.596'
      },
      { 
        name: 'Django', 
        color: '#092E20', 
        project: 'PennyWise',
        slug: 'pennywise',
        icon: 'M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.001 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.097c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.529 3.109-2.625.561-1.121.739-2.421.739-5.835V6.059h3.924zM17.39.021h3.924v4.026H17.39z'
      },
      { 
        name: 'Nest.js', 
        color: '#42B883', 
        project: 'Axess AI Assistant',
        slug: 'axess',
        icon: 'M2 3h3.5L12 15 18.5 3H22L12 21zm4.5 0h3L12 7.58 14.5 3h3L12 13.08z'
      },
      { 
        name: 'Flutter', 
        color: '#02569B', 
        project: 'Partnerly - Partnership Management',
        slug: 'partnerly',
        icon: 'M13.9 2.01L3.9 12l3.09 3.09 2.71-2.7L20.09 2l-6.19.01zm.82 14.6l-5.39-5.38h.01l-3.54 3.53L2 11.01 11.71 1.3l6.18-.01-3.09 3.09 3.54 3.54-3.53 3.53 3.54 3.54-3.54 3.53z'
      },
      { 
        name: 'Node.js', 
        color: '#339933', 
        project: 'Partnership Management System',
        slug: 'partnershipmanagement',
        icon: 'M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 0 1-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0L10 19.65c-.08-.03-.16-.04-.21-.01-.53.3-.63.36-1.12.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2z'
      },
      { 
        name: 'Angular', 
        color: '#DD0031', 
        project: 'Partnership Eligibility System',
        slug: 'partnershipeligibility',
        icon: 'M9.93 12.645h4.134L12 7.37zm.296-10.562L2 4.157l1.567 13.482L12 22l8.434-4.361L22 4.157l-8.227-2.074L12 6.86zm0 0l-7.643 1.926 1.26 10.903L12 20.477l8.383-4.348 1.26-10.903z'
      },
      { 
        name: 'Python', 
        color: '#3776AB', 
        project: 'Sage Class AI Assistant',
        slug: 'sageclass',
        icon: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z'
      },
      { 
        name: 'Java', 
        color: '#007396', 
        project: 'Complexe Culturel Management System',
        slug: 'complexeculturel',
        icon: 'M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639'
      },
      { 
        name: 'JavaScript', 
        color: '#F7DF1E', 
        project: 'Multiple Projects',
        slug: 'projects',
        icon: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z'
      },
    ];

    const gameState = {
      player: {
        x: 50,
        y: 300,
        width: 60,
        height: 75,
        velocityY: 0,
        velocityX: 0,
        isJumping: false,
        direction: 'right',
      },
      platforms: [],
      techItems: [],
      score: 0,
      keys: {},
      gravity: 0.6,
      jumpPower: -12,
      moveSpeed: 5,
      camera: { x: 0 },
      dialog: null, // { tech: string, project: string, color: string }
      dialogSelection: 'yes', // 'yes' or 'no'
    };

    // Generate platforms
    for (let i = 0; i < 20; i++) {
      gameState.platforms.push({
        x: i * 200 + Math.random() * 100,
        y: 350 + Math.random() * 50,
        width: 100 + Math.random() * 50,
        height: 20,
      });
    }

    // Place tech stacks on platforms
    gameState.platforms.forEach((platform, index) => {
      if (index > 0 && index < gameState.platforms.length - 1) {
        const tech = techStacks[index % techStacks.length];
        gameState.techItems.push({
          x: platform.x + platform.width / 2 - 20,
          y: platform.y - 50,
          width: 40,
          height: 40,
          name: tech.name,
          color: tech.color,
          project: tech.project,
          slug: tech.slug,
          icon: tech.icon,
          collected: false,
          bounceOffset: 0,
        });
      }
    });

    // Draw player (using character image)
    const drawPlayer = () => {
      const p = gameState.player;
      const screenX = p.x - gameState.camera.x;

      if (characterImg.complete) {
        // Draw the character image, flipped if moving left
        ctx.save();
        if (p.direction === 'left') {
          ctx.scale(-1, 1);
          ctx.drawImage(characterImg, -screenX - p.width, p.y, p.width, p.height);
        } else {
          ctx.drawImage(characterImg, screenX, p.y, p.width, p.height);
        }
        ctx.restore();
      } else {
        // Fallback: Draw a simple pixel art character in green (matching your character's colors)
        ctx.fillStyle = '#4a8b3c';
        ctx.fillRect(screenX + 10, p.y + 10, 20, 25);
        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.arc(screenX + 20, p.y + 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 16, p.y + 8, 3, 3);
        ctx.fillRect(screenX + 23, p.y + 8, 3, 3);
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(screenX + 12, p.y + 35, 6, 15);
        ctx.fillRect(screenX + 22, p.y + 35, 6, 15);
      }
    };

    // Draw platforms (brick-style like Mario)
    const drawPlatforms = () => {
      gameState.platforms.forEach(platform => {
        const screenX = platform.x - gameState.camera.x;
        const brickSize = 20;
        
        // Draw brick pattern
        for (let x = 0; x < platform.width; x += brickSize) {
          for (let y = 0; y < platform.height; y += brickSize) {
            // Brick color
            ctx.fillStyle = '#c84c0c';
            ctx.fillRect(screenX + x, platform.y + y, brickSize - 2, brickSize - 2);
            
            // Brick highlights
            ctx.fillStyle = '#dc6c20';
            ctx.fillRect(screenX + x, platform.y + y, brickSize - 2, 3);
            ctx.fillRect(screenX + x, platform.y + y, 3, brickSize - 2);
            
            // Brick shadows
            ctx.fillStyle = '#a03c00';
            ctx.fillRect(screenX + x, platform.y + y + brickSize - 5, brickSize - 2, 3);
            ctx.fillRect(screenX + x + brickSize - 5, platform.y + y, 3, brickSize - 2);
          }
        }
      });
    };

    // Draw tech stacks (with SVG icons)
    const drawTechItems = () => {
      gameState.techItems.forEach(item => {
        if (item.collected) return;

        const screenX = item.x - gameState.camera.x;
        
        // Bounce animation
        item.bounceOffset = Math.sin(Date.now() / 200) * 5;
        const size = 40;

        // Draw block background
        ctx.fillStyle = item.color;
        ctx.fillRect(screenX, item.y + item.bounceOffset, size, size);
        
        // Block highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(screenX + 2, item.y + item.bounceOffset + 2, size - 4, 4);
        ctx.fillRect(screenX + 2, item.y + item.bounceOffset + 2, 4, size - 4);
        
        // Block shadows
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(screenX + 2, item.y + item.bounceOffset + size - 6, size - 4, 4);
        ctx.fillRect(screenX + size - 6, item.y + item.bounceOffset + 2, 4, size - 4);
        
        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, item.y + item.bounceOffset, size, size);

        // Draw tech icon using SVG path
        if (item.icon) {
          const iconSize = 24;
          const iconX = screenX + (size - iconSize) / 2;
          const iconY = item.y + item.bounceOffset + (size - iconSize) / 2;
          
          // Create a path2D from the SVG path data
          ctx.fillStyle = '#FFF';
          ctx.save();
          ctx.translate(iconX, iconY);
          ctx.scale(iconSize / 24, iconSize / 24); // SVG viewBox is 24x24
          
          const path = new Path2D(item.icon);
          ctx.fill(path);
          ctx.restore();
        } else {
          // Fallback: Draw first letter
          ctx.fillStyle = '#FFF';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(item.name[0], screenX + size / 2, item.y + item.bounceOffset + size / 2 + 7);
        }

        // Draw tech name above
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText(item.name, screenX + size / 2, item.y + item.bounceOffset - 8);
        ctx.fillText(item.name, screenX + size / 2, item.y + item.bounceOffset - 8);
      });
    };

    // Physics and collision
    const update = () => {
      const p = gameState.player;

      // Horizontal movement
      if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
        p.velocityX = -gameState.moveSpeed;
        p.direction = 'left';
      } else if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
        p.velocityX = gameState.moveSpeed;
        p.direction = 'right';
      } else {
        p.velocityX = 0;
      }

      p.x += p.velocityX;

      // Camera follows player
      gameState.camera.x = p.x - canvas.width / 3;

      // Gravity
      p.velocityY += gameState.gravity;
      p.y += p.velocityY;

      // Ground collision
      if (p.y > 320) {
        p.y = 320;
        p.velocityY = 0;
        p.isJumping = false;
      }

      // Platform collision
      gameState.platforms.forEach(platform => {
        if (
          p.x + p.width > platform.x &&
          p.x < platform.x + platform.width &&
          p.y + p.height > platform.y &&
          p.y + p.height < platform.y + platform.height &&
          p.velocityY > 0
        ) {
          p.y = platform.y - p.height;
          p.velocityY = 0;
          p.isJumping = false;
        }
      });

      // Tech item collision
      gameState.techItems.forEach(item => {
        if (item.collected) return;

        if (
          p.x + p.width > item.x &&
          p.x < item.x + item.width &&
          p.y + p.height > item.y &&
          p.y < item.y + item.height
        ) {
          item.collected = true;
          gameState.score += 100;
          setScore(gameState.score);
          setCoinsCollected(prev => prev + 1);
          
          // Play coin sound
          soundFunctionsRef.current.playCoinSound?.();
          
          // Show in-game dialog
          gameState.dialog = {
            tech: item.name,
            project: item.project,
            slug: item.slug,
            color: item.color,
            icon: item.icon,
          };
          gameState.dialogSelection = 'yes';
        }
      });

      // Keep player in bounds
      if (p.x < 0) p.x = 0;
    };

    // Draw sky and clouds (Mario style)
    const drawBackground = () => {
      // Sky - solid Mario blue
      ctx.fillStyle = '#5c94fc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground at bottom (brown underground look)
      ctx.fillStyle = '#c84c0c';
      ctx.fillRect(0, 370, canvas.width, 30);
      
      // Ground pattern
      const groundSize = 16;
      for (let x = 0; x < canvas.width; x += groundSize) {
        ctx.fillStyle = '#dc6c20';
        ctx.fillRect(x, 370, groundSize - 1, groundSize - 1);
        ctx.fillStyle = '#a03c00';
        ctx.fillRect(x + groundSize - 3, 370, 3, groundSize - 1);
      }

      // Pixelated clouds (Mario style)
      ctx.fillStyle = '#FFF';
      const clouds = [
        { x: 100, y: 50 },
        { x: 350, y: 80 },
        { x: 600, y: 60 },
      ];
      
      clouds.forEach(cloud => {
        const cloudX = (cloud.x - gameState.camera.x * 0.3) % (canvas.width + 100);
        const pixelSize = 8;
        
        // Draw pixelated cloud shape
        [
          [2, 0], [3, 0], [4, 0],
          [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
          [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
          [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
          [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
        ].forEach(([x, y]) => {
          ctx.fillRect(cloudX + x * pixelSize, cloud.y + y * pixelSize, pixelSize, pixelSize);
        });
      });
    };

    // Draw hills (Mario style green hills)
    const drawHills = () => {
      ctx.fillStyle = '#00a800';
      const hills = [
        { x: 50, width: 150, height: 60 },
        { x: 300, width: 120, height: 50 },
        { x: 550, width: 140, height: 55 },
      ];
      
      hills.forEach(hill => {
        const hillX = (hill.x - gameState.camera.x * 0.6) % (canvas.width + 200);
        ctx.beginPath();
        ctx.arc(hillX + hill.width / 2, 370, hill.height, Math.PI, 0);
        ctx.fill();
      });
    };

    // Draw in-game dialog (Mario style)
    const drawDialog = () => {
      if (!gameState.dialog) return;

      const dialog = gameState.dialog;
      const boxWidth = 600;
      const boxHeight = 260;
      const boxX = (canvas.width - boxWidth) / 2;
      const boxY = (canvas.height - boxHeight) / 2;

      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dialog box (brick style like Mario)
      ctx.fillStyle = '#c84c0c';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      
      // Dialog box border (black thick outline)
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 6;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      
      // Inner white border
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX + 6, boxY + 6, boxWidth - 12, boxHeight - 12);

      // Draw tech block indicator at top
      const blockSize = 50;
      const blockX = boxX + boxWidth / 2 - blockSize / 2;
      const blockY = boxY + 20;
      
      // Draw block background
      ctx.fillStyle = dialog.color;
      ctx.fillRect(blockX, blockY, blockSize, blockSize);
      
      // Block highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(blockX + 2, blockY + 2, blockSize - 4, 4);
      ctx.fillRect(blockX + 2, blockY + 2, 4, blockSize - 4);
      
      // Block shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(blockX + 2, blockY + blockSize - 6, blockSize - 4, 4);
      ctx.fillRect(blockX + blockSize - 6, blockY + 2, 4, blockSize - 4);
      
      // Draw block border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(blockX, blockY, blockSize, blockSize);

      // Draw tech icon in the block
      if (dialog.icon) {
        const iconSize = 30;
        const iconX = blockX + (blockSize - iconSize) / 2;
        const iconY = blockY + (blockSize - iconSize) / 2;
        
        ctx.fillStyle = '#FFF';
        ctx.save();
        ctx.translate(iconX, iconY);
        ctx.scale(iconSize / 24, iconSize / 24);
        
        const path = new Path2D(dialog.icon);
        ctx.fill(path);
        ctx.restore();
      }

      // Draw text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      
      // Title
      ctx.font = 'bold 20px monospace';
      const title = `YOU GOT ${dialog.tech.toUpperCase()}!`;
      ctx.strokeText(title, boxX + boxWidth / 2, blockY + blockSize + 40);
      ctx.fillText(title, boxX + boxWidth / 2, blockY + blockSize + 40);
      
      // Project question
      ctx.font = 'bold 14px monospace';
      const question = 'Visit this project?';
      ctx.strokeText(question, boxX + boxWidth / 2, blockY + blockSize + 70);
      ctx.fillText(question, boxX + boxWidth / 2, blockY + blockSize + 70);
      
      // Project name (wrap if too long)
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#FFD700';
      const maxWidth = boxWidth - 40;
      const words = dialog.project.split(' ');
      let line = '';
      let y = blockY + blockSize + 100;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.strokeText(line, boxX + boxWidth / 2, y);
          ctx.fillText(line, boxX + boxWidth / 2, y);
          line = words[i] + ' ';
          y += 20;
        } else {
          line = testLine;
        }
      }
      ctx.strokeText(line, boxX + boxWidth / 2, y);
      ctx.fillText(line, boxX + boxWidth / 2, y);

      // Draw buttons
      const buttonWidth = 120;
      const buttonHeight = 40;
      const buttonY = boxY + boxHeight - 60;
      const yesX = boxX + boxWidth / 2 - buttonWidth - 20;
      const noX = boxX + boxWidth / 2 + 20;

      // YES button
      const yesSelected = gameState.dialogSelection === 'yes';
      ctx.fillStyle = yesSelected ? '#FFD700' : '#00a800';
      ctx.fillRect(yesX, buttonY, buttonWidth, buttonHeight);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = yesSelected ? 4 : 3;
      ctx.strokeRect(yesX, buttonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 16px monospace';
      ctx.strokeText('YES', yesX + buttonWidth / 2, buttonY + 26);
      ctx.fillText('YES', yesX + buttonWidth / 2, buttonY + 26);

      // NO button
      const noSelected = gameState.dialogSelection === 'no';
      ctx.fillStyle = noSelected ? '#FFD700' : '#DD0031';
      ctx.fillRect(noX, buttonY, buttonWidth, buttonHeight);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = noSelected ? 4 : 3;
      ctx.strokeRect(noX, buttonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = '#FFF';
      ctx.strokeText('NO', noX + buttonWidth / 2, buttonY + 26);
      ctx.fillText('NO', noX + buttonWidth / 2, buttonY + 26);

      // Instructions
      ctx.font = '10px monospace';
      ctx.fillStyle = '#FFF';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      const instruction = 'Use Arrow Keys to select, ENTER to confirm';
      ctx.strokeText(instruction, boxX + boxWidth / 2, boxY + boxHeight - 15);
      ctx.fillText(instruction, boxX + boxWidth / 2, boxY + boxHeight - 15);
    };

    // Game loop
    const gameLoop = () => {
      drawBackground();
      drawHills();
      drawPlatforms();
      drawTechItems();
      drawPlayer();
      
      if (!gameState.dialog) {
        update();
      }
      
      drawDialog();
    };

    const handleKeyDown = (e) => {
      // Handle dialog controls
      if (gameState.dialog) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          gameState.dialogSelection = 'yes';
          e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          gameState.dialogSelection = 'no';
          e.preventDefault();
        } else if (e.key === 'Enter') {
          if (gameState.dialogSelection === 'yes') {
            setMessage(`Going to Projects...`);
            
            // Close dialog and game
            gameState.dialog = null;
            onClose();
            
            // Wait for game to close, then scroll to projects
            setTimeout(() => {
              const projectsSection = document.querySelector('#projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // Fallback: try with different selectors
                const section = document.querySelector('section[id="projects"]') || 
                               document.querySelector('[id*="project"]');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }, 500);
          } else {
            setMessage(`Keep playing! Score: ${gameState.score}`);
            gameState.dialog = null;
          }
          e.preventDefault();
        } else if (e.key === 'Escape') {
          gameState.dialog = null;
          e.preventDefault();
        }
        return;
      }

      // Normal game controls
      gameState.keys[e.key] = true;
      
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !gameState.player.isJumping) {
        gameState.player.velocityY = gameState.jumpPower;
        gameState.player.isJumping = true;
        
        // Play jump sound
        soundFunctionsRef.current.playJumpSound?.();
        
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyUp = (e) => {
      if (!gameState.dialog) {
        gameState.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const interval = setInterval(gameLoop, 1000 / 60); // 60 FPS

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
      
      // Stop and cleanup audio
      soundFunctionsRef.current.stopBackgroundMusic?.();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [onClose]);

  useEffect(() => {
    // Trigger achievement when game opens
    window.dispatchEvent(new CustomEvent('achievement:mario'));
  }, []);

  const toggleMusic = () => {
    if (!audioContextRef.current) return;
    
    if (isMusicPlaying) {
      soundFunctionsRef.current.stopBackgroundMusic?.();
      setIsMusicPlaying(false);
    } else {
      setIsMusicPlaying(true);
      soundFunctionsRef.current.startBackgroundMusic?.();
    }
  };

  return (
    <GameContainer>
      <CloseButton onClick={onClose}>ESC - Close</CloseButton>
      <MusicButton onClick={toggleMusic}>
        {isMusicPlaying ? '🔊 Music ON' : '🔇 Music OFF'}
      </MusicButton>
      <Canvas ref={canvasRef} width={800} height={400} />
      <GameInfo>
        <span>Score: {score}</span>
        <span>🪙 Coins: {coinsCollected}</span>
        <span>⭐ {message}</span>
      </GameInfo>
      <Instructions>
        Arrow Keys or A/D to move • Space/W/↑ to jump • Collect tech stacks to visit projects!
      </Instructions>
    </GameContainer>
  );
};

export default MarioGame;
