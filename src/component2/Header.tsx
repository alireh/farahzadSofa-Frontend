import "../style2/Header.css";
import React, { useState, useEffect } from "react";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  order_index: number;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ✅ fetch منو + scroll
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        const data: MenuItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ بستن منو در resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <img src="/assets/images/logo.jpg" alt="مبل فرحزاد" />
        </div>

        {/* hamburger */}
        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="منو"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ✅ منوی داینامیک */}
        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            {loading && <li>در حال بارگذاری...</li>}

            {!loading &&
              items.map((item) => (
                <li key={item.id}>
                  <a href={item.url} onClick={closeMenu}>
                    {item.title}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        {/* icons */}
        <div className="header-icons">
          <span className="icon">🔍</span>
          <span className="icon">🛒</span>

          {token ? (
            <span
              className="icon"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              🚪
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
