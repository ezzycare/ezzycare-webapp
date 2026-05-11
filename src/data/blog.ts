import BlogPostImage from '@/assets/img/blog-img.png';
import AuthorAvatar from '@/assets/img/author-avatar.png';
import { Post } from '@/types/blog';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const titles = [
  'Travel & Adventure',
  'Health & Wellness',
  'Technology & Innovation',
  'Food & Culture',
  'Business & Finance',
];

const authors = [
  'Jane Smith',
  'John Doe',
  'Mike Johnson',
  'Sarah Lee',
  'David Brown',
];

export const allPosts: Post[] = Array.from({ length: 120 }, (_, i) => {
  const index = i + 1;

  return {
    id: index,
    title: `${titles[i % titles.length]} ${index}`,
    highlight:
      'Exploring the hidden gems of Southeast Asia and tips for budget travel.',
    author: authors[i % authors.length],
    createdAt: dayjs().subtract(index, 'day').format('Do MMM, YYYY'),
    avatar: AuthorAvatar,
    image: BlogPostImage,
  };
});

export const paginatePosts = (page: number, limit: number) => {
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = allPosts.slice(start, end);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const posts = paginatePosts(1, 9);
