import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SiteData } from '../types';

const HomePage: React.FC = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return <div>خطا در دریافت اطلاعات</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>وبسایت ما</h1>
      </header>
      
      <main style={styles.main}>
        <section style={styles.section}>
          <h2>تصاویر</h2>
          <div style={styles.imageGrid}>
            {data.images.map((image) => (
              <div key={image.id} style={styles.imageCard}>
                <img 
                  src={`http://localhost:5000${image.url}`} 
                  alt={image.title}
                  style={styles.image}
                />
                <p>{image.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2>درباره ما</h2>
          <p style={styles.paragraph}>{data.about}</p>
        </section>

        <section style={styles.section}>
          <h2>آدرس</h2>
          <p style={styles.paragraph}>{data.address}</p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2024 سایت نمونه</p>
        <a href="/admin" style={styles.adminLink}>ورود به پنل ادمین</a>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    direction: 'rtl' as const,
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    borderBottom: '2px solid #eee',
    paddingBottom: '20px',
  },
  main: {
    marginBottom: '40px',
  },
  section: {
    marginBottom: '40px',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  imageCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    padding: '10px',
    textAlign: 'center' as const,
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
  },
  paragraph: {
    lineHeight: '1.6',
    fontSize: '16px',
    color: '#333',
  },
  footer: {
    textAlign: 'center' as const,
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    color: '#666',
  },
  adminLink: {
    color: '#007bff',
    textDecoration: 'none',
    marginRight: '20px',
  }
};

export default HomePage;