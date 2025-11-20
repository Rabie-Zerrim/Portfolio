import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { usePrefersReducedMotion } from '@hooks';

const StyledImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--green);
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    transition: var(--transition);
    background-color: var(--navy);
    mix-blend-mode: screen;
  }

  &:hover,
  &:focus {
    background: transparent;
    outline: 0;

    &:before {
      background: transparent;
    }

    .img {
      filter: none !important;
    }
  }
`;

const StyledCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--green);
  border-radius: var(--border-radius);

  &:hover {
    background: transparent;

    .img {
      filter: none !important;
    }

    .carousel-controls {
      opacity: 1;
    }

    ${StyledImageContainer}:before {
      background: transparent;
    }
  }
`;

/* StyledImageContainer moved earlier to avoid use-before-define */

const StyledControlButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--lightest-navy);
  color: var(--lightest-slate);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition);
  z-index: 3;

  &:hover {
    background: var(--green);
    color: var(--navy);
  }

  ${StyledCarouselContainer}:hover & {
    opacity: 0.9;
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }

  @media (max-width: 768px) {
    opacity: 1;
    width: 24px;
    height: 24px;
  }
`;

const StyledDots = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 10px;

  .carousel-controls & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const StyledDot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.active ? 'var(--green)' : 'rgba(255, 255, 255, 0.5)')};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => (props.active ? 'var(--green)' : 'rgba(255, 255, 255, 0.8)')};
  }
`;

const ImageCarousel = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const timerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    // don't start if user prefers reduced motion, hovered, or not enough images
    if (prefersReducedMotion || !images || images.length <= 1 || isHoveredRef.current) {
      return;
    }
    clearTimer();
    timerRef.current = setInterval(() => {
      setCurrentIndex(current => (current + 1) % images.length);
    }, 5000);
  }, [images, prefersReducedMotion]);

  const nextSlide = e => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(current => (current + 1) % images.length);
  };

  const prevSlide = e => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(current => (current - 1 + images.length) % images.length);
  };

  const goToSlide = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // autoplay effect: start when images are available and component mounts
  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    clearTimer();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    startTimer();
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <StyledCarouselContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <StyledImageContainer onClick={onImageClick}>
        <GatsbyImage
          image={images[currentIndex].gatsbyImageData}
          alt="Project Demo"
          className="img"
          style={{
            height: '100%',
            mixBlendMode: 'multiply',
            filter: 'grayscale(100%) contrast(1) brightness(90%)',
            borderRadius: 'var(--border-radius)',
          }}
          imgStyle={{
            transition: 'var(--transition)',
            borderRadius: 'var(--border-radius)',
          }}
        />
      </StyledImageContainer>

      {images.length > 1 && (
        <div
          className="carousel-controls"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          <StyledControlButton
            className="prev"
            onClick={prevSlide}
            style={{ pointerEvents: 'auto' }}
            aria-label="Previous image"
          >
            ←
          </StyledControlButton>
          <StyledControlButton
            className="next"
            onClick={nextSlide}
            style={{ pointerEvents: 'auto' }}
            aria-label="Next image"
          >
            →
          </StyledControlButton>
          <StyledDots style={{ pointerEvents: 'auto' }}>
            {images.map((_, index) => (
              <StyledDot
                key={index}
                active={index === currentIndex}
                onClick={e => goToSlide(e, index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </StyledDots>
        </div>
      )}
    </StyledCarouselContainer>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      gatsbyImageData: PropTypes.object,
    }),
  ).isRequired,
  onImageClick: PropTypes.func,
};

ImageCarousel.defaultProps = {
  onImageClick: () => {},
};

export default ImageCarousel;
