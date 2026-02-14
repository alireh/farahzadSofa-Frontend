// components/Header.tsx
import React from 'react';
import '../style2/Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">
                <h2>مبل‌شاپ</h2>
            </div>
            <nav className="nav-menu">
                <ul>
                    <li><a href="#">خانه</a></li>
                    <li><a href="#">محصولات</a></li>
                    <li><a href="#">درباره ما</a></li>
                    <li><a href="#">تماس با ما</a></li>
                </ul>
            </nav>
            <div className="header-icons">
                <span className="icon">🔍</span>
                <span className="icon">🛒</span>
                <span className="icon">👤</span>
            </div>
        </header>
    );
};

export default Header;