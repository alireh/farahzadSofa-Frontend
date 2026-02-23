import { useEffect, useState } from "react";
import '../style2/Hero.css'

interface HeroData {
  desktop_image: string;
  mobile_image: string;
}

const Hero: React.FC = () => {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then(setHero);
  }, []);

  const imageUrl =
    window.innerWidth < 768
      ? hero?.mobile_image
      : hero?.desktop_image;      

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="hero-content">
        
      </div>
    </section>
  );
};

export default Hero;