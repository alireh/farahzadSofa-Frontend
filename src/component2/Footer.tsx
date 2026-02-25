// components/Footer.tsx
import React, { useEffect, useState } from "react";
import "../style2/Footer.css";

interface FooterData {
  about_text: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  work_sat_wed: string;
  work_thu: string;
  work_fri: string;
  copyright: string;
  useful_links: { title: string; url: string }[];
  socials: { icon: string; url: string }[];
}

const Footer: React.FC = () => {
const [footerData, setFooterData] = useState<FooterData | null>(null);
    useEffect(() => {
  fetch("/api/footer")
    .then(r => r.json())
    .then(setFooterData)
    .catch(console.error);
}, []);


  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>درباره ما</h3>
          {/* <p>
            مبل فرحزاد با بیش از ۱۰ سال سابقه درخشان در زمینه تولید و عرضه
            مبلمان منزل و اداری
          </p> */}
          <p>{footerData?.about_text}</p>
          {/* <div className="social-links">
                        <a href="#" className="social-link">📱</a>
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📷</a>
                        <a href="#" className="social-link">🐦</a>
                    </div> */}
          <div className="social-links">
            {footerData?.socials?.map((s, i) => (
              <a key={i} href={s.url} className="social-link">
                <img src={s.icon} alt="social" />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h3>لینک‌های مفید</h3>
          <ul>
            {/* <li>
              <a href="#">خانه</a>
            </li>
            <li>
              <a href="#">محصولات</a>
            </li>
            <li>
              <a href="#">درباره ما</a>
            </li>
            <li>
              <a href="#">تماس با ما</a>
            </li>
            <li>
              <a href="#">سوالات متداول</a>
            </li> */}
            {footerData?.useful_links?.map((l, i) => (
              <li key={i}>
                <a href={l.url}>{l.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>تماس با ما</h3>
          {/* <ul className="contact-info">
            <li>📍 تهران، باغستان مبل فرخزاد </li>
            <li>📞 ۰۲۱-۲۶۷۵۵۰۰۲</li>
            <li>📱 ۰۹۱۲-۱۲۷۹۲۷۱</li>
            <li>✉️ info@mobleshop.ir</li>
          </ul> */}
          <ul className="contact-info">
            <li>📍 {footerData?.address}</li>
            <li>📞 {footerData?.phone}</li>
            <li>📱 {footerData?.mobile}</li>
            <li>✉️ {footerData?.email}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>ساعات کاری</h3>
          {/* <ul className="working-hours">
                        <li>شنبه تا چهارشنبه: ۹ صبح تا ۸ شب</li>
                        <li>پنج‌شنبه: ۹ صبح تا ۶ عصر</li>
                        <li>جمعه: تعطیل</li>
                    </ul> */}
          <ul className="working-hours">
            <li>{footerData?.work_sat_wed}</li>
            <li>{footerData?.work_thu}</li>
            <li>{footerData?.work_fri}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        {/* <p>تمامی حقوق مادی و معنوی این سایت متعلق به مبل فرحزاد می‌باشد.</p>
                <p>طراحی و توسعه: تیم فنی مبل فرحزاد</p> */}
        <p>{footerData?.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
