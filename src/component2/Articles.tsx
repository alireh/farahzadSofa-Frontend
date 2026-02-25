// // components/Articles.tsx (آپدیت شده)
// import React, { useState, useEffect } from 'react';
// import '../style2/Articles.css';
// import ArticleModal from './ArticleModal';


// interface Article {
//   id: number;
//   title: string;
//   summary: string;
//   image: string;
//   desktopImage: string;
//   mobileImage: string;
//   date: string;
//   author: string;
//   readTime: string;
//   category: string;
//   fullContent?: string;
// }

// const Articles: React.FC = () => {
//   const [showAll, setShowAll] = useState(false);
//   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [visibleCount, setVisibleCount] = useState(4);


//   const visibleArticles = showAll ? allArticles : allArticles.slice(0, visibleCount);

// const handleShowMore = () => {
//   setVisibleCount(prev => prev + 4);
// };

  

//   useEffect(() => {
//   fetch(`/api/articles?take=${visibleCount}`)
//     .then(r => r.json())
//     .then(setArticles);
// }, [visibleCount]);

//   const handleReadMore = (article: Article) => {
//     setSelectedArticle(article);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedArticle(null);
//   };

//   return (
//     <section className="articles">
//       <div className="articles-header">
//         <h2 className="section-title">آخرین مقالات</h2>
//         <p className="articles-subtitle">با مطالعه مقالات ما، از آخرین ترندها و نکات دکوراسیون مطلع شوید</p>
//       </div>
      
//       <div className="articles-grid">
//         {visibleArticles.map((article) => (
//           <div key={article.id} className="article-card">
//             <div className="article-image">
//               <picture>
//                 <source media="(max-width: 768px)" srcSet={article.mobileImage} />
//                 <source media="(min-width: 769px)" srcSet={article.desktopImage} />
//                 <img src={article.image} alt={article.title} loading="lazy" />
//               </picture>
//               <span className="read-time">{article.readTime} مطالعه</span>
//               <span className="article-category">{article.category}</span>
//             </div>
            
//             <div className="article-content">
//               <h3>{article.title}</h3>
//               <p className="article-summary">{article.summary}</p>
              
//               {/* <div className="article-meta">
//                 <div className="article-author">
//                   <span className="author-icon">✍️</span>
//                   <span>{article.author}</span>
//                 </div>
//                 <div className="article-date">
//                   <span className="date-icon">📅</span>
//                   <span>{article.date}</span>
//                 </div>
//               </div> */}
              
//               <button 
//                 className="read-more-btn" 
//                 onClick={() => handleReadMore(article)}
//               >
//                 ادامه مطلب
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {!showAll && allArticles.length > visibleCount && (
//         <div className="articles-footer">
//           <button className="view-all-btn" onClick={handleShowMore}>
//             مقالات بیشتر (+{allArticles.length - visibleCount})
//           </button>
//         </div>
//       )}

//       {/* مودال مقاله */}
//       <ArticleModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         article={selectedArticle}
//       />
//     </section>
//   );
// };

// export default Articles;



import React, { useEffect, useState } from "react";
import "../style2/Articles.css";
import ArticleModal from "./ArticleModal";

interface Article {
  id: number;
  title: string;
  summary: string;
  image: string;
  desktop_image: string;
  mobile_image: string;
  author: string;
  read_time: string;
  category: string;
  full_content?: string;
  created_at: string;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // گرفتن دیتا از سرور
  useEffect(() => {
    fetch(`/api/articles?take=${visibleCount}`)
      .then(res => res.json())
      .then(data => setArticles(data));
  }, [visibleCount]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <section className="articles">
      <div className="articles-header">
        <h2 className="section-title">آخرین مقالات</h2>
      </div>

      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-image">
              <picture>
                <source media="(max-width: 768px)" srcSet={article.mobile_image} />
                <source media="(min-width: 769px)" srcSet={article.desktop_image} />
                <img src={article.image} alt={article.title} />
              </picture>

              <span className="read-time">{article.read_time}</span>
              <span className="article-category">{article.category}</span>
            </div>

            <div className="article-content">
              <h3>{article.title}</h3>
              <p className="article-summary">{article.summary}</p>

              <button
                className="read-more-btn"
                onClick={() => handleReadMore(article)}
              >
                ادامه مطلب
              </button>
            </div>
          </div>
        ))}
      </div>

      {articles.length >= visibleCount && (
        <div className="articles-footer">
          <button className="view-all-btn" onClick={handleShowMore}>
            مقالات بیشتر
          </button>
        </div>
      )}

      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={selectedArticle}
      />
    </section>
  );
};

export default Articles;