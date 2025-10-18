import React, { useState, useEffect, useCallback } from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

const StyledCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
  background-color: var(--green);

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--navy);
    mix-blend-mode: screen;
    transition: var(--transition);
  }

  &:hover {
    &:before {
      background: transparent;
    }
    .img {
      filter: none !important;
    }
  }
`;

const StyledImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--border-radius);
  vertical-align: middle;
  overflow: hidden;

  .img {
    border-radius: var(--border-radius);
    mix-blend-mode: multiply;
    filter: grayscale(100%) contrast(1) brightness(90%);
    transition: var(--transition);

    @media (max-width: 768px) {
      object-fit: cover;
      width: 100%;
      height: 100%;
      filter: grayscale(100%) contrast(1) brightness(50%);
    }
  }
`;



const StyledDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const StyledDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.active ? 'var(--green)' : 'var(--light-slate)')};
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !images || images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(current => (current + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images, prefersReducedMotion]);

  if (!images || !Array.isArray(images) || images.length === 0) return null;
  if (images.some(img => !img)) return null;

  return (
    <StyledCarouselContainer>
      <StyledImageContainer>
        <GatsbyImage
          image={images[currentIndex]}
          alt={`Project demo ${currentIndex + 1}`}
          className="img"
        />
      </StyledImageContainer>

      {images.length > 1 && (
        <StyledDots>
          {images.map((_, index) => (
            <StyledDot
              key={index}
              active={index === currentIndex}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </StyledDots>
      )}
    </StyledCarouselContainer>
  );
};

export default ImageCarousel;