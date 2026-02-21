import '../style2/Header.css';
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  token?: string | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ token, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setTimeout(() => {
                document.getElementById('search-input')?.focus();
            }, 100);
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // اینجا می‌توانید منطق فیلتر کردن را اضافه کنید
        // dispatch search action
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        if (onLogout) {
            onLogout();
        }
        setShowLogoutConfirm(false);
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false);
    };

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

    // بستن سرچ با کلیک خارج
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchOpen && !(event.target as Element).closest('.search-container')) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

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

                {/* آیکون‌ها با سرچ */}
                <div className="header-icons">
                    <div className="search-container">
                        <span className="icon search-icon" onClick={toggleSearch}>🔍</span>
                        {searchOpen && (
                            <div className="search-box">
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="جستجو در محصولات..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                                <button className="search-submit">🔍</button>
                            </div>
                        )}
                    </div>
                    <span className="icon">🛒</span>
                    
                    {/* نمایش دکمه خروج فقط در صورت وجود token */}
                    {token && (
                        <span 
                            className="icon logout-icon" 
                            title="خروج"
                            onClick={handleLogoutClick}
                        >
                            🚪
                        </span>
                    )}
                </div>
            </div>

            {/* مودال تأیید خروج */}
            {showLogoutConfirm && (
                <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
                    <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>خروج از حساب کاربری</h3>
                        <p>آیا مطمئن هستید که می‌خواهید خارج شوید؟</p>
                        <div className="logout-modal-actions">
                            <button className="logout-confirm-btn" onClick={handleLogoutConfirm}>
                                بله، خارج شو
                            </button>
                            <button className="logout-cancel-btn" onClick={handleLogoutCancel}>
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;