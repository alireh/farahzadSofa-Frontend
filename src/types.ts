export interface SiteData {
  about: string;
  address: string;
  images: Image[];
}

export interface Image {
  id: number;
  url: string;
  title: string;
}