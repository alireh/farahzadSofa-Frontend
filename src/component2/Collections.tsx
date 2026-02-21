// components/Collections.tsx (آپدیت شده)
import React, { useState } from 'react';
import SubCollection from './SubCollection';
import '../style2/Collections.css';

interface CollectionItem {
  id: number;
  title: string;
  image: string;
  desktopImage: string;
  mobileImage: string;
}

const Collections: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>('مبل');

  const collections: CollectionItem[] = [
    { 
      id: 1, 
      title: 'مبل', 
      image: '/assets/images/collections/mbel.webp',
      desktopImage: '/assets/images/collections/mbel-desktop.webp',
      mobileImage: '/assets/images/collections/mbel-mobile.webp'
    },
    { 
      id: 2, 
      title: 'اکسسوری', 
      image: '/assets/images/collections/accessory.webp',
      desktopImage: '/assets/images/collections/accessory-desktop.webp',
      mobileImage: '/assets/images/collections/accessory-mobile.webp'
    },
    { 
      id: 3, 
      title: 'کنسول', 
      image: '/assets/images/collections/console.webp',
      desktopImage: '/assets/images/collections/console-desktop.webp',
      mobileImage: '/assets/images/collections/console-mobile.webp'
    },
    { 
      id: 4, 
      title: 'میز غذاخوری', 
      image: '/assets/images/collections/dining.webp',
      desktopImage: '/assets/images/collections/dining-desktop.webp',
      mobileImage: '/assets/images/collections/dining-mobile.webp'
    },
    { 
      id: 5, 
      title: 'جلومبلی', 
      image: '/assets/images/collections/coffee.webp',
      desktopImage: '/assets/images/collections/coffee-desktop.webp',
      mobileImage: '/assets/images/collections/coffee-mobile.webp'
    }
  ];

  const handleCollectionClick = (title: string) => {
    setSelectedCollection(title);
    // اسکرول به بخش محصولات
    const element = document.getElementById('sub-collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="collections">
      <h2 className="section-title">کالکشن‌های ویژه</h2>
      <div className="collections-grid">
        {collections.map((item) => (
          <div 
            key={item.id} 
            className={`collection-item ${selectedCollection === item.title ? 'active' : ''}`}
            onClick={() => handleCollectionClick(item.title)}
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={item.mobileImage} />
              <source media="(min-width: 769px)" srcSet={item.desktopImage} />
              <img src={item.image} alt={item.title} loading="lazy" />
            </picture>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
      
      {/* بخش SubCollection */}
      <div id="sub-collection">
        <SubCollection selectedCollection={selectedCollection} />
      </div>
    </section>
  );
};

export default Collections;