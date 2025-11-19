import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';
import PacmanGame from './pacman';
import MarioGame from './mario';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

const Footer = () => {
  const [githubInfo, setGitHubInfo] = useState({
    stars: null,
    forks: null,
    commits: null,
    totalRepos: null,
  });
  const [showPacman, setShowPacman] = useState(false);
  const [showMario, setShowMario] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [marioTriggerCount, setMarioTriggerCount] = useState(0);
  const [lastMarioKeyTime, setLastMarioKeyTime] = useState(0);
  
  // Konami code: up, up, down, down, left, right, left, right, b, a
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Konami code for Pac-Man
      if (e.key === konamiCode[konamiIndex]) {
        setKonamiIndex(konamiIndex + 1);
        if (konamiIndex + 1 === konamiCode.length) {
          setShowPacman(true);
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }

      // Triple 'M' press for Mario (within 2 seconds)
      if (e.key === 'm' || e.key === 'M') {
        const now = Date.now();
        if (now - lastMarioKeyTime < 2000) {
          const newCount = marioTriggerCount + 1;
          setMarioTriggerCount(newCount);
          if (newCount >= 3) {
            setShowMario(true);
            setMarioTriggerCount(0);
          }
        } else {
          setMarioTriggerCount(1);
        }
        setLastMarioKeyTime(now);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konamiIndex, marioTriggerCount, lastMarioKeyTime]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    
    // Fetch repo stats (stars and forks)
    fetch('https://api.github.com/repos/Rabie-Zerrim/Portfolio')
      .then(response => response.json())
      .then(json => {
        const { stargazers_count, forks_count } = json;
        setGitHubInfo(prev => ({
          ...prev,
          stars: stargazers_count,
          forks: forks_count,
        }));
      })
      .catch(e => console.error(e));

    // Fetch total commits across all repos
    fetch('https://api.github.com/users/Rabie-Zerrim/events/public')
      .then(response => response.json())
      .then(events => {
        // This is an approximation from recent activity
        // For more accurate count, you'd need to iterate through all repos
        const pushEvents = events.filter(event => event.type === 'PushEvent');
        const commitCount = pushEvents.reduce((total, event) => {
          return total + (event.payload.commits ? event.payload.commits.length : 0);
        }, 0);
        setGitHubInfo(prev => ({
          ...prev,
          commits: commitCount,
        }));
      })
      .catch(e => console.error(e));

    // Fetch total number of repositories
    fetch('https://api.github.com/users/Rabie-Zerrim')
      .then(response => response.json())
      .then(json => {
        setGitHubInfo(prev => ({
          ...prev,
          totalRepos: json.public_repos,
        }));
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <>
      <StyledFooter>
        <StyledSocialLinks>
          <ul>
            {socialMedia &&
              socialMedia.map(({ name, url }, i) => (
                <li key={i}>
                  <a href={url} aria-label={name}>
                    <Icon name={name} />
                  </a>
                </li>
              ))}
          </ul>
        </StyledSocialLinks>

        <StyledCredit tabindex="-1">
          <a href="https://github.com/Rabie-Zerrim/Portfolio">
            <div 
              onClick={(e) => {
                if (e.detail === 3) { // Triple click
                  e.preventDefault();
                  setShowPacman(true);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Designed &amp; Built by Rabie Zerrim
            </div>

            <div className="github-stats">
              <span>
                <Icon name="Folder" />
                <span>{githubInfo.totalRepos ? githubInfo.totalRepos.toLocaleString() : '0'} repos</span>
              </span>
              <span>
                <Icon name="GitHub" />
                <span>{(githubInfo.commits || 80).toLocaleString()} commits</span>

              </span>
            </div>
          </a>
        </StyledCredit>
      </StyledFooter>
      {showPacman && <PacmanGame onClose={() => setShowPacman(false)} />}
      {showMario && <MarioGame onClose={() => setShowMario(false)} />}
    </>
  );
};

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
