// components/SubCollection.tsx
import React, { useState, useEffect } from 'react';
import '../style2/SubCollection.css';

interface SubProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  collectionId: number;
}

interface SubCollectionProps {
  selectedCollection: string;
}

const SubCollection: React.FC<SubCollectionProps> = ({ selectedCollection }) => {
  const [products, setProducts] = useState<SubProduct[]>([]);

  // داده‌های محصولات هر کالکشن
  const allProducts: SubProduct[] = [
    // مبل
    { id: 1, name: 'مبل راحتی سه نفره', image: '/assets/images/products/mbel-1.webp', price: 4500000, oldPrice: 5200000, collectionId: 1 },
    { id: 2, name: 'مبل تختخواب‌شو', image: '/assets/images/products/mbel-2.webp', price: 5800000, collectionId: 1 },
    { id: 3, name: 'مبل کلاسیک سلطنتی', image: '/assets/images/products/mbel-3.webp', price: 8900000, oldPrice: 10500000, collectionId: 1 },
    { id: 4, name: 'مبل راحتی دونفره', image: '/assets/images/products/mbel-4.webp', price: 3800000, collectionId: 1 },
    
    // اکسسوری
    { id: 5, name: 'آینه دکوراتیو طلایی', image: '/assets/images/products/accessory-1.webp', price: 850000, collectionId: 2 },
    { id: 6, name: 'گلدان سرامیکی', image: '/assets/images/products/accessory-2.webp', price: 450000, collectionId: 2 },
    { id: 7, name: 'آباژور مدرن', image: '/assets/images/products/accessory-3.webp', price: 650000, collectionId: 2 },
    { id: 8, name: 'تابلو دکوراتیو', image: '/assets/images/products/accessory-4.webp', price: 1200000, collectionId: 2 },
    
    // کنسول
    { id: 9, name: 'کنسول چوبی کلاسیک', image: '/assets/images/products/console-1.webp', price: 2800000, collectionId: 3 },
    { id: 10, name: 'کنسول مدرن با آینه', image: '/assets/images/products/console-2.webp', price: 3500000, collectionId: 3 },
    { id: 11, name: 'کنسول فلزی مینیمال', image: '/assets/images/products/console-3.webp', price: 2200000, collectionId: 3 },
    { id: 12, name: 'کنسول لاکچری', image: '/assets/images/products/console-4.webp', price: 5200000, collectionId: 3 },
    
    // میز غذاخوری
    { id: 13, name: 'میز غذاخوری ۶ نفره', image: '/assets/images/products/table-1.webp', price: 6200000, collectionId: 4 },
    { id: 14, name: 'میز غذاخوری ۸ نفره', image: '/assets/images/products/table-2.webp', price: 8500000, collectionId: 4 },
    { id: 15, name: 'میز غذاخوری شیشه‌ای', image: '/assets/images/products/table-3.webp', price: 4800000, collectionId: 4 },
    { id: 16, name: 'میز غذاخوری تاشو', image: '/assets/images/products/table-4.webp', price: 3200000, collectionId: 4 },
    
    // جلومبلی
    { id: 17, name: 'میز جلو مبلی چوبی', image: '/assets/images/products/coffee-1.webp', price: 1200000, collectionId: 5 },
    { id: 18, name: 'میز جلو مبلی شیشه‌ای', image: '/assets/images/products/coffee-2.webp', price: 1500000, collectionId: 5 },
    { id: 19, name: 'ست جلو مبلی', image: '/assets/images/products/coffee-3.webp', price: 2800000, collectionId: 5 },
    { id: 20, name: 'میز عسلی', image: '/assets/images/products/coffee-4.webp', price: 750000, collectionId: 5 }
  ];

  // مپ کردن عنوان کالکشن به ID
  const getCollectionId = (title: string): number => {
    const map: { [key: string]: number } = {
      'مبل': 1,
      'اکسسوری': 2,
      'کنسول': 3,
      'میز غذاخوری': 4,
      'جلومبلی': 5
    };
    return map[title] || 1;
  };

  useEffect(() => {
    const collectionId = getCollectionId(selectedCollection);
    const filtered = allProducts.filter(p => p.collectionId === collectionId);
    setProducts(filtered);
  }, [selectedCollection]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <section className="sub-collection">
      <h3 className="sub-collection-title">محصولات مرتبط با {selectedCollection}</h3>
      <div className="sub-products-grid">
        {products.map(product => (
          <div key={product.id} className="sub-product-card">
            <img src={product.image} alt={product.name} loading="lazy" />
            <h4>{product.name}</h4>
            <div className="price-container">
              {product.oldPrice && (
                <span className="old-price">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="current-price">{formatPrice(product.price)}</span>
            </div>
            <button className="add-to-cart-btn">افزودن به سبد خرید</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubCollection;