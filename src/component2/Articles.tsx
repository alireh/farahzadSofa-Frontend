// components/Articles.tsx (آپدیت شده)
import React, { useState } from 'react';
import '../style2/Articles.css';
import ArticleModal from './ArticleModal';


interface Article {
  id: number;
  title: string;
  summary: string;
  image: string;
  desktopImage: string;
  mobileImage: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  fullContent?: string;
}

const Articles: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allArticles: Article[] = [
    {
      id: 1,
      title: 'راهنمای انتخاب مبلمان مناسب برای آپارتمان‌های کوچک',
      summary: 'با افزایش قیمت مسکن و کوچک‌تر شدن آپارتمان‌ها، انتخاب مبلمان مناسب برای فضاهای کوچک به یک چالش تبدیل شده است. در این مقاله نکات مهم برای انتخاب مبلمان در فضاهای کوچک را بررسی می‌کنیم.',
      image: '/assets/images/articles/small-apartment.webp',
      desktopImage: '/assets/images/articles/small-apartment-desktop.webp',
      mobileImage: '/assets/images/articles/small-apartment-mobile.webp',
      date: '۱۵ بهمن ۱۴۰۴',
      author: 'زهرا محمدی',
      readTime: '۵ دقیقه',
      category: 'راهنمای خرید'
    },
    {
      id: 2,
      title: 'ترندهای دکوراسیون داخلی در سال ۲۰۲۵',
      summary: 'هر ساله طراحان دکوراسیون داخلی ترندهای جدیدی را معرفی می‌کنند که می‌تواند به شما در چیدمان منزل کمک کند. در این مقاله با جدیدترین ترندهای دکوراسیون داخلی برای سال ۲۰۲۵ آشنا می‌شوید.',
      image: '/assets/images/articles/trends.webp',
      desktopImage: '/assets/images/articles/trends-desktop.webp',
      mobileImage: '/assets/images/articles/trends-mobile.webp',
      date: '۸ بهمن ۱۴۰۴',
      author: 'علی رضایی',
      readTime: '۷ دقیقه',
      category: 'دکوراسیون'
    },
    {
      id: 3,
      title: 'نکات مهم در خرید اکسسوری منزل',
      summary: 'اکسسوری‌ها نقش مهمی در زیبایی و جذابیت دکوراسیون منزل دارند. اما خرید آنها نیز اصول و نکات خاص خود را دارد که در این مقاله به آنها می‌پردازیم.',
      image: '/assets/images/articles/accessories.webp',
      desktopImage: '/assets/images/articles/accessories-desktop.webp',
      mobileImage: '/assets/images/articles/accessories-mobile.webp',
      date: '۲ بهمن ۱۴۰۴',
      author: 'سارا کریمی',
      readTime: '۴ دقیقه',
      category: 'اکسسوری'
    },
    {
      id: 4,
      title: 'روش‌های نوین در تولید مبلمان با چوب بازیافتی',
      summary: 'با توجه به اهمیت حفظ محیط زیست، استفاده از چوب‌های بازیافتی در تولید مبلمان رو به افزایش است. در این مقاله با فرآیند تولید این محصولات و مزایای آن آشنا می‌شوید.',
      image: '/assets/images/articles/recycled-wood.webp',
      desktopImage: '/assets/images/articles/recycled-wood-desktop.webp',
      mobileImage: '/assets/images/articles/recycled-wood-mobile.webp',
      date: '۲۵ دی ۱۴۰۴',
      author: 'مهدی حسینی',
      readTime: '۶ دقیقه',
      category: 'محیط زیست'
    },
    {
      id: 5,
      title: 'رنگ‌های پرطرفدار در دکوراسیون ۱۴۰۴',
      summary: 'هر سال رنگ‌های خاصی در دکوراسیون داخلی محبوب می‌شوند. امسال رنگ‌های طبیعی و خاکی طرفداران زیادی پیدا کرده‌اند. در این مقاله با این رنگ‌ها آشنا شوید.',
      image: '/assets/images/articles/colors.webp',
      desktopImage: '/assets/images/articles/colors-desktop.webp',
      mobileImage: '/assets/images/articles/colors-mobile.webp',
      date: '۱۸ دی ۱۴۰۴',
      author: 'نرگس حسینی',
      readTime: '۵ دقیقه',
      category: 'رنگ'
    },
    {
      id: 6,
      title: 'چیدمان مبلمان در خانه‌های مدرن',
      summary: 'چیدمان اصولی مبلمان می‌تواند فضا را بزرگ‌تر و زیباتر نشان دهد. در این مقاله با اصول چیدمان مدرن آشنا می‌شوید و یاد می‌گیرید چگونه فضایی زیبا و کاربردی ایجاد کنید.',
      image: '/assets/images/articles/modern-arrangement.webp',
      desktopImage: '/assets/images/articles/modern-arrangement-desktop.webp',
      mobileImage: '/assets/images/articles/modern-arrangement-mobile.webp',
      date: '۱۰ دی ۱۴۰۴',
      author: 'کامران صادقی',
      readTime: '۸ دقیقه',
      category: 'چیدمان'
    },
    {
      id: 7,
      title: 'مراقبت از مبلمان چرمی',
      summary: 'مبلمان چرمی نیاز به مراقبت ویژه دارند. با رعایت چند نکته ساده می‌توانید عمر مبلمان چرمی خود را افزایش دهید و همیشه آن را مثل روز اول نگه دارید.',
      image: '/assets/images/articles/leather-care.webp',
      desktopImage: '/assets/images/articles/leather-care-desktop.webp',
      mobileImage: '/assets/images/articles/leather-care-mobile.webp',
      date: '۵ دی ۱۴۰۴',
      author: 'رضا محمدی',
      readTime: '۴ دقیقه',
      category: 'نگهداری'
    },
    {
      id: 8,
      title: 'مبلمان مناسب برای خانه‌های کلاسیک',
      summary: 'خانه‌های کلاسیک نیاز به مبلمان خاصی دارند. در این مقاله با ویژگی‌های مبلمان کلاسیک و نحوه انتخاب آن برای خانه‌های با سبک کلاسیک آشنا می‌شوید.',
      image: '/assets/images/articles/classic-furniture.webp',
      desktopImage: '/assets/images/articles/classic-furniture-desktop.webp',
      mobileImage: '/assets/images/articles/classic-furniture-mobile.webp',
      date: '۲۸ آذر ۱۴۰۴',
      author: 'لیلا کریمی',
      readTime: '۶ دقیقه',
      category: 'کلاسیک'
    }
  ];

  const visibleArticles = showAll ? allArticles : allArticles.slice(0, visibleCount);

  const handleShowMore = () => {
    setShowAll(true);
    setVisibleCount(allArticles.length);
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
        <p className="articles-subtitle">با مطالعه مقالات ما، از آخرین ترندها و نکات دکوراسیون مطلع شوید</p>
      </div>
      
      <div className="articles-grid">
        {visibleArticles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-image">
              <picture>
                <source media="(max-width: 768px)" srcSet={article.mobileImage} />
                <source media="(min-width: 769px)" srcSet={article.desktopImage} />
                <img src={article.image} alt={article.title} loading="lazy" />
              </picture>
              <span className="read-time">{article.readTime} مطالعه</span>
              <span className="article-category">{article.category}</span>
            </div>
            
            <div className="article-content">
              <h3>{article.title}</h3>
              <p className="article-summary">{article.summary}</p>
              
              {/* <div className="article-meta">
                <div className="article-author">
                  <span className="author-icon">✍️</span>
                  <span>{article.author}</span>
                </div>
                <div className="article-date">
                  <span className="date-icon">📅</span>
                  <span>{article.date}</span>
                </div>
              </div> */}
              
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
      
      {!showAll && allArticles.length > visibleCount && (
        <div className="articles-footer">
          <button className="view-all-btn" onClick={handleShowMore}>
            مقالات بیشتر (+{allArticles.length - visibleCount})
          </button>
        </div>
      )}

      {/* مودال مقاله */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={selectedArticle}
      />
    </section>
  );
};

export default Articles;