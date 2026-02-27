// components/CommentVideo.tsx
import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import '../style2/CommentVideo.css';

const CommentVideo: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetch("/api/get-video")
      .then(res => res.json())
      .then(data => {
        setVideoUrl(data.url);
      });
  }, []);

  useEffect(() => {
    fetch("/api/get-image")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImageUrl(data.url);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="comment-video">
      <div className="video-section">
        <h3>ویدئو معرفی محصولات</h3>
        <div className="video-container">
          <video controls poster="/assets/images/video-poster.webp">
            {/* <source src="/assets/videos/intro-desktop.mp4" type="video/mp4" media="(min-width: 769px)" />
            <source src="/assets/videos/intro-mobile.mp4" type="video/mp4" media="(max-width: 768px)" /> */}
            {videoUrl && (<source src={videoUrl} type="video/mp4" media="(min-width: 769px)" />)}
            مرورگر شما از ویدئو پشتیبانی نمی‌کند
          </video>
        </div>
      </div>

      <div className="image-section">
        <div className="gallery-image">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="uploaded"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentVideo;