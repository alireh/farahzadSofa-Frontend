import React, { useEffect, useState } from 'react';
import '../style2/Products.css';

interface Product {
    id: number;
    title: string;
    image: string;
    rating: number;
    price: number;
}

interface ProductsProps {
    searchQuery?: string; // تبدیل به optional با مقدار پیش‌فرض
}

const Products: React.FC<ProductsProps> = ({ searchQuery = '' }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/best-sellers")
            .then(r => r.json())
            .then(setProducts)
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars.push(<span key={i} className="star half">★</span>);
            } else {
                stars.push(<span key={i} className="star">★</span>);
            }
        }
        return stars;
    };

    const formatPrice = (price: number) =>
        price.toLocaleString('fa-IR') + ' تومان';

    // فیلتر کردن محصولات بر اساس جستجو
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="products">
            <h2 className="section-title">محصولات پرفروش</h2>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} />
                        <h3>{product.title}</h3>

                        <div className="rating">
                            {renderStars(product.rating)}
                            <span className="rating-value">{product.rating}</span>
                        </div>

                        <p className="price">{formatPrice(product.price)}</p>
                        <button className="add-to-cart">افزودن به سبد خرید</button>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products-found">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                    stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3>محصولی یافت نشد!</h3>
                        <p>متاسفانه محصولی با این مشخصات پیدا نکردیم.</p>
                        <span className="suggestion">پیشنهاد: کلمات دیگری را امتحان کنید</span>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Products;