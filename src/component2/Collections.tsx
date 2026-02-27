import React, { useState, useEffect } from 'react';
import '../style2/Collections.css';
import SubCollection from './SubCollection';

interface CollectionItem {
  id: number;
  title: string;
  desktop_image: string;
  mobile_image: string;
}

interface HeaderProps {
  searchQuery: string;
}

const Collections: React.FC<HeaderProps> = ({ searchQuery }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

  useEffect(() => {
    fetch('/api/collections') // از سرور بگیر
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
      </div>

      <div id="sub-collection">
        {selectedCollection && (
          <SubCollection collectionId={selectedCollection.id} selectedCollection={selectedCollection.title} />
        )}
      </div>
    </section>
  );
};

export default Collections;