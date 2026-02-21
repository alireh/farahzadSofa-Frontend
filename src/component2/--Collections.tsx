// components/Collections.tsx
import React from 'react';
import '../style2/Collections.css';

interface CollectionItem1 {
    id: number;
    title: string;
    image: string;
}

const Collections1: React.FC = () => {
    const collections: CollectionItem1[] = [
        { id: 1, title: 'مبل', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
        { id: 2, title: 'اکسسوری', image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
        { id: 3, title: 'کنسول', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
        { id: 4, title: 'میز غذاخوری', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
        { id: 5, title: 'جلومبلی', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
    ];

    return (
        <section className="collections">
            <h2 className="section-title">کالکشن‌های ویژه</h2>
            <div className="collections-grid">
                {collections.map((item) => (
                    <div key={item.id} className="collection-item">
                        <img src={item.image} alt={item.title} />
                        <h3>{item.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Collections1;