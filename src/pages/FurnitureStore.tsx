import React from 'react';
import '../styles/furnitureStore.css';
import Header from '../component2/Header';
import Hero from '../component2/Hero';
import Collections from '../component2/Collections';
import Products from '../component2/Products';
import Description from '../component2/Description';
import Footer from '../component2/Footer';

const FurnitureStore = () => {
    return (
        <div className="App">
            <Header />
            <Hero />
            <Collections />
            <Products />
            <Description />
            <Footer />
        </div>
    );
};

export default FurnitureStore;