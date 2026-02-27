import React, { useEffect, useState } from 'react';
import '../style2/Products.css';

interface Product {
    id: number;
    title: string;
    image: string;
    rating: number;
    price: number;
}

interface HeaderProps {
    searchQuery: string;
}

const Products: React.FC<HeaderProps> = ({ searchQuery }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/best-sellers")
            .then(r => r.json())
            .then(setProducts);
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
        </section>
    );
};

export default Products;