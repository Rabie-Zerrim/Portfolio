import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Icon } from '@components/icons';
import { StaticImage } from 'gatsby-plugin-image';

const StyledSkillsSection = styled.section`
  max-width: 1000px;

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 10px 20px;
    margin: 20px 0;
  }

  /* Marquee tracks: two rows that scroll continuously. */
  .marquee {
    width: 100%;
    overflow: hidden;
  }

  .marquee-track {
    display: flex;
    gap: 15px;
    align-items: center;
    /* duplicated content will make seamless loop */
    white-space: nowrap;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .marquee-track.animate {
    animation: marquee 30s linear infinite;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .marquee-track.paused {
    animation-play-state: paused !important;
  }

  /* Pause on hover/focus for readability */
  .marquee-track.animate:hover,
  .marquee-track.animate:focus {
    animation-play-state: paused;
  }

  .marquee-track.animate.reverse {
    animation-direction: reverse;
    animation-duration: 38s;
  }

  /* When reduced-motion is preferred, don't animate */
  @media (prefers-reduced-motion: reduce) {
    .marquee-track.animate,
    .marquee-track.animate.reverse {
      animation: none;
    }
  }

  /* Pause marquee while scrolling to avoid repaint glitches */
  body.is-scrolling .marquee-track.animate,
  body.is-scrolling .marquee-track.animate.reverse {
    animation-play-state: paused !important;
  }

  .skill-item {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    padding: 1rem;
    height: 100%;
    transition: var(--transition);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    flex: 0 0 auto;

    &:hover,
    &:focus {
      transform: translateY(-5px);
    }

    .skill-image {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      
      svg, img, .gatsby-image-wrapper {
        width: 45px;
        height: 45px;
        object-fit: contain;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      @media (max-width: 768px) {
        height: 40px;
        
        svg, img, .gatsby-image-wrapper {
          width: 35px;
          height: 35px;
        }
      }
    }

    .skill-name {
      margin-top: 8px;
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      text-align: center;

      @media (max-width: 768px) {
        font-size: 10px;
      }
    }

    &:hover {
      .skill-image svg,
      .skill-image img,
      .skill-image .gatsby-image-wrapper {
        transform: scale(1.15);
      }
    }
  }

  /* Mobile: disable continuous animation and wrap items into responsive grid */
  @media (max-width: 600px) {
    .marquee-track.animate,
    .marquee-track.animate.reverse {
      animation: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }

    .skill-item {
      min-width: 42%;
      flex: 0 0 42%;
      padding: 0.75rem;
    }
  }

  .skill-item {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    padding: 1.5rem;
    height: 100%;
    transition: var(--transition);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover,
    &:focus {
      transform: translateY(-5px);
    }

    .skill-image {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      
      svg, img, .gatsby-image-wrapper {
        width: 45px;
        height: 45px;
        object-fit: contain;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      @media (max-width: 768px) {
        height: 40px;
        
        svg, img, .gatsby-image-wrapper {
          width: 35px;
          height: 35px;
        }
      }
    }

    .skill-name {
      margin-top: 8px;
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      text-align: center;

      @media (max-width: 768px) {
        font-size: 10px;
      }
    }

    &:hover {
      .skill-image svg,
      .skill-image img,
      .skill-image .gatsby-image-wrapper {
        transform: scale(1.15);
      }
    }
  }
`;

