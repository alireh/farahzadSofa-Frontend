// components/Footer.tsx
import React from 'react';
import '../style2/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>درباره ما</h3>
                    <p>مبل‌شاپ با بیش از ۱۰ سال سابقه درخشان در زمینه تولید و عرضه مبلمان منزل و اداری</p>
                    <div className="social-links">
                        <a href="#" className="social-link">📱</a>
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📷</a>
                        <a href="#" className="social-link">🐦</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>لینک‌های مفید</h3>
                    <ul>
                        <li><a href="#">خانه</a></li>
                        <li><a href="#">محصولات</a></li>
                        <li><a href="#">درباره ما</a></li>
                        <li><a href="#">تماس با ما</a></li>
                        <li><a href="#">سوالات متداول</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>تماس با ما</h3>
                    <ul className="contact-info">
                        <li>📍 تهران، خیابان ولیعصر، پلاک ۱۲۳</li>
                        <li>📞 ۰۲۱-۱۲۳۴۵۶۷۸</li>
                        <li>📱 ۰۹۱۲-۳۴۵-۶۷۸۹</li>
                        <li>✉️ info@mobleshop.ir</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>ساعات کاری</h3>
                    <ul className="working-hours">
                        <li>شنبه تا چهارشنبه: ۹ صبح تا ۸ شب</li>
                        <li>پنج‌شنبه: ۹ صبح تا ۶ عصر</li>
                        <li>جمعه: تعطیل</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>تمامی حقوق مادی و معنوی این سایت متعلق به مبل‌شاپ می‌باشد.</p>
                <p>طراحی و توسعه: تیم فنی مبل‌شاپ</p>
            </div>
        </footer>
    );
};

export default Footer;