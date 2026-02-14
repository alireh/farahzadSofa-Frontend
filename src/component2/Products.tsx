// components/Products.tsx
import React from 'react';
import '../style2/Products.css';

interface Product {
    id: number;
    title: string;
    image: string;
    rating: number;
    price: number;
}

const Products: React.FC = () => {
    const products: Product[] = [
        { id: 1, title: 'مبل راحتی شیک', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.5, price: 3500000 },
        { id: 2, title: 'میز ناهارخوری لوکس', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.8, price: 5200000 },
        { id: 3, title: 'کنسول مدرن', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.3, price: 2800000 },
        { id: 4, title: 'اکسسوری دکوری', image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.6, price: 850000 },
        { id: 5, title: 'مبل تختخواب‌شو', image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.7, price: 4800000 },
        { id: 6, title: 'صندلی گیمینگ', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.4, price: 2200000 },
        { id: 7, title: 'میز جلو مبلی', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.2, price: 1800000 },
        { id: 8, title: 'آینه دکوراتیو', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.9, price: 1250000 }
    ];

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

    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR') + ' تومان';
    };

    return (
        <section className="products">
            <h2 className="section-title">محصولات پرفروش</h2>
            <div className="products-grid">
                {products.map((product) => (
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
        </section>
    );
};

export default Products;