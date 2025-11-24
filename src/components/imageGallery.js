import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GalleryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  padding: 20px;
`;

const GalleryContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 80vh;

  img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: transparent;
  border: none;
  color: var(--lightest-slate);
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  z-index: 1001;

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    color: var(--green);
  }

  &:focus {
    outline: none;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;')}
  background-color: rgba(10, 25, 47, 0.8);
  border: 1px solid var(--green);
  color: var(--green);
  cursor: pointer;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
  z-index: 1001;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: var(--green-tint);
    border-color: var(--green);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: var(--slate);
    color: var(--slate);
  }

  @media (max-width: 768px) {
    padding: 10px;
    ${props => (props.direction === 'prev' ? 'left: 5px;' : 'right: 5px;')}

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ImageCounter = styled.div`
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  color: var(--slate);
  text-align: center;
  margin-top: 10px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px 0;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const Thumbnail = styled.button`
  width: 80px;
  height: 60px;
  border: 2px solid ${props => (props.isActive ? 'var(--green)' : 'transparent')};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: var(--transition);
  opacity: ${props => (props.isActive ? '1' : '0.6')};

  &:hover {
    opacity: 1;
    border-color: var(--green);
  }

  &:focus {
    outline: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 45px;
  }
`;

const ImageGallery = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger visibility after mount for smooth animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevent body scroll when gallery is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  }, [onClose]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') {handleClose();}
      if (e.key === 'ArrowLeft') {handlePrevious();}
      if (e.key === 'ArrowRight') {handleNext();}
    },
    [handleClose, handlePrevious, handleNext],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) {return null;}

  return (
    <GalleryOverlay isVisible={isVisible} onClick={handleClose}>
      <GalleryContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose} aria-label="Close gallery">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </CloseButton>

        <ImageContainer>
          {images.length > 1 && (
            <>
              <NavigationButton
                direction="prev"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </NavigationButton>

              <NavigationButton direction="next" onClick={handleNext} aria-label="Next image">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </NavigationButton>
            </>
          )}

          <img
            src={images[currentIndex]}
            alt={`Project screenshot ${currentIndex + 1}`}
            loading="lazy"
          />
        </ImageContainer>

        {images.length > 1 && (
          <>
            <ImageCounter>
              {currentIndex + 1} / {images.length}
            </ImageCounter>

            <ThumbnailContainer>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  isActive={index === currentIndex}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailContainer>
          </>
        )}
      </GalleryContainer>
    </GalleryOverlay>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

ImageGallery.defaultProps = {
  initialIndex: 0,
};

export default ImageGallery;
