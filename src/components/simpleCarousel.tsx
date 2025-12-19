// import { useEffect, useState } from "react";
// import "../styles/simpleCarousel.css";

// const images = [
//     "/images/carousel/img1.jpg",
//     "/images/carousel/img2.jpg",
//     "/images/carousel/img3.jpg",
// ];

// export default function SimpleCarousel() {
//     const [index, setIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIndex((prev) => (prev + 1) % images.length);
//         }, 10000); // هر ۱۰ ثانیه

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="carousel">
//             {images.map((img, i) => (
//                 <img
//                     key={i}
//                     src={img}
//                     className={`carousel-image ${i === index ? "active" : ""}`}
//                     alt="slide"
//                 />
//             ))}

//             <div className="dots">
//                 {images.map((_, i) => (
//                     <span
//                         key={i}
//                         className={i === index ? "dot active" : "dot"}
//                         onClick={() => setIndex(i)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';

interface CarouselProps {
    images: Array<{
        id: number;
        url: string;
        title: string;
    }>;
    showArrows?: boolean;
    autoPlay?: boolean;
    interval?: number;
}

const SimpleCarousel: React.FC<CarouselProps> = ({
    images,
    showArrows = true,
    autoPlay = true,
    interval = 5000
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (autoPlay && images.length > 1) {
            const timer = setInterval(() => {
                goToNext();
            }, interval);
            return () => clearInterval(timer);
        }
    }, [currentIndex, autoPlay, interval, images.length]);

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
                    <img
                        src="/images/default-banner.jpg"
                        alt="Default banner"
                        className="carousel-image"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="carousel-container">
            {showArrows && images.length > 1 && (
                <>
                    <div className="carousel-arrow left" onClick={goToPrevious}>
                        ❮
                    </div>
                    <div className="carousel-arrow right" onClick={goToNext}>
                        ❯
                    </div>
                </>
            )}

            <div className="carousel-slide">
                <img
                    src={`http://localhost:5000${images[currentIndex].url}`}
                    alt={images[currentIndex].title}
                    className="carousel-image"
                />
                <div className="carousel-title">
                    <h3>{images[currentIndex].title}</h3>
                </div>
            </div>

            {images.length > 1 && (
                <div className="carousel-dots">
                    {images.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            className={`carousel-dot ${slideIndex === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(slideIndex)}
                        >
                            ●
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimpleCarousel;