// components/Header.tsx - بخش مشکل‌دار را اصلاح کنید
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

interface HeaderProps {
    isLoggedIn?: boolean;
    onLogout?: () => void;
    onLinkClick?: (linkType: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    isLoggedIn = false,
    onLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    },
    onLinkClick = (linkType: string) => {
        onLinkClick(linkType)
    }
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("خانه");
    const [isMobile, setIsMobile] = useState(false);

    // تشخیص سایز صفحه
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleNavClick = (linkName: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }
        setActiveLink(linkName);

        // در موبایل منو را ببند
        if (isMobile) {
            setIsMenuOpen(false);
        }

        // اسکرول به بخش‌های مختلف
        switch (linkName) {
            case "گالری":
                document.getElementById("gallery-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                break;
            case "مقالات":
                document.getElementById("articles-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                break;
            case "تماس با ما":
                document.getElementById("contact-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                break;
            case "درباره ما":
                document.getElementById("about-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                break;
            default:
                window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLogout = () => {
        onLogout();
        setIsMenuOpen(false);
    };

    return (
        <header className="site-header">
            {/* نوار بالایی */}
            <div className="header__top-bar">
                {/* لوگو سایت */}
                <Link
                    to="/"
                    className="header__logo"
                    onClick={() => {
                        onLinkClick("home");
                        setActiveLink("خانه");
                        if (isMobile) setIsMenuOpen(false);
                    }}
                >
                    <img
                        className="header__logo-img"
                        src="/images/logo192.jpg"
                        alt="لوگوی مبل فرحزاد"
                    />
                    <div className="header__logo-text">
                        <h1 className="header__title">مبل فرحزاد</h1>
                        <p className="header__subtitle">طراحی و تولید مبلمان مدرن</p>
                    </div>
                </Link>

                {/* دکمه منو برای موبایل */}
                <div className="header__mobile-controls">
                    {isLoggedIn && isMobile && !isMenuOpen && (
                        <button
                            className="header__mobile-logout"
                            onClick={handleLogout}
                            aria-label="خروج"
                        >
                            <span className="header__logout-icon">🚪</span>
                        </button>
                    )}

                    <button
                        className={`header__menu-toggle ${isMenuOpen ? 'header__menu-toggle--open' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="منو"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="header__menu-icon"></span>
                    </button>
                </div>
            </div>

            {/* نویگیشن و خروج */}
            <div className={`header__bottom-bar ${isMenuOpen ? 'header__bottom-bar--open' : ''}`}>
                <nav className="header__nav">
                    <a
                        href="/"
                        className={`header__nav-link ${activeLink === "خانه" ? 'active' : ''}`}
                        onClick={(e) => handleNavClick("خانه", e)}
                    >
                        <span className="header__nav-icon">🏠</span>
                        <span className="header__nav-text">خانه</span>
                    </a>

                    <a
                        href="#gallery"
                        className={`header__nav-link ${activeLink === "گالری" ? 'active' : ''}`}
                        onClick={(e) => {
                            onLinkClick("gallery");
                            handleNavClick("گالری", e)
                        }
                        }
                    >
                        <span className="header__nav-icon">🖼️</span>
                        <span className="header__nav-text">گالری</span>
                    </a>

                    <a
                        href="#blog"
                        className={`header__nav-link ${activeLink === "مقالات" ? 'active' : ''}`}
                        onClick={(e) => {
                            onLinkClick("blog");
                            handleNavClick("مقالات", e)
                        }
                        }
                    >
                        <span className="header__nav-icon">📝</span>
                        <span className="header__nav-text">مقالات</span>
                    </a>

                    <a
                        href="#contact"
                        className={`header__nav-link ${activeLink === "تماس با ما" ? 'active' : ''}`}
                        onClick={(e) => {
                            onLinkClick("contact");
                            handleNavClick("تماس با ما", e)
                        }
                        }
                    >
                        <span className="header__nav-icon">📞</span>
                        <span className="header__nav-text">تماس با ما</span>
                    </a>

                    <a
                        href="#about"
                        className={`header__nav-link ${activeLink === "درباره ما" ? 'active' : ''}`}
                        onClick={(e) => {
                            onLinkClick("about");
                            handleNavClick("درباره ما", e);
                        }
                        }
                    >
                        <span className="header__nav-icon">ℹ️</span>
                        <span className="header__nav-text">درباره ما</span>
                    </a>
                </nav>

                {isLoggedIn && (
                    <div className="header__user-section">
                        <button
                            className="header__logout-btn"
                            onClick={handleLogout}
                            aria-label="خروج از حساب کاربری"
                        >
                            <span className="header__logout-icon">🚪</span>
                            <span className="header__logout-text">
                                {isMobile ? "خروج" : "خروج از حساب کاربری"}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Overlay برای بستن منو در موبایل */}
            {isMenuOpen && isMobile && (
                <div
                    className="header__overlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;