const skills = [
  // Languages
  {
    name: 'Java',
    icon: 'Java',
    isImage: false,
    url: 'https://www.java.com/'
  },
  {
    name: 'Python',
    icon: 'Python',
    isImage: false,
    url: 'https://www.python.org/'
  },
  {
    name: 'JavaScript',
    icon: 'JavaScript',
    isImage: false,
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  {
    name: 'C#',
    icon: 'CSharp',
    isImage: false,
    url: 'https://docs.microsoft.com/en-us/dotnet/csharp/'
  },
  {
    name: 'PHP',
    icon: 'PHP',
    isImage: false,
    url: 'https://www.php.net/'
  },
  
  // Frontend
  {
    name: 'React.js',
    icon: 'React',
    isImage: false,
    url: 'https://reactjs.org/'
  },
  {
    name: 'Vue.js',
    icon: 'Vue',
    isImage: false,
    url: 'https://vuejs.org/'
  },
  {
    name: 'Angular',
    icon: 'Angular',
    isImage: false,
    url: 'https://angular.io/'
  },
  {
    name: 'Flutter',
    icon: 'Flutter',
    isImage: false,
    url: 'https://flutter.dev/'
  },
  {
    name: 'JavaFX',
    icon: 'JavaFX',
    isImage: false,
    url: 'https://openjfx.io/'
  },
  
  // Backend
  {
    name: 'Spring Boot',
    icon: '/skills/springboot.png',
    isImage: true,
    url: 'https://spring.io/projects/spring-boot'
  },
  {
    name: 'Symfony',
    icon: '/skills/symfony.png',
    isImage: true,
    url: 'https://symfony.com/'
  },
  {
    name: 'Django',
    icon: '/skills/django.png',
    isImage: true,
    url: 'https://www.djangoproject.com/'
  },
  {
    name: 'Flask',
    icon: 'Flask',
    isImage: false,
    url: 'https://flask.palletsprojects.com/'
  },
  {
    name: '.NET',
    icon: 'DotNet',
    isImage: false,
    url: 'https://dotnet.microsoft.com/'
  },
  {
    name: 'Node.js',
    icon: 'NodeJS',
    isImage: false,
    url: 'https://nodejs.org/'
  },
  {
    name: 'Nest.js',
    icon: 'Nest.js',
    isImage: false,
    url: 'https://nestjs.com/'
  },
  {
    name: 'Hibernate',
    icon: 'Java',
    isImage: false,
    url: 'https://hibernate.org/'
  },
  
  // Databases
  {
    name: 'PostgreSQL',
    icon: 'PostgreSQL',
    isImage: false,
    url: 'https://www.postgresql.org/'
  },
  {
    name: 'MySQL',
    icon: 'MySQL',
    isImage: false,
    url: 'https://www.mysql.com/'
  },
  {
    name: 'MongoDB',
    icon: 'MongoDB',
    isImage: false,
    url: 'https://www.mongodb.com/'
  },
  {
    name: 'MariaDB',
    icon: 'MariaDB',
    isImage: false,
    url: 'https://mariadb.org/'
  },
  {
    name: 'Firebase',
    icon: 'Firebase',
    isImage: false,
    url: 'https://firebase.google.com/'
  },
  
  // DevOps & Tools
  {
    name: 'Docker',
    icon: 'Docker',
    isImage: false,
    url: 'https://www.docker.com/'
  },
  {
    name: 'Git',
    icon: 'Git',
    isImage: false,
    url: 'https://git-scm.com/'
  },
  {
    name: 'GitLab CI',
    icon: 'GitLab',
    isImage: false,
    url: 'https://about.gitlab.com/'
  },
  {
    name: 'Maven',
    icon: 'Maven',
    isImage: false,
    url: 'https://maven.apache.org/'
  },
  {
    name: 'Jest',
    icon: 'Jest',
    isImage: false,
    url: 'https://jestjs.io/'
  },
  
  // AI/ML
  {
    name: 'PyTorch',
    icon: 'PyTorch',
    isImage: false,
    url: 'https://pytorch.org/'
  },
  {
    name: 'Scikit-learn',
    icon: 'Scikit-learn',
    isImage: false,
    url: 'https://scikit-learn.org/'
  },
  {
    name: 'TensorFlow',
    icon: 'TensorFlow',
    isImage: false,
    url: 'https://www.tensorflow.org/'
  },
  {
    name: 'NLP',
    icon: 'NLP',
    isImage: false,
    url: 'https://www.nltk.org/'
  },
  
  // Design & Collaboration
  {
    name: 'Figma',
    icon: 'Figma',
    isImage: false,
    url: 'https://www.figma.com/'
  },
  {
    name: 'Photoshop',
    icon: 'Photoshop',
    isImage: false,
    url: 'https://www.adobe.com/products/photoshop.html'
  },
  {
    name: 'Illustrator',
    icon: 'Illustrator',
    isImage: false,
    url: 'https://www.adobe.com/products/illustrator.html'
  },
  {
    name: 'Jira',
    icon: 'Jira',
    isImage: false,
    url: 'https://www.atlassian.com/software/jira'
  },
  {
    name: 'Trello',
    icon: 'Trello',
    isImage: false,
    url: 'https://trello.com/'
  }
];

const Skills = () => {
  const revealTitle = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, srConfig());
  }, []);

  // Duplicate skills for seamless scrolling
  const duplicatedSkills = [...skills, ...skills];
  // Create a shifted second track so top and bottom don't line up
  const shift = Math.floor(skills.length / 2);
  const shifted = [...skills.slice(shift), ...skills.slice(0, shift)];
  const duplicatedShifted = [...shifted, ...shifted];

  const renderSkill = ({ name, icon, isImage, url }, i) => (
    <a
      key={`${name}-${i}`}
      className="skill-item"
      href={url}
      target="_blank"
      rel="noopener noreferrer">
      <div className="skill-image">
        {isImage ? (
          name === 'Django' ? (
            <StaticImage
              src="../../images/skills/django.png"
              alt="Django"
              width={45}
              height={45}
              placeholder="none"
            />
          ) : name === 'Spring Boot' ? (
            <StaticImage
              src="../../images/skills/springboot.png"
              alt="Spring Boot"
              width={45}
              height={45}
              placeholder="none"
            />
          ) : name === 'Symfony' ? (
            <StaticImage
              src="../../images/skills/symfony.png"
              alt="Symfony"
              width={45}
              height={45}
              placeholder="none"
            />
          ) : null
        ) : (
          <Icon name={icon} />
        )}
      </div>
      <div className="skill-name">{name}</div>
    </a>
  );

  return (
    <StyledSkillsSection id="skills">
      <div className="inner">
        <h2 className="numbered-heading" ref={revealTitle}>
          Skills
        </h2>

        <div className="carousel-container">
          <div className="marquee" aria-hidden={prefersReducedMotion}>
              <div
                className={`marquee-track ${prefersReducedMotion ? '' : 'animate'} ${isTouching ? 'paused' : ''}`}
                onTouchStart={() => setIsTouching(true)}
                onTouchEnd={() => setIsTouching(false)}
                onTouchCancel={() => setIsTouching(false)}>
                {duplicatedSkills.map((s, i) => renderSkill(s, i))}
              </div>
          </div>

            <div className="marquee" style={{ marginTop: 12 }} aria-hidden={prefersReducedMotion}>
              <div
                className={`marquee-track ${prefersReducedMotion ? '' : 'animate reverse'} ${isTouching ? 'paused' : ''}`}
                onTouchStart={() => setIsTouching(true)}
                onTouchEnd={() => setIsTouching(false)}
                onTouchCancel={() => setIsTouching(false)}>
                {duplicatedShifted.map((s, i) => renderSkill(s, i + duplicatedShifted.length))}
              </div>
            </div>
        </div>
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;