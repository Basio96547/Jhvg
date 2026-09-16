import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  onClick?: () => void;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showPlayPause?: boolean;
  infinite?: boolean;
  itemsPerView?: number;
  spacing?: number;
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide';
  className?: string;
  onItemClick?: (item: CarouselItem, index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  showPlayPause = false,
  infinite = true,
  itemsPerView = 1,
  spacing = 16,
  aspectRatio = 'photo',
  className = '',
  onItemClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  // Auto play functionality
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && !isHovered && totalItems > itemsPerView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (infinite) {
            return prev >= maxIndex ? 0 : prev + 1;
          }
          return prev >= maxIndex ? prev : prev + 1;
        });
      }, autoPlayInterval);
    }
  }, [isPlaying, isHovered, totalItems, itemsPerView, maxIndex, infinite, autoPlayInterval]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    if (infinite && currentIndex === 0) {
      setCurrentIndex(maxIndex);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (infinite && currentIndex >= maxIndex) {
      setCurrentIndex(0);
    } else if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && (!isRTL || isRTL)) {
      goToNext();
    }
    if (isRightSwipe && (!isRTL || isRTL)) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        isRTL ? goToNext() : goToPrevious();
      } else if (e.key === 'ArrowRight') {
        isRTL ? goToPrevious() : goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    if (isHovered) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered, isPlaying, isRTL]);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]',
    wide: 'aspect-[21/9]',
  };

  const translateX = isRTL 
    ? `translateX(${currentIndex * (100 / itemsPerView)}%)`
    : `translateX(-${currentIndex * (100 / itemsPerView)}%)`;

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={carouselRef}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: translateX,
            gap: `${spacing}px`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex-shrink-0 ${aspectRatioClasses[aspectRatio]} cursor-pointer relative overflow-hidden bg-gray-200 rounded-lg`}
              style={{ width: `calc(${100 / itemsPerView}% - ${spacing * (itemsPerView - 1) / itemsPerView}px)` }}
              onClick={() => {
                onItemClick?.(item, index);
                item.onClick?.();
              }}
            >
              <img
                src={item.image}
                alt={item.title || `Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content overlay */}
              {(item.title || item.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {item.title && (
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                  )}
                </div>
              )}

              {/* Fullscreen button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(true);
                }}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && totalItems > itemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!infinite && currentIndex === 0}
            className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110`}
          >
            {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <button
            onClick={goToNext}
            disabled={!infinite && currentIndex >= maxIndex}
            className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110`}
          >
            {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </>
      )}

      {/* Play/Pause controls */}
      {showPlayPause && (
        <div className="absolute top-4 left-4 flex space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setCurrentIndex(0)}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Dots indicator */}
      {showDots && totalItems > 1 && (
        <div className="flex justify-center space-x-2 space-x-reverse mt-4">
          {Array.from({ length: Math.ceil(totalItems / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {autoPlay && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ 
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%` 
            }}
          />
        </div>
      )}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            ✕
          </button>
          <img
            src={items[currentIndex]?.image}
            alt={items[currentIndex]?.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;