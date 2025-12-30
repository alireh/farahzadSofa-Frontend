
import React from 'react';
import "../styles/footer.css";
import { SocialLink } from '../types';
import { getImgUrl } from '../util/general';
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

                    {
                        socialData.map((item) => (

                            <a href="#" aria-label={`${item.platform}`}>
                                <img src={`${getImgUrl(Host_Url, item.icon)}`} alt={`${item.platform}`}></img>
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