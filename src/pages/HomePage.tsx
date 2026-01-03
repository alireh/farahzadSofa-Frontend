import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Category, Product, SiteData, SocialLink } from "../types";
import "../styles/website.css";
import Footer from "../components/footer";
import '../constant/pageSectionType'
import SimpleCarousel from "../components/simpleCarousel";
import SEOHead from "../SEOHead";
import { getImgUrl, toPersianDigits } from "../util/general";
import ContactForm from "./ContactForm";
import Header from "./Header";
const Host_Url = process.env.REACT_APP_HOST_URL;

enum PageSectionType {
  gallery = "gallery",
  Blog = "blog",
  Contact = "contact",
  About = "about",
}

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const HomePage: React.FC = () => {
  const contactUsSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const aboutUsSectionRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showFullArticle, setShowFullArticle] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);


  // بررسی اینکه کاربر لاگین کرده یا نه
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // استفاده از useMemo برای بهینه‌سازی
  const sectionRefs = useMemo(() => ({
    [PageSectionType.gallery]: gallerySectionRef,
    [PageSectionType.Blog]: blogSectionRef,
    [PageSectionType.Contact]: contactUsSectionRef,
    [PageSectionType.About]: aboutUsSectionRef,
  }), []);

  useEffect(() => {
    fetchData();
    fetchArticles();
    // بررسی وضعیت لاگین کاربر
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);


    fetchCategories();
    fetchSocialLinks();

  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/socials`);
      setSocialLinks(response.data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const renderSocialIcons = () => {
    if (!data || !data.socialLinks || data.socialLinks.length === 0) {
      return null;
    }

    return (
      <div className="social-section">
        <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
        <div className="social-icons">
          {data.socialLinks
            .filter(link => link.is_active)
            .sort((a, b) => a.display_order - b.display_order)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={link.platform}
              >
                {link.icon ? (
                  <img
                    src={`${getImgUrl(Host_Url, link.icon)}`}
                    alt={link.platform}
                    className="social-icon-img"
                    onError={(e) => {
                      // اگر تصویر لود نشد، نام پلتفرم را نمایش بده
                      e.currentTarget.style.display = 'none';
                      const span = document.createElement('span');
                      span.textContent = link.platform.charAt(0);
                      span.className = 'social-fallback-icon';
                      e.currentTarget.parentElement?.appendChild(span);
                    }}
                  />
                ) : (
                  <span className="social-fallback-icon">
                    {link.platform.charAt(0)}
                  </span>
                )}
              </a>
            ))}
        </div>
      </div>
    );
  };


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const fetchCategoryProducts = async (categoryId: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/categories/${categoryId}/products`);
      setCategoryProducts(response.data.products);
      setSelectedCategory(response.data);
      setShowAllProducts(true);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };


  //   const fetchSocialLinks = async () => {
  //   try {
  //     const response = await axios.get('/api/social-links');
  //     // تبدیل آرایه به object با کلید platform
  //     const linksObject: Record<string, string> = {};
  //     response.data.forEach((link: SocialLink) => {
  //       linksObject[link.platform] = link.url;
  //     });
  //     setSocialLinks(linksObject);
  //   } catch (error) {
  //     console.error('Error fetching social links:', error);
  //   }
  // };


  // const fetchSocialLinks = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/social-links");
  //     setSocialLinks(response.data);
  //   } catch (error) {
  //     console.error("Error fetching social links:", error);
  //   }
  // };


  // تغییر بخش Hero برای پشتیبانی از Carousel یا تصویر اصلی
  const renderHeroSection = () => {
    if (!data) return null;

    // اگر Carousel فعال باشد
    if (data.settings?.show_carousel && data.carouselImages?.length > 0) {
      return (
        <div className="carousel-container">
          <SimpleCarousel
            images={data.carouselImages}
            showArrows={data.carouselImages.length > 1}
            autoPlay={true}
            interval={5000}
          />
        </div>
      );
    }

    // اگر Carousel غیرفعال باشد یا تصویری نداشته باشد
    return (
      <section className="hero back-header">
        <div className="hero-content header-title">
          <h2>به فروشگاه ما خوش آمدید</h2>
          <h1>گالری مبلمان</h1>
          <p>محصولات منتخب ما را ببینید</p>
          <button className="shop-btn">همین حالا بخرید</button>
        </div>
      </section>
    );
  };

  const fetchData = async () => {
    try {
      const url = `${process.env.REACT_APP_HOST_URL}/api/data`;
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const sideBarLinkClick = (s: string) => {
    switch (s) {
      case "gallery":
        navigate(PageSectionType.gallery);
        return;
      case "about":
        navigate(PageSectionType.About);
        return;
      case "contact":
        navigate(PageSectionType.Contact);
        return;
      case "blog":
        navigate(PageSectionType.Blog);
        return;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const navigate = (section: PageSectionType) => {
    sectionRefs[section]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const contactUsLinkClick = (e: any) => {
    e.preventDefault();
    navigate(PageSectionType.Contact);
  };

  const galleryLinkClick = (e: any) => {
    e.preventDefault();
    navigate(PageSectionType.gallery);
  };

  const blogLinkClick = (e: any) => {
    e.preventDefault();
    navigate(PageSectionType.Blog);
  };

  const aboutUsLinkClick = (e: any) => {
    e.preventDefault();
    navigate(PageSectionType.About);
  };

  const footerLinkClick = (e: any, type: string) => {
    e.preventDefault();
    switch (type) {
      case "home":
        break;
      case "gallery":
        break;
      case "articles":
        navigate(PageSectionType.Blog);
        break;
      case "contactUs":
        navigate(PageSectionType.Contact);
        break;
      case "aboutUs":
        navigate(PageSectionType.About);
        break;
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return <div>خطا در دریافت اطلاعات</div>;


  // تابع برای دریافت آیکون مناسب
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      telegram: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M9.5 14.5l-2.5-1.5 10-6.5-4.5 8-2-1-3.5 1.5z" />
          <circle cx="12" cy="12" r="10" fill="none" stroke="#0088cc" strokeWidth="2" />
        </svg>
      ),
      instagram: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <radialGradient id="insta-gradient" cx="12" cy="12" r="12">
            <stop offset="0" stopColor="#fdf497" />
            <stop offset="0.05" stopColor="#fdf497" />
            <stop offset="0.45" stopColor="#fd5949" />
            <stop offset="0.6" stopColor="#d6249f" />
            <stop offset="0.9" stopColor="#285AEB" />
          </radialGradient>
          <circle cx="12" cy="12" r="10" fill="url(#insta-gradient)" />
          <circle cx="12" cy="12" r="3" fill="white" />
        </svg>
      ),
      youtube: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff0000">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
      aparat: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff2b2b">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">آ</text>
        </svg>
      ),
      pinterest: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#bd081c">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6c-3.313 0-6 2.686-6 6 0 2.545 1.548 4.726 3.742 5.65-.052-.494-.1-1.252.022-1.79.108-.466.703-2.963.703-2.963s-.18-.36-.18-.893c0-.836.485-1.46 1.09-1.46.514 0 .762.386.762.848 0 .517-.328 1.29-.498 2.005-.142.598.3 1.084.89 1.084 1.07 0 1.894-1.127 1.894-2.755 0-1.44-1.036-2.448-2.515-2.448-1.713 0-2.718 1.284-2.718 2.612 0 .517.198 1.072.447 1.373.05.06.057.112.042.173l-.168.66c-.027.107-.088.13-.204.08-.76-.354-1.235-1.46-1.235-2.35 0-1.916 1.392-3.675 4.02-3.675 2.108 0 3.748 1.503 3.748 3.513 0 2.095-1.32 3.782-3.15 3.782-.615 0-1.193-.32-1.392-.712l-.378 1.44c-.137.525-.508 1.182-.755 1.583.57.176 1.177.27 1.805.27 3.313 0 6-2.687 6-6s-2.687-6-6-6z" fill="white" />
        </svg>
      ),
      whatsapp: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#25d366">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88z" fill="white" />
        </svg>
      )
    };

    return icons[platform] || <span>{platform}</span>;
  };

  const moreArticleClick = (articleId: any) => {
    if (data.settings.article_display_mode == 'separate') {
      window.open(`/articles/${articleId}`, '_blank')
    } else {
      setShowFullArticle(
        showFullArticle === articleId ? null : articleId
      )
    }
  }

  return (
    <div className="App" dir="rtl">
      {/* افزودن Head SEO */}
      <SEOHead
        title="مبل فرحزاد - فروشگاه تخصصی مبلمان لوکس"
        description="فروشگاه آنلاین مبلمان فرحزاد، ارائه بهترین مبلمان منزل و اداری با کیفیت عالی و قیمت مناسب"
        keywords="مبلمان, مبل راحتی, کاناپه, صندلی, میز ناهارخوری, دکوراسیون منزل"
      />
      {/* Header/Navigation */}
      {/* <header className="header">
        <h1 className="logo">مبل فرحزاد</h1>

        {isLoggedIn && (
          <div className="logout-container">
            <a href="#" onClick={handleLogout} className="logout-link">
              خروج
            </a>
          </div>
        )}

        <div className="logo-container">
          <img className="img-logo" src="/images/logo192.jpg" alt="telegram" />
        </div>

        <nav className={isLoggedIn ? "nav nav-ml" : "nav"}>
          <a href="#">خانه</a>
          <a onClick={(e) => galleryLinkClick(e)} href="#">گالری</a>
          <a onClick={(e) => blogLinkClick(e)} href="#">مقالات</a>
          <a onClick={(e) => contactUsLinkClick(e)} href="#">تماس با ما</a>
          <a onClick={(e) => aboutUsLinkClick(e)} href="#">درباره ما</a>
        </nav>
      </header> */}

      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLinkClick={(s) => sideBarLinkClick(s)} />

      {/* <SimpleCarousel /> */}
      {renderHeroSection()}

      {/* Featured Products */}
      <section className="featured-products" ref={gallerySectionRef}>
        <h2>گالری</h2>
        <div className="products-grid">
          {data.images.map((img, i) => (
            <div className="product-card" key={i}>
              <div className="product-image">
                <img
                  src={`${getImgUrl(Host_Url, img.url)}`}
                  alt="product"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <h3>{img.title}</h3>
              <p className={`price ${img.off !== 0 ? 'off-price' : ''}`}>{toPersianDigits(img.price)}{img.is_tooman ? ' تومان' : ' ریال'}</p>
              {img.off !== 0 && (
                <p className="price">{toPersianDigits(img.off)}{img.is_tooman ? ' تومان' : ' ریال'}</p>
              )}
            </div>
          ))}
        </div>
      </section>



      {/* بخش دسته‌بندی‌ها */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">دسته‌بندی محصولات</h2>
          <p className="section-subtitle">محصولات خود را بر اساس دسته‌بندی مورد نظر انتخاب کنید</p>
        </div>

        {categories.length === 0 ? (
          <div className="no-categories">
            <p>هیچ دسته‌بندی‌ای وجود ندارد.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => fetchCategoryProducts(category.id)}
                style={{ cursor: 'pointer' }}
              >
                {category.image_url && (
                  <div className="category-image">
                    <img
                      src={`${getImgUrl(Host_Url, category.image_url)}`}
                      alt={category.title}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="category-content">
                  <h3 className="category-title">{category.title}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  {/* <div className="category-meta">
                    <span className="product-count">
                      {category.product_count || 0} محصول
                    </span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* نمایش محصولات دسته‌بندی انتخاب شده */}
      {showAllProducts && selectedCategory && (
        <section className="category-products-section mt-3">
          <div className="section-header">
            <div className="section-header-top">
              <h2 className="section-title">محصولات دسته‌بندی: {selectedCategory.title}</h2>
              <button
                className="back-to-categories collapse-btn-settings"
                onClick={() => {
                  setShowAllProducts(false);
                  setSelectedCategory(null);
                  setCategoryProducts([]);
                }}
              >
                بازگشت به دسته‌بندی‌ها
              </button>
            </div>
            {selectedCategory.description && (
              <p className="section-subtitle">{selectedCategory.description}</p>
            )}
          </div>

          {categoryProducts.length === 0 ? (
            <div className="no-products">
              <p>هیچ محصولی در این دسته‌بندی وجود ندارد.</p>
            </div>
          ) : (
            <div className="products-grid detailed">
              {categoryProducts.map((product) => (
                <div className="product-card detailed" key={product.id}>
                  <div className="product-image">
                    <img
                      src={`${getImgUrl(Host_Url, product.image_url)}`}
                      alt={product.title}
                      style={{ width: "100%", height: "100%" }}
                    />
                    {product.discount_percent > 0 && (
                      <div className="discount-badge">
                        {product.discount_percent}% تخفیف
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    {product.description && (
                      <p className="product-description">
                        {truncateText(product.description, 100)}
                      </p>
                    )}

                    {/* نمایش ویژگی‌ها */}
                    {product.features && (
                      <>
                        <div className="product-features">
                          <h4>ویژگی‌ها:</h4>
                          <ul>
                            {product.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                              <li key={idx}>{feature.trim()}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    <div className="product-price-container">
                      <div className="price-wrapper">
                        {product.discount_percent > 0 ? (
                          <>
                            <span className="original-price">
                              {product.price.toLocaleString()} تومان
                            </span>
                            <span className="final-price">
                              {Math.round(product.price * (100 - product.discount_percent) / 100).toLocaleString()} تومان
                            </span>
                          </>
                        ) : (
                          <span className="final-price no-discount">
                            {product.price.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                      {/* <button className="add-to-cart-btn">
                        افزودن به سبد خرید
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured Products (گالری) */}
      {/* {!showAllProducts && (
        <section className="featured-products">
          <h2>گالری</h2>
          <div className="products-grid">
          </div>
        </section>
      )} */}

      {/* Articles Section */}
      <section className="articles-section" ref={blogSectionRef}>
        <div className="section-header">
          <h2 className="section-title">مقالات</h2>
          <p className="section-subtitle">آخرین مقالات و مطالب ما را در اینجا بخوانید</p>
        </div>

        {articles.length === 0 ? (
          <div className="no-articles">
            <p>هنوز مقاله‌ای منتشر نشده است.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <div className="article-card" key={article.id}>
                {article.image_url && (
                  <div className="article-image">
                    <img
                      src={`${getImgUrl(Host_Url, article.image_url)}`}
                      loading="lazy"
                      alt={`تصویر مقاله ${article.title}`}
                      title={article.title}
                    />
                  </div>
                )}
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-date">
                      {formatDate(article.created_at)}
                    </span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <div className="article-excerpt">
                    {showFullArticle === article.id ? (
                      <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    ) : (
                      <p>{truncateText(article.content.replace(/<[^>]*>/g, ''), 150)}</p>
                    )}
                  </div>
                  <button
                    className="read-more-btn"
                    onClick={() => moreArticleClick(article.id)}
                  >
                    {showFullArticle === article.id ? 'نمایش کمتر' : 'ادامه مطلب'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Blog Section (همان بخش قدیمی) */}
      {/* <section className="blog-section">
        <h2>از بلاگ ما</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-date">برق: ۰٫۰۰</div>
            <h3>سیستم کامپیوتری مقیاس پذیر پتکول کاملاً فراگیر</h3>
            <div className="blog-stats">
              <span>❤️ ۰</span>
              <span>💬 ۰</span>
              <span>👁️ ۰</span>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-date">برق: ۰٫۰۰</div>
            <h3>سیستم‌های کامپیوتری اوریلی</h3>
            <div className="blog-stats">
              <span>❤️ ۰</span>
              <span>💬 ۰</span>
              <span>👁️ ۰</span>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="contact-section" ref={contactUsSectionRef}>
        {/* <h2>تماس با ما</h2>
        <p>
          هفت روز هفته میتونید با ما در تماس باشید
        </p>
        <form className="contact-form">
          <input type="text" placeholder="نام شما" />
          <input type="email" placeholder="ایمیل شما" />
          <textarea placeholder="پیام شما"></textarea>
          <button type="submit">ارسال پیام</button>
        </form> */}
        <ContactForm />
      </section>

      {/* Footer */}
      <section className="about-section" ref={aboutUsSectionRef}>
        <Footer phone={data.phone}
          email={data.email}
          address={data.address}
          about={data.about}
          linkClick={footerLinkClick}
          socialData={data.socialLinks} />
      </section>

      {/* <div className="social-icons-header">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            title={link.platform}
          >
            <img
              src={`/images/${link.icon || `${link.platform}.png`}`}
              alt={link.platform}
            />
          </a>
        ))}
      </div> */}

      {/* <div className="social-section">
        <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
        <div className="social-icons">
          {Object.entries(socialLinks).map(([platform, link]) => (
            link && (
              <a
                key={platform}
                href={`${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-icon ${platform}`}
                title={platform}
              >
                {getSocialIcon(platform)}
              </a>
            )
          ))}
        </div>
      </div> */}

      {/* {renderSocialIcons()} */}

      {/* <div className="social-section">
        <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
        <div className="social-icons">
          {socialLinks && Object.entries(socialLinks).map(([platform, url]) => (
            <a
              key={platform}
              href={`${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-icon ${platform}`}
              title={platform}
            >
              {getSocialIcon(platform)}

            </a>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;