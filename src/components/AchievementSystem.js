import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

const AchievementToast = styled.div`
  position: fixed;
  top: ${props => props.index * 120 + 20}px;
  right: 20px;
  background: linear-gradient(135deg, var(--navy) 0%, var(--light-navy) 100%);
  border: 2px solid var(--green);
  border-radius: var(--border-radius);
  padding: 20px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation: ${props => props.isLeaving ? slideOut : slideIn} 0.5s ease-out forwards;
  cursor: pointer;

  @media (max-width: 768px) {
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const AchievementIcon = styled.div`
  font-size: 40px;
  animation: bounce 0.6s ease-out;

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const AchievementContent = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.h4`
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-lg);
  margin: 0 0 5px 0;
  font-weight: 600;
`;

const AchievementDescription = styled.p`
  color: var(--slate);
  font-size: var(--fz-sm);
  margin: 0;
  line-height: 1.4;
`;

const AchievementBadge = styled.div`
  display: inline-block;
  background: var(--green);
  color: var(--navy);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  font-weight: 600;
  margin-top: 5px;
`;

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_VISIT: {
    id: 'first_visit',
    title: 'Welcome Wizard! 🧙',
    description: 'Welcome to my portfolio! Thanks for visiting.',
    icon: '✨',
    badge: 'Explorer',
  },
  FOUND_PACMAN: {
    id: 'found_pacman',
    title: 'Pac-Man Master',
    description: 'You found the hidden Pac-Man game!',
    icon: '👾',
    badge: 'Game Hunter',
  },
  FOUND_MARIO: {
    id: 'found_mario',
    title: 'Super Player',
    description: 'You discovered the Mario platformer!',
    icon: '🍄',
    badge: 'Easter Egg',
  },
  VIEWED_ALL_PROJECTS: {
    id: 'viewed_all_projects',
    title: 'Project Explorer',
    description: 'You viewed all my projects. Impressive!',
    icon: '📂',
    badge: 'Completionist',
  },
  CONTACT_CLICKED: {
    id: 'contact_clicked',
    title: 'Let\'s Connect',
    description: 'Thanks for wanting to reach out!',
    icon: '📧',
    badge: 'Networker',
  },
  RESUME_DOWNLOADED: {
    id: 'resume_downloaded',
    title: 'Career Curious',
    description: 'You downloaded my resume!',
    icon: '📄',
    badge: 'Recruiter',
  },
  TIME_SPENT_5MIN: {
    id: 'time_spent_5min',
    title: 'Dedicated Visitor',
    description: 'You spent 5+ minutes exploring!',
    icon: '⏰',
    badge: 'Engaged',
  },
  GITHUB_CLICKED: {
    id: 'github_clicked',
    title: 'Code Explorer',
    description: 'Checking out my code? I like your style!',
    icon: '💻',
    badge: 'Developer',
  },
  ALL_SECTIONS: {
    id: 'all_sections',
    title: 'Portfolio Master',
    description: 'You visited every section!',
    icon: '🏆',
    badge: 'Champion',
  },
};

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [visitStartTime] = useState(Date.now());

  useEffect(() => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem('portfolio_achievements');
    if (saved) {
      setUnlockedAchievements(new Set(JSON.parse(saved)));
    } else {
      // First visit achievement
      unlockAchievement(ACHIEVEMENTS.FIRST_VISIT);
    }

    // Track time spent
    const timeTracker = setInterval(() => {
      const timeSpent = (Date.now() - visitStartTime) / 1000 / 60; // minutes
      const saved = localStorage.getItem('portfolio_achievements');
      const currentUnlocked = saved ? new Set(JSON.parse(saved)) : new Set();
      if (timeSpent >= 5 && !currentUnlocked.has('time_spent_5min')) {
        unlockAchievement(ACHIEVEMENTS.TIME_SPENT_5MIN);
        clearInterval(timeTracker); // Stop checking once unlocked
      }
    }, 30000); // Check every 30 seconds

    // Track section visits
    const sectionsVisited = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            sectionsVisited.add(entry.target.id);
            
            // Check if all major sections visited
            const requiredSections = ['about', 'jobs', 'projects', 'contact'];
            const allVisited = requiredSections.every(s => sectionsVisited.has(s));
            if (allVisited) {
              // Check localStorage directly to avoid stale state
              const saved = localStorage.getItem('portfolio_achievements');
              const currentUnlocked = saved ? new Set(JSON.parse(saved)) : new Set();
              if (!currentUnlocked.has('all_sections')) {
                unlockAchievement(ACHIEVEMENTS.ALL_SECTIONS);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    // Track "Show More" clicks to detect viewing all projects
    const showMoreButton = document.querySelector('.more-button');
    if (showMoreButton) {
      const handleShowMore = () => {
        if (showMoreButton.textContent.includes('Less')) {
          unlockAchievement(ACHIEVEMENTS.VIEWED_ALL_PROJECTS);
        }
      };
      showMoreButton.addEventListener('click', handleShowMore);
    }

    // Track resume download
    const resumeLink = document.querySelector('a[href*="resume"]');
    if (resumeLink) {
      resumeLink.addEventListener('click', () => {
        unlockAchievement(ACHIEVEMENTS.RESUME_DOWNLOADED);
      });
    }

    // Track GitHub clicks
    const githubLinks = document.querySelectorAll('a[href*="github.com"]');
    githubLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!unlockedAchievements.has('github_clicked')) {
          unlockAchievement(ACHIEVEMENTS.GITHUB_CLICKED);
        }
      });
    });

    // Track contact section
    const contactLinks = document.querySelectorAll('a[href^="mailto"], a[href*="contact"]');
    contactLinks.forEach(link => {
      link.addEventListener('click', () => {
        unlockAchievement(ACHIEVEMENTS.CONTACT_CLICKED);
      });
    });

    return () => {
      clearInterval(timeTracker);
      observer.disconnect();
    };
  }, []);

  // Listen for custom events from games
  useEffect(() => {
    const handlePacmanFound = () => unlockAchievement(ACHIEVEMENTS.FOUND_PACMAN);
    const handleMarioFound = () => unlockAchievement(ACHIEVEMENTS.FOUND_MARIO);

    window.addEventListener('achievement:pacman', handlePacmanFound);
    window.addEventListener('achievement:mario', handleMarioFound);

    return () => {
      window.removeEventListener('achievement:pacman', handlePacmanFound);
      window.removeEventListener('achievement:mario', handleMarioFound);
    };
  }, [unlockedAchievements]);

  const unlockAchievement = (achievement) => {
    if (unlockedAchievements.has(achievement.id)) return;

    // Update unlocked set
    const newUnlocked = new Set(unlockedAchievements);
    newUnlocked.add(achievement.id);
    setUnlockedAchievements(newUnlocked);

    // Save to localStorage
    localStorage.setItem('portfolio_achievements', JSON.stringify([...newUnlocked]));

    // Show toast
    setAchievements(prev => [...prev, { ...achievement, timestamp: Date.now() }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.timestamp !== achievement.timestamp));
    }, 5000);

    // Confetti effect (optional)
    triggerConfetti();
  };

  const triggerConfetti = () => {
    // Simple confetti effect using emoji
    const confettiEmojis = ['✨', '🎉', '⭐', '💫', '🌟'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-20px';
      confetti.style.fontSize = '30px';
      confetti.style.zIndex = '99999';
      confetti.style.pointerEvents = 'none';
      confetti.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
      
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }
  };

  const dismissAchievement = (timestamp) => {
    setAchievements(prev => 
      prev.map(a => a.timestamp === timestamp ? { ...a, isLeaving: true } : a)
    );
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.timestamp !== timestamp));
    }, 500);
  };

  return (
    <>
      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {achievements.map((achievement, index) => (
        <AchievementToast
          key={achievement.timestamp}
          index={index}
          isLeaving={achievement.isLeaving}
          onClick={() => dismissAchievement(achievement.timestamp)}
        >
          <AchievementHeader>
            <AchievementIcon>{achievement.icon}</AchievementIcon>
            <AchievementContent>
              <AchievementTitle>{achievement.title}</AchievementTitle>
              <AchievementDescription>{achievement.description}</AchievementDescription>
              <AchievementBadge>{achievement.badge}</AchievementBadge>
            </AchievementContent>
          </AchievementHeader>
        </AchievementToast>
      ))}
    </>
  );
};

// Export function to manually trigger achievements from other components
export const unlockAchievement = (achievementId) => {
  window.dispatchEvent(new CustomEvent(`achievement:${achievementId}`));
};

export default AchievementSystem;
