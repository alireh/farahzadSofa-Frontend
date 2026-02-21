// components/Articles.tsx
import React from 'react';
import '../style2/Articles.css';

interface Article1 {
    id: number;
    title: string;
    summary: string;
    image: string;
    date: string;
    author: string;
    readTime: string;
}

const Articles1: React.FC = () => {
    const articles: Article1[] = [
        {
            id: 1,
            title: 'راهنمای انتخاب مبلمان مناسب برای آپارتمان‌های کوچک',
            summary: 'با افزایش قیمت مسکن و کوچک‌تر شدن آپارتمان‌ها، انتخاب مبلمان مناسب برای فضاهای کوچک به یک چالش تبدیل شده است...',
            image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '۱۵ بهمن ۱۴۰۴',
            author: 'زهرا محمدی',
            readTime: '۵ دقیقه'
        },
        {
            id: 2,
            title: 'ترندهای دکوراسیون داخلی در سال ۲۰۲۵',
            summary: 'هر ساله طراحان دکوراسیون داخلی ترندهای جدیدی را معرفی می‌کنند که می‌تواند به شما در چیدمان منزل کمک کند. در این مقاله با جدیدترین ترندها آشنا شوید...',
            image: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVjb3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
            date: '۸ بهمن ۱۴۰۴',
            author: 'علی رضایی',
            readTime: '۷ دقیقه'
        },
        {
            id: 3,
            title: 'نکات مهم در خرید اکسسوری منزل',
            summary: 'اکسسوری‌ها نقش مهمی در زیبایی و جذابیت دکوراسیون منزل دارند. اما خرید آنها نیز اصول و نکات خاص خود را دارد که باید به آن توجه کنید...',
            image: 'https://plus.unsplash.com/premium_photo-1683121204018-28c83440bb8c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI3fHxkZWNvcmF0aW9ufGVufDB8fDB8fHww',
            date: '۲ بهمن ۱۴۰۴',
            author: 'سارا کریمی',
            readTime: '۴ دقیقه'
        },
        {
            id: 4,
            title: 'روش‌های نوین در تولید مبلمان با چوب بازیافتی',
            summary: 'با توجه به اهمیت حفظ محیط زیست، استفاده از چوب‌های بازیافتی در تولید مبلمان رو به افزایش است. در این مقاله با فرآیند تولید این محصولات آشنا می‌شوید...',
            image: 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            date: '۲۵ دی ۱۴۰۴',
            author: 'مهدی حسینی',
            readTime: '۶ دقیقه'
        }
    ];

    return (
        <section className="articles">
            <div className="articles-header">
                <h2 className="section-title">آخرین مقالات</h2>
                <p className="articles-subtitle">با مطالعه مقالات ما، از آخرین ترندها و نکات دکوراسیون مطلع شوید</p>
            </div>

            <div className="articles-grid">
                {articles.map((article) => (
                    <div key={article.id} className="article-card">
                        <div className="article-image">
                            <img src={article.image} alt={article.title} />
                            <span className="read-time">{article.readTime} مطالعه</span>
                        </div>

                        <div className="article-content">
                            <h3>{article.title}</h3>
                            <p className="article-summary">{article.summary}</p>

                            <div className="article-meta">
                                <div className="article-author">
                                    <span className="author-icon">✍️</span>
                                    <span>{article.author}</span>
                                </div>
                                <div className="article-date">
                                    <span className="date-icon">📅</span>
                                    <span>{article.date}</span>
                                </div>
                            </div>

                            <button className="read-more-btn">ادامه مطلب</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="articles-footer">
                <button className="view-all-btn">مشاهده همه مقالات</button>
            </div>
        </section>
    );
};

export default Articles1;