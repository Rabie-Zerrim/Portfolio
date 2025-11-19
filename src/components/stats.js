import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';

const StatsContainer = styled.section`
  position: relative;
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 100px 0;

  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const StatsTitle = styled.h2`
  font-size: clamp(40px, 5vw, 60px);
  color: var(--lightest-slate);
  text-align: center;
  margin-bottom: 50px;
  
  .number {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(26px, 5vw, 32px);
    font-weight: 400;
    margin-right: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
`;

const StatCard = styled.div`
  background: var(--light-navy);
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--lightest-navy);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    border-color: var(--green);
  }
`;

const StatIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(100, 255, 218, 0.3));
  
  svg {
    width: 48px;
    height: 48px;
    fill: var(--green);
  }
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: var(--green);
  font-family: var(--font-mono);
  margin-bottom: 5px;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 18px;
  color: var(--slate);
  font-family: var(--font-sans);
  font-weight: 500;
`;

const StatDescription = styled.div`
  font-size: 14px;
  color: var(--light-slate);
  margin-top: 10px;
  font-family: var(--font-mono);
`;

const Stats = () => {
  const [projects, setProjects] = useState(0);
  const [technologies, setTechnologies] = useState(0);
  const [experience, setExperience] = useState(0);
  const [coffee, setCoffee] = useState(0);

  // Animated counter effect
  const animateValue = (start, end, duration, setter) => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * (end - start)));
      
      setter(value);
      
      if (value === end) {
        clearInterval(timer);
      }
    }, 16);
  };

  useEffect(() => {
    // Animate counters on mount
    animateValue(0, 15, 2000, setProjects); // 12 projects
    animateValue(0, 17, 2000, setTechnologies); // 15+ technologies
    animateValue(0, 5, 2000, setExperience); // 3+ years
    animateValue(0, 997, 2000, setCoffee); // 999+ cups of coffee
  }, []);

  return (
    <StatsContainer id="stats">
      <StatsTitle>
        <span className="number">03.</span> By The Numbers
      </StatsTitle>
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Icon name="Folder" />
          </StatIcon>
          <StatNumber>{projects}+</StatNumber>
          <StatLabel>Projects</StatLabel>
          <StatDescription>Built & Deployed</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>⚡</StatIcon>
          <StatNumber>{technologies}+</StatNumber>
          <StatLabel>Technologies</StatLabel>
          <StatDescription>Mastered</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>🎓</StatIcon>
          <StatNumber>{experience}+</StatNumber>
          <StatLabel>Years</StatLabel>
          <StatDescription>of Experience</StatDescription>
        </StatCard>

        <StatCard>
          <StatIcon>☕</StatIcon>
          <StatNumber>{coffee}+</StatNumber>
          <StatLabel>Cups of Coffee</StatLabel>
          <StatDescription>Consumed</StatDescription>
        </StatCard>
      </StatsGrid>
    </StatsContainer>
  );
};

export default Stats;
