import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../styles/website.css";
import Footer from "../components/footer";
import '../constant/pageSectionType'
import SEOHead from "../SEOHead";
import { Article, SocialLink } from "../types";
import '../styles/articlePage.css'

const ArticlePage: React.FC = () => {
    const [article, setArticle] = useState<Article>();

    const { id } = useParams<{ id: any }>();

    useEffect(() => {
        fetchArticle(id);
    }, []);

    const fetchArticle = async (id: string) => {
        try {
            const response = await axios.get(`/api/articles/${id}`);
            setArticle(response.data);
        } catch (error) {
            console.error("Error fetching category products:", error);
        }
    };

    return (
        <div className="App" dir="rtl">
            {/* افزودن Head SEO */}
            <SEOHead
                title="مبل فرحزاد - فروشگاه تخصصی مبلمان لوکس"
                description="فروشگاه آنلاین مبلمان فرحزاد، ارائه بهترین مبلمان منزل و اداری با کیفیت عالی و قیمت مناسب"
                keywords="مبلمان, مبل راحتی, کاناپه, صندلی, میز ناهارخوری, دکوراسیون منزل"
            />

            {article != null && (

                <div className="article-page mt-2">
                    {/* هدر مقاله */}
                    <header className="article-header">
                        <h1 className="article-title">{article.title}</h1>
                    </header>

                    {/* محتوای اصلی */}
                    <main className="article-content">
                        {/* تصویر مقاله (اگر موجود باشد) */}
                        {article.image_url && (
                            <div className="article-image-container">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="article-image"
                                // onError={(e) => {
                                //     e.target.style.display = 'none';
                                // }}
                                />
                            </div>
                        )}

                        {/* محتوای متنی */}
                        <div className="article-text">
                            {article.content.split('\n').map((paragraph, index) => (
                                <p key={index} className="article-paragraph">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </main>
                </div>
            )}

            {/* Header/Navigation */}
            <header className="header">
                <h1 className="logo">مبل فرحزاد</h1>
            </header>
        </div>
    );
};

export default ArticlePage;