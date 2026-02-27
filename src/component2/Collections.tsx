import React, { useState, useEffect } from 'react';
import '../style2/Collections.css';
import SubCollection from './SubCollection';

interface CollectionItem {
  id: number;
  title: string;
  desktop_image: string;
  mobile_image: string;
}

interface CollectionsProps {
  searchQuery?: string;
}

const Collections: React.FC<CollectionsProps> = ({ searchQuery = '' }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  useEffect(() => {
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => {
        setCollections(data);
        if (data.length > 0) setSelectedCollection(data[0]);
      })
      .catch(console.error);
  }, []);

  const handleCollectionClick = (collection: CollectionItem) => {
    setSelectedCollection(collection);
    const element = document.getElementById('sub-collection');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // فیلتر کردن کلکشن‌ها بر اساس جستجو
  const filteredCollections = collections.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="collections">
      <h2 className="section-title">کالکشن‌های ویژه</h2>

      <div className="collections-grid">
        {filteredCollections.map(item => (
          <div
            key={item.id}
            className={`collection-item ${selectedCollection?.id === item.id ? 'active' : ''}`}
            onClick={() => handleCollectionClick(item)}
          >
            <picture>
              <source media="(max-width:768px)" srcSet={item.mobile_image} />
              <source media="(min-width:769px)" srcSet={item.desktop_image} />
              <img src={item.desktop_image} alt={item.title} />
            </picture>
            <h3>{item.title}</h3>
          </div>
        ))}

        {/* استایل خوشگل برای وقتی کلکشنی پیدا نشد */}
        {filteredCollections.length === 0 && (
          <div className="no-collections-found">
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H14" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="3" stroke="#9b87f5" strokeWidth="2" />
                  <path d="M21 21L20 20" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>کالکشنی یافت نشد!</h3>
              <p>متاسفانه کالکشنی با عنوان "{searchQuery}" پیدا نکردیم.</p>
              <span className="suggestion">✨ پیشنهاد: کلمات دیگری را جستجو کنید</span>
            </div>
          </div>
        )}
      </div>

      <div id="sub-collection">
        {selectedCollection && filteredCollections.length > 0 && (
          <SubCollection
            collectionId={selectedCollection.id}
            selectedCollection={selectedCollection.title}
          />
        )}
      </div>
    </section>
  );
};

export default Collections;