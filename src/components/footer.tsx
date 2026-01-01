
import React from 'react';
import "../styles/footer.css";
import { SocialLink } from '../types';
import { getImgUrl } from '../util/general';
const Host_Url = process.env.REACT_APP_HOST_URL;

export interface FooterProps {
    /** عنوان دراپ‌دون */
    phone: string;
    about: string;
    address: string;
    email: string;
    socialData: SocialLink[];
    linkClick: (e: any, linkName: string) => void;
}

const Footer: React.FC<FooterProps> = ({
    phone,
    about,
    address,
    email,
    socialData,
    linkClick
}) => {

    const handleLinkClick = (e: any, linkName: string) => {
        linkClick(e, linkName);
    };

    return (
        <footer className="site-footer">
            <div className="footer-top">

                {/* About */}
                <div className="footer-about">
                    <p className="footer-description">
                        {about}
                    </p>

                    <div className="footer-contact">
                        <p>
                            📧 ایمیل:
                            <a href="mailto:info@farahzadmobl.com"> {email}</a>
                        </p>
                        <p>
                            ☎️ تلفن:
                            <a href="tel:02112345678"> {phone}</a>
                        </p>
                        <p>
                            نشانی :
                            <a href="tel:02112345678"> {address}</a>
                        </p>
                    </div>
                </div>

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
                        <img src="/images/senfi.png" alt="نماد صنفی" />
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