import React, { useState, useEffect } from "react";
import axios from "axios";
import { SiteData } from "../types";
import "../styles/website.css";

const HomePage: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return <div>خطا در دریافت اطلاعات</div>;

  return (
    // <div style={styles.container}>
    //   <header style={styles.header}>
    //     <h1>وبسایت ما</h1>
    //   </header>

    //   <main style={styles.main}>
    //     <section style={styles.section}>
    //       <h2>تصاویر</h2>
    //       <div style={styles.imageGrid}>
    //         {data.images.map((image) => (
    //           <div key={image.id} style={styles.imageCard}>
    //             <img
    //               src={`http://localhost:5000${image.url}`}
    //               alt={image.title}
    //               style={styles.image}
    //             />
    //             <p>{image.title}</p>
    //           </div>
    //         ))}
    //       </div>
    //     </section>

    //     <section style={styles.section}>
    //       <h2>درباره ما</h2>
    //       <p style={styles.paragraph}>{data.about}</p>
    //     </section>

    //     <section style={styles.section}>
    //       <h2>آدرس</h2>
    //       <p style={styles.paragraph}>{data.address}</p>
    //     </section>
    //   </main>

    //   <footer style={styles.footer}>
    //     <p>© 2024 سایت نمونه</p>
    //     <a href="/admin" style={styles.adminLink}>ورود به پنل ادمین</a>
    //   </footer>
    // </div>

    <div className="App" dir="rtl">
      {/* Header/Navigation */}
      <header className="header">
        <div className="logo">مبل فرحزاد</div>
        <nav className="nav">
          <a href="#">خانه</a>
          <a href="#">فروشگاه</a>
          <a href="#">گالری</a>
          <a href="#">بلاگ</a>
          <a href="#">تماس</a>
          <a href="#" className="cart-icon">
            🛒
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero back-header">
        <div className="hero-content header-title">
          <h2>به فروشگاه ما خوش آمدید</h2>
          <h1>گالری مبلمان</h1>
          <p>محصولات منتخب ما را ببینید</p>
          <button className="shop-btn">همین حالا بخرید</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="category-card cat1">
          <div className="category-title">شترها</div>
          <p>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است
          </p>
        </div>
        <div className="category-card">
          <div className="category-title">ایده‌های خلاق</div>
          <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
        </div>
        <div className="category-card">
          <div className="category-title">فانوس</div>
          <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
        </div>
        <div className="category-card">
          <div className="category-title">نورپردازی سرامیکی</div>
          <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
        </div>
      </section>

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

      {/* Blog Section */}
      <section className="blog-section">
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
      </section>

      {/* Contact Section */}
      <section className="contact-section">
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
      <footer className="footer">
        {/* <div className="footer-column">
          <h3>دسته‌بندی‌ها</h3>
          <ul>
            <li>
              <a href="#">کلید</a>
            </li>
            <li>
              <a href="#">قرارداد</a>
            </li>
            <li>
              <a href="#">پذیرش</a>
            </li>
            <li>
              <a href="#">پرداخت</a>
            </li>
            <li>
              <a href="#">گواهی</a>
            </li>
          </ul>
        </div> */}
        {/* <div className="footer-column">
          <h3>خدمات</h3>
          <ul>
            <li>
              <a href="#">درخواست</a>
            </li>
            <li>
              <a href="#">شغل‌ها</a>
            </li>
            <li>
              <a href="#">چالش‌ها</a>
            </li>
            <li>
              <a href="#">کارمندان</a>
            </li>
            <li>
              <a href="#">کارگران</a>
            </li>
          </ul>
        </div> */}
        <div className="footer-column">
          <h3>درباره ما</h3>
          <ul>
            {/* <li>
              <a href="#">شرکت</a>
            </li>
            <li>
              <a href="#">تیم</a>
            </li>
            <li>
              <a href="#">فرصت‌های شغلی</a>
            </li>
            <li>
              <a href="#">تماس</a>
            </li> */}
            <p>{data.about}</p>
          </ul>
        </div>
        <div className="footer-column">
          <h3>اطلاعات تماس</h3>
          <p>آدرس :  {data.address}</p>
          <p>ایمیل :  {data.email}</p>
          <p>تلفن :  {data.phone}</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    direction: "rtl" as const,
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
    borderBottom: "2px solid #eee",
    paddingBottom: "20px",
  },
  main: {
    marginBottom: "40px",
  },
  section: {
    marginBottom: "40px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  imageCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    padding: "10px",
    textAlign: "center" as const,
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover" as const,
    borderRadius: "4px",
  },
  paragraph: {
    lineHeight: "1.6",
    fontSize: "16px",
    color: "#333",
  },
  footer: {
    textAlign: "center" as const,
    borderTop: "1px solid #eee",
    paddingTop: "20px",
    color: "#666",
  },
  adminLink: {
    color: "#007bff",
    textDecoration: "none",
    marginRight: "20px",
  },
};

export default HomePage;
