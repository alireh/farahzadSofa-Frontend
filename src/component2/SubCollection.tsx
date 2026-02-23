// components/SubCollection.tsx
import React, { useState, useEffect } from 'react';
import '../style2/SubCollection.css';

interface SubCollectionProps {
  selectedCollection: string;
  collectionId: number;
}

interface SubProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  old_price?: number;
}

interface SubCollectionProps {
  selectedCollection: string;
}

const SubCollection: React.FC<SubCollectionProps> = ({ selectedCollection, collectionId }) => {
  const [products, setProducts] = useState<SubProduct[]>([]);

  useEffect(() => {
    fetch(`/api/subcollections/${collectionId}`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [collectionId]);

  const formatPrice = (price: number) =>
    price.toLocaleString('fa-IR') + ' تومان';

  return (
    <section className="sub-collection">
      <h3 className="sub-collection-title">محصولات مرتبط با {selectedCollection}</h3>
      <div className="sub-products-grid">
        {products.map(p => (
          <div key={p.id} className="sub-product-card">
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <div className="price-container">
              {p.old_price && <span className="old-price">{formatPrice(p.old_price)}</span>}
              <span className="current-price">{formatPrice(p.price)}</span>
            </div>
            <button className="add-to-cart-btn">افزودن به سبد خرید</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubCollection;