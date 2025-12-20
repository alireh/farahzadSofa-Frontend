// export interface SiteData {
//   about: string;
//   address: string;
//   email: string;
//   phone: string;
//   images: Image[];
//   articles: Article[];
// }

// export interface Image {
//   id: number;
//   url: string;
//   title: string;
// }

// export interface Article {
//   id: number;
//   title: string;
//   content: string;
// }

export interface SiteData {
  about: string;
  address: string;
  email: string;
  phone: string;
  images: Image[];
  articles: Article[];
  carouselImages: Image[];
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

export interface Image {
  id: number;
  url: string;
  title: string;
  type: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  title: string;
  image_url: string | null;
  description: string;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  image_url: string;
  price: number;
  discount_percent: number;
  description: string;
  features: string;
  is_active: boolean;
  created_at: string;
}
export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}
export interface SiteSettings {
  id: number;
  show_carousel: boolean;
  max_carousel_items: number;
  article_display_mode: string;
  updated_at: string;
}