import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Category, Product, SiteData, SocialLink } from "../types";
import "../styles/website.css";
import Footer from "../components/footer";
import '../constant/pageSectionType'
import SimpleCarousel from "../components/simpleCarousel";
import SEOHead from "../SEOHead";

enum PageSectionType {
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


  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const fetchCategoryProducts = async (categoryId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/categories/${categoryId}/products`);
      setCategoryProducts(response.data.products);
      setSelectedCategory(response.data);
      setShowAllProducts(true);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };


  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/social-links");
      setSocialLinks(response.data);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };


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
      const response = await axios.get("http://localhost:5000/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

  return (
    <div className="App" dir="rtl">
      {/* افزودن Head SEO */}
      <SEOHead
        title="مبل فرحزاد - فروشگاه تخصصی مبلمان لوکس"
        description="فروشگاه آنلاین مبلمان فرحزاد، ارائه بهترین مبلمان منزل و اداری با کیفیت عالی و قیمت مناسب"
        keywords="مبلمان, مبل راحتی, کاناپه, صندلی, میز ناهارخوری, دکوراسیون منزل"
      />
      {/* Header/Navigation */}
      <header className="header">
        <h1 className="logo">مبل فرحزاد</h1>

        {/* لینک Logout در سمت چپ */}
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
          <a href="#">گالری</a>
          <a onClick={(e) => blogLinkClick(e)} href="#">مقالات</a>
          <a onClick={(e) => contactUsLinkClick(e)} href="#">تماس با ما</a>
          <a onClick={(e) => aboutUsLinkClick(e)} href="#">درباره ما</a>
        </nav>
      </header>

      {/* بقیه کدها بدون تغییر */}
      <section className="hero back-header">
        <div className="hero-content header-title">
          <h2>به فروشگاه ما خوش آمدید</h2>
          <h1>گالری مبلمان</h1>
          <p>محصولات منتخب ما را ببینید</p>
          <button className="shop-btn">همین حالا بخرید</button>
        </div>
      </section>

      {/* <SimpleCarousel /> */}
      {renderHeroSection()}

      {/* Featured Products */}
      <section className="featured-products">
        <h2>محصولات ویژه</h2>
        <div className="products-grid">
          {data.images.map((img, i) => (
            <div className="product-card" key={i}>
              <div className="product-image">
                <img
                  src={`http://localhost:5000${img.url}`}
                  alt="product"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <h3>مبل ۱/۷ (ثابت) ۶۰ چوب + ۶۰۰/۸۰۰</h3>
              <p className="price">۶۵۰٫۹۹ تومان</p>
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
                      src={`http://localhost:5000${category.image_url}`}
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
                  <div className="category-meta">
                    <span className="product-count">
                      {category.product_count || 0} محصول
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* نمایش محصولات دسته‌بندی انتخاب شده */}
      {showAllProducts && selectedCategory && (
        <section className="category-products-section">
          <div className="section-header">
            <div className="section-header-top">
              <h2 className="section-title">محصولات دسته‌بندی: {selectedCategory.title}</h2>
              <button
                className="back-to-categories"
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
                      src={`http://localhost:5000${product.image_url}`}
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
                      <div className="product-features">
                        <h4>ویژگی‌ها:</h4>
                        <ul>
                          {product.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                            <li key={idx}>{feature.trim()}</li>
                          ))}
                        </ul>
                      </div>
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
                      <button className="add-to-cart-btn">
                        افزودن به سبد خرید
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured Products (محصولات ویژه) */}
      {!showAllProducts && (
        <section className="featured-products">
          <h2>محصولات ویژه</h2>
          <div className="products-grid">
            {/* محصولات ویژه را اینجا نمایش دهید */}
          </div>
        </section>
      )}

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
                      src={`http://localhost:5000${article.image_url}`}
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
                    onClick={() => setShowFullArticle(
                      showFullArticle === article.id ? null : article.id
                    )}
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
        <h2>تماس با ما</h2>
        <p>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده
          از طراحان گرافیک است
        </p>
        <form className="contact-form">
          <input type="text" placeholder="نام شما" />
          <input type="email" placeholder="ایمیل شما" />
          <textarea placeholder="پیام شما"></textarea>
          <button type="submit">ارسال پیام</button>
        </form>
      </section>

      {/* Footer */}
      <section className="about-section" ref={aboutUsSectionRef}>
        <Footer title="" linkClick={footerLinkClick} />
      </section>

      <div className="social-icons-header">
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
      </div>
    </div>
  );
};

export default HomePage;