import '../style2/Header.css';
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // بستن منو با کلیک روی لینک
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // تشخیص اسکرول برای تغییر استایل هدر
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // بستن منو با تغییر سایز صفحه
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMenuOpen]);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <div className="logo">
                    <img src="/assets/images/logo.jpg" alt="مبل فرحزاد" />
                </div>

                {/* دکمه همبرگری برای موبایل */}
                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="منو"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* منوی ناوبری */}
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><a href="#" onClick={closeMenu}>خانه</a></li>
                        <li><a href="#" onClick={closeMenu}>مبل</a></li>
                        <li><a href="#" onClick={closeMenu}>اکسسوری</a></li>
                        <li><a href="#" onClick={closeMenu}>کنسول</a></li>
                        <li><a href="#" onClick={closeMenu}>میز غذاخوری</a></li>
                        <li><a href="#" onClick={closeMenu}>جلومبلی</a></li>
                        <li><a href="#" onClick={closeMenu}>محصولات</a></li>
                        <li><a href="#" onClick={closeMenu}>سرویس خواب</a></li>
                        <li><a href="#" onClick={closeMenu}>تماس با ما</a></li>
                    </ul>
                </nav>

                {/* آیکون‌ها */}
                <div className="header-icons">
                    <span className="icon">🔍</span>
                    <span className="icon">🛒</span>
                    <span className="icon">👤</span>
                </div>
            </div>
        </header>
    );
};

export default Header;