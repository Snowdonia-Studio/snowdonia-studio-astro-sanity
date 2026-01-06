export interface Post {
  _id: string;
  title: string;
  subtitle?: string;
  slug: {
    current: string
  };
  publishedAt?: string;
  mainImage?: any;
  body?: any;
  author?: {
    _id: string;
    name: string;
    image?: any;
  };
}