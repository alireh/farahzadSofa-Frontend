
import React, { useState, useRef, useEffect } from 'react';
import "../styles/footer.css";
import { SocialLink } from '../types';

export interface FooterProps {
    /** عنوان دراپ‌دون */
    title: string;
    socialData: SocialLink[];
    linkClick: (e: any, linkName: string) => void;
}

const Footer: React.FC<FooterProps> = ({
    title,
    socialData,
    linkClick
}) => {

    const handleLinkClick = (e: any, linkName: string) => {
        linkClick(e, linkName);
    };

    return (
        // <footer className="social-footer" >
        //     <div className="social-container">
        //         {/* سایت های ایرانی */}
        //         <div className="social-section">
        //             <h3>ارتباط رسمی</h3>
        //             <div className="social-icons">
        //                 <a href="#" className="social-icon enemad" title="اینماد">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <rect x="2" y="2" width="20" height="20" rx="4" fill="#00a8e1" />
        //                         <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ای</text>
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="نماس">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <circle cx="12" cy="12" r="10" fill="#ff6b35" />
        //                         <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">نماس</text>
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon samandehi" title="سمند">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <rect x="2" y="2" width="20" height="20" rx="4" fill="#4caf50" />
        //                         <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">س</text>
        //                     </svg>
        //                 </a>
        //             </div>
        //         </div>

        //         {/* شبکه های اجتماعی */}
        //         <div className="social-section">
        //             <h3>ما را دنبال کنید</h3>
        //             <div className="social-icons">
        //                 <a href="#" className="social-icon" title="تلگرام">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <circle cx="12" cy="12" r="10" fill="#0088cc" />
        //                         <path d="M9.5 14.5l-2.5-1.5 10-6.5-4.5 8-2-1-3.5 1.5z" fill="white" />
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="اینستاگرام">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <radialGradient id="instagram-gradient" cx="12" cy="12" r="12">
        //                             <stop offset="0" stopColor="#fdf497" />
        //                             <stop offset="0.05" stopColor="#fdf497" />
        //                             <stop offset="0.45" stopColor="#fd5949" />
        //                             <stop offset="0.6" stopColor="#d6249f" />
        //                             <stop offset="0.9" stopColor="#285AEB" />
        //                         </radialGradient>
        //                         <circle cx="12" cy="12" r="10" fill="url(#instagram-gradient)" />
        //                         <circle cx="12" cy="12" r="3" fill="white" />
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="یوتیوب">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="#ff0000" />
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="آپارات">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <rect x="2" y="2" width="20" height="20" rx="4" fill="#ff2b2b" />
        //                         <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10">آ</text>
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="پینترست">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <circle cx="12" cy="12" r="10" fill="#bd081c" />
        //                         <path d="M12 6c-3.313 0-6 2.686-6 6 0 2.545 1.548 4.726 3.742 5.65-.052-.494-.1-1.252.022-1.79.108-.466.703-2.963.703-2.963s-.18-.36-.18-.893c0-.836.485-1.46 1.09-1.46.514 0 .762.386.762.848 0 .517-.328 1.29-.498 2.005-.142.598.3 1.084.89 1.084 1.07 0 1.894-1.127 1.894-2.755 0-1.44-1.036-2.448-2.515-2.448-1.713 0-2.718 1.284-2.718 2.612 0 .517.198 1.072.447 1.373.05.06.057.112.042.173l-.168.66c-.027.107-.088.13-.204.08-.76-.354-1.235-1.46-1.235-2.35 0-1.916 1.392-3.675 4.02-3.675 2.108 0 3.748 1.503 3.748 3.513 0 2.095-1.32 3.782-3.15 3.782-.615 0-1.193-.32-1.392-.712l-.378 1.44c-.137.525-.508 1.182-.755 1.583.57.176 1.177.27 1.805.27 3.313 0 6-2.687 6-6s-2.687-6-6-6z" fill="white" />
        //                     </svg>
        //                 </a>
        //                 <a href="#" className="social-icon" title="واتس‌اپ">
        //                     <svg viewBox="0 0 24 24" width="24" height="24">
        //                         <circle cx="12" cy="12" r="10" fill="#25d366" />
        //                         <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88z" fill="white" />
        //                     </svg>
        //                 </a>
        //             </div>
        //         </div>

        //         {/* اطلاعات کپی رایت */}
        //         <div className="copyright-section">
        //             <div className="owner-info">
        //                 <p>مالک و صاحب امتیاز: <strong>{"مبل فرحزاد"}</strong></p>
        //                 <p>© {new Date().getFullYear()} تمامی حقوق این وبسایت محفوظ است.</p>
        //             </div>
        //             <div className="policy-links">
        //                 <a href="#">حریم خصوصی</a>
        //                 <a href="#">قوانین و مقررات</a>
        //                 <a href="#">سوالات متداول</a>
        //                 <a href="#">نقشه سایت</a>
        //             </div>
        //         </div>
        //     </div>
        // </footer >

        <footer className="site-footer">
            <div className="footer-top">
                {/* Links */}
                <div className="footer-links">
                    <a onClick={(e) => handleLinkClick(e, 'home')} href="#">خانه</a>
                    <a onClick={(e) => handleLinkClick(e, 'gallery')} href="#">گالری</a>
                    <a onClick={(e) => handleLinkClick(e, 'articles')} href="#">مقالات</a>
                    <a onClick={(e) => handleLinkClick(e, 'contactUs')} href="#">تماس با ما</a>
                    <a onClick={(e) => handleLinkClick(e, 'aboutUs')} href="#">درباره ما</a>
                </div>

                {/* Social Icons */}
                <div className="footer-social">
                    {/* <a href="#" aria-label="Telegram">
                        <img src="/images/social-media/telegram.svg" alt="telegram"></img>
                    </a>
                    <a href="#" aria-label="Instagram">
                        <img src="/images/social-media/instagram.svg" alt="instagram"></img>
                    </a>
                    <a href="#" aria-label="YouTube">
                        <img src="/images/social-media/youtube.svg" alt="youtube"></img>
                    </a>
                    <a href="#" aria-label="Aparat">
                        <img src="/images/social-media/aparat.png" alt="aparat"></img>
                    </a>
                    <a href="#" aria-label="Pinterest">
                        <img src="/images/social-media/pinterest.svg" alt="pinterest"></img>
                    </a>
                    <a href="#" aria-label="WhatsApp">
                        <img src="/images/social-media/whatsapp.png" alt="aparat"></img>
                    </a> */}

                    {
                        socialData.map((item) => (

                            <a href="#" aria-label={`${item.platform}`}>
                                <img src={`http://localhost:5000${item.icon}`} alt={`${item.platform}`}></img>
                            </a>
                        ))}


                </div>

                {/* Trust Badges */}
                <div className="footer-badges">
                    <a href="#" target="_blank" rel="noreferrer">
                        <img src="/images/enamad.png" alt="اینماد" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer">
                        <img src="/images/senfi.png" alt="نماد باد ما" />
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} کلیه حقوق این وب‌سایت متعلق به
                    <strong> مبل فرحزاد </strong>
                    می‌باشد.
                </p>
            </div>
        </footer>

    );
};


export default Footer;