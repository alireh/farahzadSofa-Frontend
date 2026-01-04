import React, { useState, useEffect } from 'react';
import '../styles/simpleCarousel.css';
import { getImgUrl } from '../util/general';
const HOST_URL = "";//const HOST_URL = process.env.REACT_APP_HOST_URL;

interface CarouselProps {
    images: Array<{
        id: number;
        url: string;
        title: string;
    }>;
    showArrows?: boolean;
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    showTitle?: boolean;
}

const SimpleCarousel: React.FC<CarouselProps> = ({
    images,
    showArrows = true,
    autoPlay = true,
    interval = 5000,
    showDots = true,
    showTitle = true
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (autoPlay && images.length > 1 && !isHovered) {
            const timer = setInterval(() => {
                goToNext();
            }, interval);
            return () => clearInterval(timer);
        }
    }, [currentIndex, autoPlay, interval, images.length, isHovered]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) {
        return (
            <div className="carousel-container">
                <div className="carousel-slide">
                    <div className="no-image-placeholder">
                        <span>بدون تصویر</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="carousel-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* فلش‌های ناوبری */}
            {showArrows && images.length > 1 && (
                <>
                    <button
                        className="carousel-arrow arrow-left"
                        onClick={goToPrevious}
                        aria-label="تصویر قبلی"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        className="carousel-arrow arrow-right"
                        onClick={goToNext}
                        aria-label="تصویر بعدی"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}

            {/* اسلایدها */}
            <div className="carousel-slides-wrapper">
                <div className="carousel-slide">
                    <img
                        src={`${getImgUrl(HOST_URL, images[currentIndex].url)}`}
                        alt={images[currentIndex].title}
                        className="carousel-image"
                        loading="lazy"
                    />

                    {showTitle && images[currentIndex].title && (
                        <div className="carousel-title-overlay">
                            <div className="title-content">
                                <h3>{images[currentIndex].title}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* نقاط ناوبری */}
            {showDots && images.length > 1 && (
                <div className="carousel-dots-container">
                    {images.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            className={`carousel-dot ${slideIndex === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(slideIndex)}
                            aria-label={`رفتن به اسلاید ${slideIndex + 1}`}
                        >
                            <div className="dot-inner"></div>
                        </button>
                    ))}
                </div>
            )}

            {/* شماره اسلاید */}
            {images.length > 1 && (
                <div className="slide-counter">
                    <span className="current-slide">{currentIndex + 1}</span>
                    <span className="total-slides">/{images.length}</span>
                </div>
            )}
        </div>
    );
};

export default SimpleCarousel;