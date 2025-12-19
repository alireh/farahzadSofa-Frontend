// components/SEOHead.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    lang?: string;
    canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
    title = "مبل فرحزاد - فروشگاه تخصصی مبلمان لوکس",
    description = "فروشگاه آنلاین مبلمان فرحزاد - ارائه بهترین و باکیفیت‌ترین مبلمان منزل و اداری با قیمت مناسب",
    keywords = "مبل, مبلمان, دکوراسیون, منزل, اداری, صندلی, کاناپه, میز, فروش مبلمان",
    image = "/images/logo-og.jpg",
    url = "https://mobelfarahrzad.ir",
    type = "website",
    author = "مبل فرحزاد",
    lang = "fa",
    canonical = ""
}) => {

    const fullUrl = canonical || url;

    return (
        <Helmet>
            {/* تگ‌های اصلی */}
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />
            {fullUrl && <link rel="canonical" href={fullUrl} />}

            {/* Viewport برای ریسپانسیو */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            {fullUrl && <meta property="og:url" content={fullUrl} />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content="fa_IR" />
            <meta property="og:site_name" content="مبل فرحزاد" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            {fullUrl && <meta name="twitter:url" content={fullUrl} />}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema.org */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FurnitureStore",
                    "name": "مبل فرحزاد",
                    "url": "https://mobelfarahrzad.ir",
                    "logo": "https://mobelfarahrzad.ir/images/logo.png",
                    "description": description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "تهران",
                        "addressRegion": "تهران",
                        "addressCountry": "IR"
                    },
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+98-21-12345678",
                        "contactType": "پشتیبانی"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEOHead;