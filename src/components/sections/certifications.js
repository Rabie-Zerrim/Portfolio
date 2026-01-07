import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { withPrefix } from 'gatsby';

const StyledCertificationsSection = styled.section`
  max-width: 900px;
  margin: 0 auto 100px;

  .inner {
    display: flex;
    flex-direction: column;
  }
`;

const StyledCertificationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 50px 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledCertificationCard = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  background-color: var(--light-navy);
  border-radius: var(--border-radius);
  padding: 30px;
  border: 1px solid var(--lightest-navy);

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    border-color: var(--green);
  }

  .cert-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .cert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 60px;
    background: white;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .cert-badge {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--green), var(--navy));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    filter: drop-shadow(0 0 10px rgba(100, 255, 218, 0.3));
  }

  .cert-title {
    color: var(--lightest-slate);
    font-size: var(--fz-xl);
    font-weight: 600;
    margin: 0 0 10px;
    line-height: 1.3;
  }

  .cert-issuer {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    margin-bottom: 15px;
  }

  .cert-description {
    color: var(--slate);
    font-size: var(--fz-md);
    line-height: 1.5;
  }
`;

const Certifications = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const certifications = [
    {
      title: 'Samsung Innovation Campus Certificate',
      issuer: 'Samsung',
      description:
        'Project-oriented excellence program in AI & Data Science, focused on CNNs, ML pipeline optimization, and statistical model evaluation, applied to real-world use cases.',
      icon: '🎓',
      logo: '/Samsung-logo.png',
    },
    {
      title: 'AWS Academy Graduate - Cloud Foundations',
      issuer: 'Amazon Web Services (AWS)',
      description:
        'Foundational knowledge of cloud computing concepts, AWS services, security, architecture, and support.',
      icon: '☁️',
      logo: '/aws-logo.png',
    },
  ];

  return (
    <StyledCertificationsSection id="certifications" ref={revealContainer}>
      <h2 className="numbered-heading">Certifications</h2>

      <div className="inner">
        <StyledCertificationsList>
          {certifications.map((cert, i) => (
            <StyledCertificationCard key={i}>
              <div className="cert-header">
                <div className="cert-icon">
                  <img src={withPrefix(cert.logo)} alt={cert.issuer} />
                </div>
                <div className="cert-badge">{cert.icon}</div>
              </div>
              <h3 className="cert-title">{cert.title}</h3>
              <div className="cert-issuer">{cert.issuer}</div>
              <p className="cert-description">{cert.description}</p>
            </StyledCertificationCard>
          ))}
        </StyledCertificationsList>
      </div>
    </StyledCertificationsSection>
  );
};

export default Certifications;
