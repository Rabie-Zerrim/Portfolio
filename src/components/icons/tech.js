import React from 'react';

const TechIcon = ({ name }) => {
  const iconMap = {
    'Spring Boot': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg',
    'Angular': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg',
    'MySQL': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
    'Docker': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
    'Jenkins': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jenkins/jenkins-original.svg',
    'Bootstrap': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain.svg',
    'TypeScript': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
    'Java': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
    'JavaFX': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
    'Python': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    'Flask': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    'FlutterFlow': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg',
    'Symfony': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/symfony/symfony-original.svg'
  };

  const iconUrl = iconMap[name];
  
  if (!iconUrl) return <span>{name}</span>;

  return (
    <span className="tech-item">
      <img 
        src={iconUrl} 
        alt={name} 
        style={{ 
          width: '20px', 
          height: '20px',
          marginRight: '4px', 
          verticalAlign: 'middle',
          objectFit: 'contain'
        }} 
      />
      {name}
    </span>
  );
};

export default TechIcon;