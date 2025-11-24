import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GalleryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 25, 47, 0.98) 0%, rgba(2, 12, 27, 0.98) 100%);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.isVisible ? '1' : '0')};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

  img,
  video {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(100, 255, 218, 0.1);
    transition: transform 0.3s ease;
  }

  img:hover {
    transform: scale(1.02);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(100, 255, 218, 0.05) 100%);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 50%;
  color: var(--lightest-slate);
  cursor: pointer;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  backdrop-filter: blur(8px);

  svg {
    width: 28px;
    height: 28px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--green);
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.2) 0%, rgba(100, 255, 218, 0.1) 100%);
    border-color: var(--green);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 8px 20px rgba(100, 255, 218, 0.3);
  }

  &:active {
    transform: scale(1.05) rotate(90deg);
  }

  &:focus {
    outline: 2px solid rgba(100, 255, 218, 0.4);
    outline-offset: 2px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.direction === 'prev' ? 'left: 20px;' : 'right: 20px;')}
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.15) 0%, rgba(100, 255, 218, 0.08) 100%);
  border: 1px solid rgba(100, 255, 218, 0.3);
  color: var(--green);
  cursor: pointer;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  backdrop-filter: blur(8px);

  svg {
    width: 26px;
    height: 26px;
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      rgba(100, 255, 218, 0.25) 0%,
      rgba(100, 255, 218, 0.15) 100%
    );
    border-color: var(--green);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 20px rgba(100, 255, 218, 0.3);

    svg {
      transform: ${props => (props.direction === 'prev' ? 'translateX(-2px)' : 'translateX(2px)')};
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
  }

  &:focus {
    outline: 2px solid rgba(100, 255, 218, 0.4);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    border-color: var(--slate);
    color: var(--slate);
  }

  @media (max-width: 768px) {
    padding: 12px;
    ${props => (props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;')}

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const ImageCounter = styled.div`
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  color: var(--lightest-slate);
  text-align: center;
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(10, 25, 47, 0.7);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(100, 255, 218, 0.1);
  display: inline-block;
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
  width: 50px;
  height: 40px;
  border: 2px solid ${props => (props.isActive ? 'var(--green)' : 'rgba(100, 255, 218, 0.2)')};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: rgba(10, 25, 47, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => (props.isActive ? '1' : '0.6')};
  position: relative;
  box-shadow: ${props => (props.isActive ? '0 0 20px rgba(100, 255, 218, 0.4)' : 'none')};

  &:hover {
    opacity: 1;
    border-color: var(--green);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 16px rgba(100, 255, 218, 0.3);
  }

  &:active {
    transform: translateY(0) scale(1.02);
  }

  &:focus {
    outline: 2px solid rgba(100, 255, 218, 0.4);
    outline-offset: 2px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    color: var(--green);
    z-index: 1;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 35px;
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
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      }
    },
    [handleClose, handlePrevious, handleNext],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) {
    return null;
  }

  const isVideo = url => url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg'));

  const currentMedia = images[currentIndex];
  const isCurrentVideo = isVideo(currentMedia);

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

          {isCurrentVideo ? (
            <video
              src={currentMedia}
              controls
              autoPlay
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={currentMedia} alt={`Project screenshot ${currentIndex + 1}`} loading="lazy" />
          )}
        </ImageContainer>

        {images.length > 1 && (
          <>
            <ImageCounter>
              {currentIndex + 1} / {images.length}
            </ImageCounter>

            <ThumbnailContainer>
              {images.map((image, index) => {
                const isThumbnailVideo = isVideo(image);
                return (
                  <Thumbnail
                    key={index}
                    isActive={index === currentIndex}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`View ${isThumbnailVideo ? 'video' : 'image'} ${index + 1}`}
                  >
                    {isThumbnailVideo ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    ) : (
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    )}
                  </Thumbnail>
                );
              })}
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
