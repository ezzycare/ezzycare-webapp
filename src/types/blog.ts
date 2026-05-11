import { StaticImageData } from 'next/image';

export interface Post {
  id: number;
  title: string;
  highlight: string;
  author: string;
  createdAt: string;
  avatar: string | StaticImageData;
  image: string | StaticImageData;
  link?: string;
}

export interface PostData {
  items: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
