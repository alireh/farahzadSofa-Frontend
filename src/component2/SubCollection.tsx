// components/SubCollection.tsx
import React, { useState, useEffect } from "react";
import "../style2/SubCollection.css";

interface SubProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  old_price?: number;
  collection_id: number;
}

interface SubCollectionProps {
  selectedCollection: string;
  collectionId: number; // از parent میاد
}

const SubCollection: React.FC<SubCollectionProps> = ({
  selectedCollection,
  collectionId,
}) => {
  const [products, setProducts] = useState<SubProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ فقط یک useEffect کافی است
  useEffect(() => {
    if (!collectionId) return;

    setLoading(true);

    fetch(`/api/sub-collections/${collectionId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collectionId]);

  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + " تومان";

  return (
    <section className="sub-collection">
      <h3 className="sub-collection-title">
        محصولات مرتبط با {selectedCollection}
      </h3>

      {loading ? (
        <div className="sub-loading">در حال بارگذاری...</div>
      ) : (
        <div className="sub-products-grid">
          {products.map((p) => (
            <div key={p.id} className="sub-product-card">
              <img src={p.image} alt={p.name} loading="lazy" />
              <h4>{p.name}</h4>

              <div className="price-container">
                {!p.old_price && (
                  <span className="old-price" style={{ height: '3.2em' }}>

                  </span>
                )}
                {p.old_price && (
                  <span className="old-price">
                    {formatPrice(p.old_price)}
                  </span>
                )}
                <span className="current-price">
                  {formatPrice(p.price)}
                </span>
              </div>

              <button className="add-to-cart-btn">
                افزودن به سبد خرید
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SubCollection;