import React from 'react';
import PropTypes from 'prop-types';
import {
  IconAppStore,
  IconBookmark,
  IconCodepen,
  IconExternal,
  IconFolder,
  IconFork,
  IconGitHub,
  IconInstagram,
  IconLinkedin,
  IconLoader,
  IconLogo,
  IconPlayStore,
  IconStar,
  IconTwitter,
  IconJava,
  IconPython,
  IconJavaScript,
  IconReact,
  IconVue,
  IconNodeJS,
  IconDjango,
  IconSpring,
  IconSymfony,
  IconDocker,
  IconMySQL,
  IconMongoDB,
  IconGit,
  IconAWS,
  IconAzure,
  IconTypeScript,
  IconPyTorch,
  IconFlutter,
  IconDotNet,
  IconFlask,
  IconHibernate,
  IconAngular,
  IconJavaFX,
  IconGitLab,
  IconMaven,
  IconJest,
  IconPostgreSQL,
  IconMariaDB,
  IconPHP,
  IconFirebase,
  IconScikitLearn,
  IconTensorFlow,
  IconMatplotlib,
  IconNLP,
  IconFigma,
  IconPhotoshop,
  IconIllustrator,
  IconJira,
  IconTrello,
  IconSonarQube,
  IconXRay,
  IconNestJS,
  IconCertificate,
  IconSamsung,
} from '@components/icons';

const Icon = ({ name }) => {
  switch (name) {
    case 'AppStore':
      return <IconAppStore />;
    case 'Bookmark':
      return <IconBookmark />;
    case 'Codepen':
      return <IconCodepen />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'PlayStore':
      return <IconPlayStore />;
    case 'Star':
      return <IconStar />;
    case 'Twitter':
      return <IconTwitter />;
    case 'Java':
      return <IconJava />;
    case 'Python':
      return <IconPython />;
    case 'JavaScript':
      return <IconJavaScript />;
    case 'React':
      return <IconReact />;
    case 'Vue':
      return <IconVue />;
    case 'NodeJS':
      return <IconNodeJS />;
    case 'Django':
      return <IconDjango />;
    case 'Spring':
      return <IconSpring />;
    case 'Symfony':
      return <IconSymfony />;
    case 'Docker':
      return <IconDocker />;
    case 'MySQL':
      return <IconMySQL />;
    case 'MongoDB':
      return <IconMongoDB />;
    case 'Git':
      return <IconGit />;
    case 'Aws':
      return <IconAWS />;
    case 'Azure':
      return <IconAzure />;
    case 'TypeScript':
      return <IconTypeScript />;
    case 'PHP':
      return <IconPHP />;
    case 'PyTorch':
      return <IconPyTorch />;
    case 'Flutter':
      return <IconFlutter />;
    case 'DotNet':
      return <IconDotNet />;
    case 'C#':
    case 'CSharp':
      return <IconDotNet />;
    case 'Flask':
      return <IconFlask />;
    case 'Hibernate':
      return <IconHibernate />;
    case 'Angular':
      return <IconAngular />;
    case 'JavaFX':
      return <IconJavaFX />;
    case 'GitLab':
      return <IconGitLab />;
    case 'Maven':
      return <IconMaven />;
    case 'Jest':
      return <IconJest />;
    case 'PostgreSQL':
      return <IconPostgreSQL />;
    case 'MariaDB':
      return <IconMariaDB />;
    case 'Firebase':
      return <IconFirebase />;
    case 'Scikit-learn':
      return <IconScikitLearn />;
    case 'TensorFlow':
      return <IconTensorFlow />;
    case 'Matplotlib':
      return <IconMatplotlib />;
    case 'NLP':
      return <IconNLP />;
    case 'Figma':
      return <IconFigma />;
    case 'Photoshop':
      return <IconPhotoshop />;
    case 'Illustrator':
      return <IconIllustrator />;
    case 'Jira':
      return <IconJira />;
    case 'Trello':
      return <IconTrello />;
    case 'SonarQube':
      return <IconSonarQube />;
    case 'XRay':
      return <IconXRay />;
    case 'Nest.js':
    case 'NestJS':
    case 'Nest':
      return <IconNestJS />;
    case 'Certificate':
    case 'Award':
      return <IconCertificate />;
    case 'Samsung':
      return <IconSamsung />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
