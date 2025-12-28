
import React from 'react';
import "../styles/footer.css";
import { SocialLink } from '../types';
const Host_Url = process.env.REACT_APP_HOST_URL;

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

        <footer className="site-footer">
            <div className="footer-top">
                {/* Links */}
                <div className="footer-links">
                    <a onClick={(e) => handleLinkClick(e, 'home')} href="/">خانه</a>
                    <a onClick={(e) => handleLinkClick(e, 'gallery')} href="/">گالری</a>
                    <a onClick={(e) => handleLinkClick(e, 'articles')} href="/">مقالات</a>
                    <a onClick={(e) => handleLinkClick(e, 'contactUs')} href="/">تماس با ما</a>
                    <a onClick={(e) => handleLinkClick(e, 'aboutUs')} href="/">درباره ما</a>
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
                                <img src={`${Host_Url}${item.icon}`} alt={`${item.platform}`}></img>
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