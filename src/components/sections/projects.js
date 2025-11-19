import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import TechIcon from '@components/icons/tech';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const FilterControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-family: var(--font-mono);
  font-size: var(--fz-md);
  background-color: var(--light-navy);
  border: 2px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  color: var(--lightest-slate);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--green);
    background-color: var(--navy);
  }

  &::placeholder {
    color: var(--slate);
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  background-color: ${props => props.active ? 'var(--green)' : 'transparent'};
  color: ${props => props.active ? 'var(--navy)' : 'var(--green)'};
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--green-tint);
    color: ${props => props.active ? 'var(--navy)' : 'var(--green)'};
  }

  &:focus {
    outline: none;
  }
`;

const SortSelect = styled.select`
  padding: 10px 15px;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  background-color: var(--light-navy);
  color: var(--lightest-slate);
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    border-color: var(--green);
    background-color: var(--navy);
  }

  &:focus {
    outline: none;
    border-color: var(--green);
  }

  option {
    background-color: var(--navy);
  }
`;

const ResultsCount = styled.div`
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  color: var(--slate);
  margin-top: 20px;
  text-align: center;
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;
    margin-bottom: 10px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    margin-top: 0;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 2px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              date
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Extract all unique technologies
  const allTechs = new Set();
  data.projects.edges.forEach(({ node }) => {
    node.frontmatter.tech?.forEach(tech => allTechs.add(tech));
  });
  const techFilters = ['All', ...Array.from(allTechs).sort()];

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  // Filter and sort projects
  const GRID_LIMIT = 6;
  let projects = data.projects.edges.filter(({ node }) => node);

  // Apply search filter
  if (searchTerm) {
    projects = projects.filter(({ node }) => {
      const { title, tech } = node.frontmatter;
      const htmlText = node.html.replace(/<[^>]*>/g, ''); // Strip HTML tags
      const searchLower = searchTerm.toLowerCase();
      
      return (
        title.toLowerCase().includes(searchLower) ||
        htmlText.toLowerCase().includes(searchLower) ||
        tech?.some(t => t.toLowerCase().includes(searchLower))
      );
    });
  }

  // Apply tech filter
  if (selectedTech !== 'All') {
    projects = projects.filter(({ node }) => 
      node.frontmatter.tech?.includes(selectedTech)
    );
  }

  // Apply sorting
  projects = [...projects].sort((a, b) => {
    const nodeA = a.node.frontmatter;
    const nodeB = b.node.frontmatter;

    if (sortBy === 'date') {
      return new Date(nodeB.date) - new Date(nodeA.date);
    } else if (sortBy === 'title') {
      return nodeA.title.localeCompare(nodeB.title);
    }
    return 0;
  });

  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a href={github || external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>
                  <TechIcon name={tech} />
                </li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection id="projects">
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view the archive
      </Link>

      <FilterControls>
        <SearchBar
          type="text"
          placeholder="🔍 Search projects by title, description, or technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterRow>
          <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fz-xs)' }}>
            Filter:
          </span>
          {techFilters.slice(0, 8).map((tech) => (
            <FilterButton
              key={tech}
              active={selectedTech === tech}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </FilterButton>
          ))}
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </SortSelect>
        </FilterRow>
      </FilterControls>

      <ResultsCount>
        Showing {projectsToShow.length} of {projects.length} projects
      </ResultsCount>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <StyledProject key={i}>{projectInner(node)}</StyledProject>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    key={i}
                    ref={el => (revealProjects.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {projectInner(node)}
                  </StyledProject>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;
