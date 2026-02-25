// components/Description.tsx
import React, { useEffect, useState } from "react";
import '../style2/Description.css';

interface DescriptionData {
    title: string;
    content: string;
}

const Description: React.FC = () => {
    const [descriptionData, setDescriptionData] = useState<DescriptionData | null>(null);
    useEffect(() => {
        fetch("/api/description")
            .then(r => r.json())
            .then(setDescriptionData)
            .catch(console.error);
    }, []);

    return (
        <section className="description">
            <div className="description-container">
                <h2>{descriptionData?.title}</h2>
                <p>
                    {descriptionData?.content}
                </p>
            </div>
        </section>
    );
};

export default Description;