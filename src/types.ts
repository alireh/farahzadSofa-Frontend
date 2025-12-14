export interface SiteData {
  about: string;
  address: string;
  email: string;
  phone: string;
  images: Image[];
}

export interface Image {
  id: number;
  url: string;
  title: string;
}