// components/CommentVideo.tsx
import React from 'react';
import OptimizedImage from './OptimizedImage';
import '../style2/CommentVideo.css';

const CommentVideo: React.FC = () => {
  return (
    <section className="comment-video">
      <div className="video-section">
        <h3>ویدئو معرفی محصولات</h3>
        <div className="video-container">
          <video controls poster="/assets/images/video-poster.webp">
            <source src="/assets/videos/intro-desktop.mp4" type="video/mp4" media="(min-width: 769px)" />
            <source src="/assets/videos/intro-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
            مرورگر شما از ویدئو پشتیبانی نمی‌کند
          </video>
        </div>
      </div>
      
      <div className="image-section">
        <h3>گالری تصاویر</h3>
        <div className="gallery-image">
          <OptimizedImage
            desktopSrc="/uploads/gallery-desktop.webp"
            mobileSrc="/uploads/gallery-mobile.webp"
            alt="گالری محصولات مبلمان"
          />
          <div className="image-overlay">
            <p>مشاهده گالری کامل</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentVideo;